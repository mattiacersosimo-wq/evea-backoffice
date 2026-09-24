import { Avatar, Box, Button, Card, CircularProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";
const CREMA = "#F0E8D8";
const AVORIO = "#FAF6EF";

const Tesserino = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const canvasRef = useRef(null);
  // Fetch profilo dedicato: il payload di /api/profile potrebbe non
  // includere user_profile in modo affidabile. Chiamata a /api/user-profile
  // (o fallback su /api/profile) garantisce dati anagrafici sempre presenti.
  const [profileData, setProfileData] = useState(null);
  const profile = profileData || user?.user_profile || user?.userProfile || {};

  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(profile.profile_image || null);
  const [uploading, setUploading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    // Refetch profilo per garantire dati anagrafici presenti (fix 18/09/2026:
    // useAuth.user.user_profile a volte non e' popolato al primo render).
    (async () => {
      try {
        const { data } = await axiosInstance.get("api/profile");
        const u = data?.data?.user || {};
        const p = u.user_profile || u.userProfile || {};
        setProfileData(p);
      } catch (e) {
        // fallback: usa user_profile da useAuth se c'e'
      } finally {
        setProfileLoaded(true);
      }
    })();
  }, []);

  const nome = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || user?.username || "";
  const cf = user?.codice_fiscale || user?.tax_code || profileData?.codice_fiscale || "N/A";
  const citta = profile.city || "N/A";
  const dob = profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString("it-IT") : "N/A";
  const numero = `EVEA-${String(user?.id || 0).padStart(6, "0")}`;
  const dataRilascio = user?.promoter_at
    ? new Date(user.promoter_at).toLocaleDateString("it-IT")
    : new Date(user?.created_at || Date.now()).toLocaleDateString("it-IT");

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoUrl(URL.createObjectURL(file));
    setGenerated(false);
  };

  const generateCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 640;
    const H = 400;
    canvas.width = W;
    canvas.height = H;
    // Debug: log dati usati per generare (utile se ancora vuoto in prod)
    if (typeof window !== "undefined" && window.console) {
      console.log("[Tesserino] generateCard", { nome, cf, citta, dob, numero, hasPhoto: !!photoUrl });
    }

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, AVORIO);
    grad.addColorStop(1, CREMA);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 16);
    ctx.fill();

    // Border
    ctx.strokeStyle = ORO;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(2, 2, W - 4, H - 4, 14);
    ctx.stroke();

    // Header line
    ctx.fillStyle = ORO;
    ctx.fillRect(20, 68, W - 40, 2);

    // Company name
    ctx.fillStyle = ESPRESSO;
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText("EVEA Global S.r.l.", W / 2, 38);

    // Subtitle (letterSpacing rimosso: non standard Canvas 2D, supportato
    // solo Chrome >=99 / Firefox >=118. Su browser piu' vecchi puo' bloccare
    // silenziosamente il rendering del resto del canvas).
    ctx.fillStyle = ORO;
    ctx.font = "bold 10px Arial";
    ctx.fillText(t("tesserino.card_subtitle", "TESSERINO INCARICATO ALLA VENDITA A DOMICILIO"), W / 2, 58);

    // Photo area
    const photoX = 30;
    const photoY = 85;
    const photoW = 100;
    const photoH = 125;

    // Helper: disegna placeholder foto + fields (usato in caso no photo
    // o quando la foto fallisce a caricarsi)
    const drawPlaceholderAndFields = () => {
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoW, photoH, 4);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#ccc";
      ctx.font = "11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(t("tesserino.canvas_upload_photo", "Carica foto"), photoX + photoW / 2, photoY + photoH / 2);
      drawFields(ctx, W, H);
      setGenerated(true);
    };

    if (photoUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Photo border
        ctx.fillStyle = ORO;
        ctx.beginPath();
        ctx.roundRect(photoX - 2, photoY - 2, photoW + 4, photoH + 4, 6);
        ctx.fill();
        // Photo
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoW, photoH, 4);
        ctx.clip();
        ctx.drawImage(img, photoX, photoY, photoW, photoH);
        ctx.restore();
        drawFields(ctx, W, H);
        setGenerated(true);
      };
      // Fix 18/09/2026: se la foto fallisce a caricare (URL rotto, CORS,
      // 404) il canvas restava vuoto senza dati. Fallback su placeholder
      // + drawFields cosi' il tesserino mostra almeno i dati anagrafici.
      img.onerror = () => {
        console.warn("[Tesserino] photo failed to load, using placeholder", photoUrl);
        drawPlaceholderAndFields();
      };
      img.src = photoUrl;
    } else {
      drawPlaceholderAndFields();
    }

    function drawFields(ctx, W, H) {
      const lx = 150;
      let y = 95;
      const lineH = 38;

      const drawField = (label, value) => {
        ctx.fillStyle = MUTED;
        ctx.font = "bold 8px Arial";
        ctx.textAlign = "left";
        ctx.fillText(label.toUpperCase(), lx, y);
        ctx.fillStyle = ESPRESSO;
        ctx.font = "bold 15px Arial";
        ctx.fillText(value, lx, y + 16);
        y += lineH;
      };

      drawField(t("tesserino.field_name", "Nome e Cognome"), nome);
      drawField(t("tesserino.field_place_and_dob", "Luogo e Data di Nascita"), `${citta}, ${dob}`);
      drawField(t("tesserino.field_codice_fiscale", "Codice Fiscale"), cf);
      drawField(t("tesserino.field_issue_date", "Data di Rilascio"), dataRilascio);

      // Numero badge
      ctx.fillStyle = alpha(ORO, 0.1).replace("rgba", "rgb").replace(/,\s*[\d.]+\)/, ")");
      // Use simple color
      ctx.fillStyle = "#F5EDDA";
      ctx.beginPath();
      ctx.roundRect(30, 225, 100, 28, 4);
      ctx.fill();
      ctx.fillStyle = ORO;
      ctx.font = "bold 13px Arial";
      ctx.textAlign = "center";
      ctx.fillText(t("tesserino.badge_number", "N° {{number}}", { number: numero }), 80, 244);

      // Legal text
      ctx.fillStyle = MUTED;
      ctx.font = "italic 8px Arial";
      ctx.textAlign = "center";
      ctx.fillText(t("tesserino.legal_line_1", "Ai sensi della Legge 17 agosto 2005, n. 173"), W / 2, H - 45);
      ctx.fillText(t("tesserino.legal_line_2", "Art. 3 — Incaricato alla vendita a domicilio"), W / 2, H - 33);

      // Footer
      ctx.fillStyle = "#bbb";
      ctx.font = "7px Arial";
      ctx.fillText(t("tesserino.footer_company", "EVEA Global S.r.l. — P.IVA 00000000000"), W / 2, H - 12);
    }
  }, [photoUrl, nome, cf, citta, dob, dataRilascio, numero, t]);

  useEffect(() => {
    // Genera SEMPRE, anche prima del fetch profilo (mostra i dati parziali
    // disponibili da useAuth). Quando arriva il profilo dal fetch, un
    // re-render scatta e il canvas viene rigenerato con dati completi.
    // Nessun gate su profileLoaded: se il fetch fallisce, il canvas mostra
    // comunque i dati di useAuth invece di restare vuoto.
    generateCard();
  }, [generateCard]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `tesserino_${user?.username || "evea"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    enqueueSnackbar(t("tesserino.downloaded_snackbar", "Tesserino scaricato!"), { variant: "success" });
  };

  return (
    <Page title={t("tesserino.page_title", "Tesserino")}>
      <Box sx={{ px: 3, pb: 4, maxWidth: 750, mx: "auto" }}>
        {/* Hero */}
        <Card sx={{ bgcolor: AVORIO, borderRadius: 4, p: 3, mb: 3, border: `1px solid ${alpha(ORO, 0.2)}` }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:card-account-details" width={28} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color={ESPRESSO}>{t("tesserino.hero_title", "Tesserino Incaricato")}</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: MUTED }}>{t("tesserino.hero_sub", "Carica una foto formato fototessera e scarica il tuo tesserino")}</Typography>
            </Box>
          </Stack>
        </Card>

        {/* Upload foto */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #f0ece6" }}>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>
            <Iconify icon="mdi:camera" width={20} sx={{ mr: 1, verticalAlign: "middle", color: ORO }} />
            {t("tesserino.section_photo", "Foto Fototessera")}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Avatar
              src={photoUrl}
              sx={{ width: 100, height: 125, borderRadius: 2, border: `2px solid ${photoUrl ? ORO : "#ddd"}`, bgcolor: "#f5f5f5" }}
              variant="rounded"
            >
              <Iconify icon="mdi:account" width={40} sx={{ color: "#ccc" }} />
            </Avatar>
            <Box>
              <Button variant="contained" component="label"
                startIcon={<Iconify icon="mdi:upload" />}
                sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none", borderRadius: 2, mb: 1 }}>
                {photoUrl ? t("tesserino.change_photo", "Cambia Foto") : t("tesserino.upload_photo", "Carica Foto")}
                <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
              </Button>
              <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>
                {t("tesserino.photo_format_hint", "Formato: JPG o PNG, sfondo bianco, viso frontale")}
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Anteprima tesserino */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #f0ece6" }}>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>
            <Iconify icon="mdi:eye" width={20} sx={{ mr: 1, verticalAlign: "middle", color: ORO }} />
            {t("tesserino.section_preview", "Anteprima Tesserino")}
          </Typography>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            />
          </Box>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={handleDownload}
              startIcon={<Iconify icon="mdi:download" />}
              sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" }, fontWeight: 700, textTransform: "none", borderRadius: 2, px: 4 }}>
              {t("tesserino.download_png", "Scarica PNG")}
            </Button>
            <Button variant="outlined" onClick={generateCard}
              startIcon={<Iconify icon="mdi:refresh" />}
              sx={{ borderColor: ORO, color: ORO, fontWeight: 700, textTransform: "none", borderRadius: 2 }}>
              {t("tesserino.regenerate", "Rigenera")}
            </Button>
          </Stack>
        </Card>

        {/* Info */}
        <Card sx={{ p: 2.5, borderRadius: 3, bgcolor: alpha(ORO, 0.04), border: `1px solid ${alpha(ORO, 0.15)}` }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Iconify icon="mdi:information" width={18} sx={{ color: ORO }} />
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO }}>{t("tesserino.info_title", "Informazioni")}</Typography>
          </Stack>
          <Typography sx={{ fontSize: "0.75rem", color: MUTED, lineHeight: 1.6 }}>
            {t("tesserino.info_body", "Il tesserino è obbligatorio per legge (L. 173/2005) per tutti gli incaricati alla vendita a domicilio. Deve essere esibito su richiesta durante l'attività di vendita. I dati vengono presi dal tuo profilo — assicurati che siano aggiornati.")}
          </Typography>
        </Card>
      </Box>
    </Page>
  );
};

export default Tesserino;
