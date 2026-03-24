import { Avatar, Box, Button, Card, CircularProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const canvasRef = useRef(null);
  const profile = user?.user_profile || {};

  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(profile.profile_image || null);
  const [uploading, setUploading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const nome = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || user?.username || "";
  const cf = user?.codice_fiscale || user?.tax_code || "N/A";
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

    // Subtitle
    ctx.fillStyle = ORO;
    ctx.font = "bold 10px Arial";
    ctx.letterSpacing = "2px";
    ctx.fillText("TESSERINO INCARICATO ALLA VENDITA A DOMICILIO", W / 2, 58);

    // Photo area
    const photoX = 30;
    const photoY = 85;
    const photoW = 100;
    const photoH = 125;

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
      img.src = photoUrl;
    } else {
      // Placeholder
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
      ctx.fillText("Carica foto", photoX + photoW / 2, photoY + photoH / 2);
      drawFields(ctx, W, H);
      setGenerated(true);
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

      drawField("Nome e Cognome", nome);
      drawField("Luogo e Data di Nascita", `${citta}, ${dob}`);
      drawField("Codice Fiscale", cf);
      drawField("Data di Rilascio", dataRilascio);

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
      ctx.fillText(`N° ${numero}`, 80, 244);

      // Legal text
      ctx.fillStyle = MUTED;
      ctx.font = "italic 8px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Ai sensi della Legge 17 agosto 2005, n. 173", W / 2, H - 45);
      ctx.fillText("Art. 3 — Incaricato alla vendita a domicilio", W / 2, H - 33);

      // Footer
      ctx.fillStyle = "#bbb";
      ctx.font = "7px Arial";
      ctx.fillText("EVEA Global S.r.l. — P.IVA 00000000000", W / 2, H - 12);
    }
  }, [photoUrl, nome, cf, citta, dob, dataRilascio, numero]);

  useEffect(() => {
    generateCard();
  }, [generateCard]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `tesserino_${user?.username || "evea"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    enqueueSnackbar("Tesserino scaricato!", { variant: "success" });
  };

  return (
    <Page title="Tesserino">
      <Box sx={{ px: 3, pb: 4, maxWidth: 750, mx: "auto" }}>
        {/* Hero */}
        <Card sx={{ bgcolor: AVORIO, borderRadius: 4, p: 3, mb: 3, border: `1px solid ${alpha(ORO, 0.2)}` }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:card-account-details" width={28} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color={ESPRESSO}>Tesserino Incaricato</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: MUTED }}>Carica una foto formato fototessera e scarica il tuo tesserino</Typography>
            </Box>
          </Stack>
        </Card>

        {/* Upload foto */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #f0ece6" }}>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>
            <Iconify icon="mdi:camera" width={20} sx={{ mr: 1, verticalAlign: "middle", color: ORO }} />
            Foto Fototessera
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
                {photoUrl ? "Cambia Foto" : "Carica Foto"}
                <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
              </Button>
              <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>
                Formato: JPG o PNG, sfondo bianco, viso frontale
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Anteprima tesserino */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #f0ece6" }}>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>
            <Iconify icon="mdi:eye" width={20} sx={{ mr: 1, verticalAlign: "middle", color: ORO }} />
            Anteprima Tesserino
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
              Scarica PNG
            </Button>
            <Button variant="outlined" onClick={generateCard}
              startIcon={<Iconify icon="mdi:refresh" />}
              sx={{ borderColor: ORO, color: ORO, fontWeight: 700, textTransform: "none", borderRadius: 2 }}>
              Rigenera
            </Button>
          </Stack>
        </Card>

        {/* Info */}
        <Card sx={{ p: 2.5, borderRadius: 3, bgcolor: alpha(ORO, 0.04), border: `1px solid ${alpha(ORO, 0.15)}` }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Iconify icon="mdi:information" width={18} sx={{ color: ORO }} />
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO }}>Informazioni</Typography>
          </Stack>
          <Typography sx={{ fontSize: "0.75rem", color: MUTED, lineHeight: 1.6 }}>
            Il tesserino è obbligatorio per legge (L. 173/2005) per tutti gli incaricati alla vendita a domicilio.
            Deve essere esibito su richiesta durante l'attività di vendita.
            I dati vengono presi dal tuo profilo — assicurati che siano aggiornati.
          </Typography>
        </Card>
      </Box>
    </Page>
  );
};

export default Tesserino;
