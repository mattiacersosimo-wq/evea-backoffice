import { Alert, Box, Button, Card, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, LinearProgress, MenuItem, Stack, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";
import { invalidateOnboardingStatus } from "src/hooks/useOnboardingStatus";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const DANGER = "#E24B4A";

const STEPS = [
  { label: "Dati Personali", icon: "mdi:account-outline" },
  { label: "Dati Fiscali", icon: "mdi:file-document-outline" },
  { label: "Residenza", icon: "mdi:home-outline" },
  { label: "Documento", icon: "mdi:card-account-details-outline" },
  { label: "Dati Bancari", icon: "mdi:bank-outline" },
  { label: "Lettera Incarico", icon: "mdi:file-sign" },
];

const isAdult = (dateString) => {
  if (!dateString) return false;
  const dob = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear() - (
    today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0
  );
  return age >= 18;
};

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({});
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const nullaOstaRef = useRef(null);

  // Step 6 checkboxes
  const [allegato_a, setAllegatoA] = useState(false);
  const [allegato_b, setAllegatoB] = useState(false);
  const [allegato_c, setAllegatoC] = useState(false);
  const [clausole, setClausole] = useState(false);
  const [consent_marketing, setConsentMarketing] = useState(false);
  const [consent_image, setConsentImage] = useState(false);

  // OTP for letter signature
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const sendOtp = async () => {
    setOtpSending(true);
    try {
      const { data } = await axiosInstance.post("api/wp/onboarding/send-letter-otp", {});
      setOtpSent(true);
      setOtpEmail(data?.message || "Codice inviato alla tua email");
      enqueueSnackbar("Codice OTP inviato alla tua email", { variant: "success" });
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Errore invio codice", { variant: "error" });
    }
    setOtpSending(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/wp/onboarding/status");
        setStatus(r?.data);
        setForm(r?.data?.user || {});
        const steps = r?.data?.steps || {};
        const stepKeys = ['personal', 'fiscal', 'address', 'document', 'bank', 'lettera'];
        const firstIncomplete = stepKeys.findIndex((k) => !steps[k]);
        if (firstIncomplete >= 0) setStep(firstIncomplete);
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (endpoint, data) => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
      await axiosInstance.post(`api/wp/onboarding/${endpoint}`, fd);
      enqueueSnackbar("Salvato!", { variant: "success" });
      setStep((s) => Math.min(s + 1, 5));
      const { data: r } = await axiosInstance.get("api/wp/onboarding/status");
      setStatus(r?.data);
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Errore nel salvataggio", { variant: "error" });
    }
    setSaving(false);
  };

  const acceptLetter = async () => {
    if (!allegato_a || !allegato_b || !allegato_c || !clausole) {
      enqueueSnackbar("Devi accettare tutti i documenti obbligatori e le clausole vessatorie.", { variant: "error" });
      return;
    }
    if (!otpCode || otpCode.length !== 6) {
      enqueueSnackbar("Inserisci il codice OTP a 6 cifre ricevuto via email.", { variant: "error" });
      return;
    }
    setSaving(true);
    try {
      await axiosInstance.post("api/wp/onboarding/accept-letter", {
        otp_code: otpCode,
        allegato_a_accepted: true,
        allegato_b_accepted: true,
        allegato_c_accepted: true,
        clausole_vessatorie_accepted: true,
        consent_marketing,
        consent_image,
      });
      // Invalidate cache so all components see the new active status
      await invalidateOnboardingStatus();
      enqueueSnackbar("Onboarding completato! Scaricamento Lettera in corso...", { variant: "success" });
      // Trigger download with token in URL (so it works in new tab too)
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
        const baseUrl = (axiosInstance.defaults.baseURL || "").replace(/\/$/, "");
        const downloadUrl = `${baseUrl}/api/wp/download-letter?token=${encodeURIComponent(token)}`;
        // Open in new tab — the backend will serve the PDF as attachment
        window.open(downloadUrl, "_blank");
      } catch (e) {
        console.error("PDF download failed:", e);
        enqueueSnackbar("Lettera salvata. Puoi scaricarla in seguito dal profilo.", { variant: "info" });
      }
      setTimeout(() => navigate("/user/dashboard"), 2000);
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Errore", { variant: "error" });
    }
    setSaving(false);
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: ORO }} /></Box>;

  const pct = status?.pct || 0;

  // Auto-derive regime fiscale from IVD fields
  const autoRegime = (form.has_piva_ivd || (form.has_other_ivd_income && Number(form.other_ivd_amount) >= 5000))
    ? "partita_iva" : (form.regime_fiscale || "incaricato_ocasionale");
  const autoInps = (form.previdential_status && form.previdential_status !== "none") ? "ridotta" : "standard";

  return (
    <Page title="Onboarding">
      <Box sx={{ maxWidth: 700, mx: "auto", px: 2, py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <img src="/logo/evea_logo_small.png" alt="EVEA" style={{ width: 80, marginBottom: 16 }} />
          <Typography variant="h5" fontWeight={700} color={ESPRESSO}>Benvenuto in EVEA</Typography>
          <Typography sx={{ color: "#7A6A5C", fontSize: "0.85rem", mt: 0.5 }}>Completa il tuo profilo per diventare Promotore</Typography>
          <Box sx={{ mt: 2, mx: "auto", maxWidth: 300 }}>
            <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4, bgcolor: "#eee", "& .MuiLinearProgress-bar": { bgcolor: ORO, borderRadius: 4 } }} />
            <Typography sx={{ fontSize: "0.7rem", color: "#aaa", mt: 0.5 }}>{pct}% completato</Typography>
          </Box>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4, "& .MuiStepLabel-label": { fontSize: "0.7rem" }, "& .Mui-active .MuiStepIcon-root": { color: ORO }, "& .Mui-completed .MuiStepIcon-root": { color: "#4CAF50" } }}>
          {STEPS.map((s, i) => (
            <Step key={i} completed={status?.steps?.[['personal', 'fiscal', 'address', 'document', 'bank', 'lettera'][i]]}>
              <StepLabel onClick={() => setStep(i)} sx={{ cursor: "pointer" }}>{s.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card sx={{ p: 3, borderRadius: 3, border: "1px solid #f0ece6" }}>

          {/* ═══ STEP 0: DATI PERSONALI ═══ */}
          {step === 0 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Dati Personali</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField fullWidth size="small" label="Nome *" value={form.first_name || ""} onChange={(e) => set("first_name", e.target.value)} /></Grid>
                <Grid item xs={6}><TextField fullWidth size="small" label="Cognome *" value={form.last_name || ""} onChange={(e) => set("last_name", e.target.value)} /></Grid>
                <Grid item xs={12}>
                  <TextField fullWidth size="small" label="Data di nascita *" type="date" InputLabelProps={{ shrink: true }} value={form.date_of_birth || ""} onChange={(e) => set("date_of_birth", e.target.value)} />
                  {form.date_of_birth && !isAdult(form.date_of_birth) && (
                    <Typography sx={{ fontSize: "0.75rem", color: DANGER, mt: 0.5 }}>
                      Devi essere maggiorenne (18+ anni) per registrarti come Promotore.
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!form.first_name || !form.last_name) { enqueueSnackbar("Nome e Cognome sono obbligatori.", { variant: "error" }); return; }
                    if (!form.date_of_birth) { enqueueSnackbar("La data di nascita è obbligatoria.", { variant: "error" }); return; }
                    if (!isAdult(form.date_of_birth)) { enqueueSnackbar("Devi essere maggiorenne per registrarti come Promotore.", { variant: "error" }); return; }
                    save("save-personal", { first_name: form.first_name, last_name: form.last_name, date_of_birth: form.date_of_birth });
                  }}
                  disabled={saving}
                  sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
                >Salva e continua</Button>
              </Stack>
            </Stack>
          )}

          {/* ═══ STEP 1: DATI FISCALI ═══ */}
          {step === 1 && (
            <Stack spacing={2.5}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Dati Fiscali e Dichiarazioni</Typography>

              <TextField fullWidth size="small" label="Codice Fiscale *" value={form.codice_fiscale || ""} onChange={(e) => set("codice_fiscale", e.target.value.toUpperCase())} inputProps={{ maxLength: 16 }} />

              {/* Domanda 1 — IVD income */}
              <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: ESPRESSO, mb: 1.5 }}>
                  Nell'anno solare in corso, hai percepito compensi da attività di Incaricato alle Vendite a Domicilio — cioè vendite porta a porta o presso il domicilio dei clienti (L. 173/2005) — presso altre aziende?
                </Typography>
                <Stack direction="row" spacing={2}>
                  <FormControlLabel control={<Checkbox checked={!form.has_other_ivd_income} onChange={() => { set("has_other_ivd_income", false); set("other_ivd_amount", ""); }} />} label="No" />
                  <FormControlLabel control={<Checkbox checked={!!form.has_other_ivd_income} onChange={() => set("has_other_ivd_income", true)} />} label="Sì" />
                </Stack>
                {form.has_other_ivd_income && (
                  <TextField fullWidth size="small" label="Importo netto complessivo (€)" type="number" value={form.other_ivd_amount || ""} onChange={(e) => set("other_ivd_amount", e.target.value)} sx={{ mt: 1.5 }} inputProps={{ min: 0 }} />
                )}
              </Box>

              {/* Domanda 2 — P.IVA */}
              <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: ESPRESSO, mb: 1.5 }}>
                  Sei già titolare di Partita IVA per attività di vendita a domicilio?
                </Typography>
                <Stack direction="row" spacing={2}>
                  <FormControlLabel control={<Checkbox checked={!form.has_piva_ivd} onChange={() => { set("has_piva_ivd", false); set("piva_number", ""); }} />} label="No" />
                  <FormControlLabel control={<Checkbox checked={!!form.has_piva_ivd} onChange={() => set("has_piva_ivd", true)} />} label="Sì" />
                </Stack>
                {form.has_piva_ivd && (
                  <TextField fullWidth size="small" label="Numero P.IVA" value={form.piva_number || ""} onChange={(e) => set("piva_number", e.target.value)} sx={{ mt: 1.5 }} inputProps={{ maxLength: 11 }} />
                )}
              </Box>

              {/* Auto-derived regime display */}
              <Box sx={{ p: 1.5, bgcolor: alpha(ORO, 0.06), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.2)}` }}>
                <Typography sx={{ fontSize: "0.8rem", color: ESPRESSO }}>
                  <strong>Regime Fiscale:</strong> {autoRegime === "partita_iva" ? "Incaricato con P.IVA" : "Incaricato Occasionale"}
                </Typography>
                {autoRegime === "partita_iva" && (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}><TextField fullWidth size="small" label="Partita IVA" value={form.vat_number || ""} onChange={(e) => set("vat_number", e.target.value)} inputProps={{ maxLength: 11 }} /></Grid>
                    <Grid item xs={6}><TextField fullWidth size="small" label="Codice SDI (facoltativo)" value={form.codice_sdi || ""} onChange={(e) => set("codice_sdi", e.target.value)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth size="small" label="PEC (facoltativa)" value={form.pec || ""} onChange={(e) => set("pec", e.target.value)} /></Grid>
                  </Grid>
                )}
              </Box>

              {/* Domanda 3 — Previdenziale */}
              <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: ESPRESSO, mb: 1.5 }}>
                  Qual è la tua situazione previdenziale?
                </Typography>
                <Stack spacing={0.5}>
                  {[
                    { value: "none", label: "Nessuna posizione previdenziale obbligatoria", inps: "Aliquota INPS piena (35,03%)" },
                    { value: "other_position", label: "Ho altra posizione previdenziale obbligatoria (es. lavoro dipendente)", inps: "Aliquota ridotta (24%)" },
                    { value: "retired", label: "Sono titolare di pensione", inps: "Aliquota ridotta (24%)" },
                  ].map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      control={<Checkbox checked={form.previdential_status === opt.value} onChange={() => set("previdential_status", opt.value)} />}
                      label={<><span>{opt.label}</span> <span style={{ fontSize: "0.75rem", color: ORO }}> — {opt.inps}</span></>}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Domanda 4 — Dipendente PA */}
              <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: ESPRESSO, mb: 1.5 }}>
                  Sei dipendente della Pubblica Amministrazione?
                </Typography>
                <Stack direction="row" spacing={2}>
                  <FormControlLabel control={<Checkbox checked={!form.is_public_employee} onChange={() => { set("is_public_employee", false); set("nulla_osta_file", null); }} />} label="No" />
                  <FormControlLabel control={<Checkbox checked={!!form.is_public_employee} onChange={() => set("is_public_employee", true)} />} label="Sì" />
                </Stack>
                {form.is_public_employee && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography sx={{ fontSize: "0.8rem", color: ESPRESSO, mb: 1 }}>Carica il nulla osta del tuo ente (obbligatorio)</Typography>
                    <input ref={nullaOstaRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={(e) => set("nulla_osta_file", e.target.files[0])} />
                    <Button variant="outlined" onClick={() => nullaOstaRef.current?.click()} startIcon={<Iconify icon="mdi:upload" />} sx={{ borderColor: alpha(ORO, 0.3), color: ORO }} size="small">
                      {form.nulla_osta_file ? form.nulla_osta_file.name : "Carica nulla osta"}
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Domanda 5 — Precedenti penali (OBBLIGATORIA per legge) */}
              <Box sx={{ p: 2, bgcolor: alpha(DANGER, 0.04), borderRadius: 2, border: `1px solid ${alpha(DANGER, 0.2)}` }}>
                <FormControlLabel
                  control={<Checkbox checked={!!form.criminal_record_declaration} onChange={(e) => set("criminal_record_declaration", e.target.checked)} sx={{ color: DANGER, "&.Mui-checked": { color: DANGER } }} />}
                  label={
                    <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO, fontWeight: 600 }}>
                      Dichiaro di non avere precedenti penali né procedimenti penali pendenti (art. 71 D.Lgs. 59/2010) *
                    </Typography>
                  }
                />
              </Box>

              {/* INPS threshold info */}
              <Box sx={{ p: 1.5, bgcolor: "#f9f9f9", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.75rem", color: "#666", lineHeight: 1.6 }}>
                  La soglia di €5.000,00 netti è cumulativa su tutti i compensi percepiti come Incaricato alle Vendite a Domicilio nell'anno solare, indipendentemente dal numero di aziende mandanti. Sei tenuto a comunicare ogni variazione entro 10 giorni a info@myevea.com.
                </Typography>
              </Box>

              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(0)} sx={{ color: "#aaa" }}>Indietro</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!form.codice_fiscale) { enqueueSnackbar("Il Codice Fiscale è obbligatorio.", { variant: "error" }); return; }
                    if (!form.criminal_record_declaration) { enqueueSnackbar("La dichiarazione sui precedenti penali è obbligatoria.", { variant: "error" }); return; }
                    if (form.is_public_employee && !form.nulla_osta_file) { enqueueSnackbar("Il nulla osta è obbligatorio per i dipendenti pubblici.", { variant: "error" }); return; }
                    save("save-fiscal", {
                      codice_fiscale: form.codice_fiscale,
                      regime_fiscale: autoRegime,
                      tipo_inps: autoInps,
                      has_other_ivd_income: form.has_other_ivd_income || false,
                      other_ivd_amount: form.other_ivd_amount || 0,
                      has_piva_ivd: form.has_piva_ivd || false,
                      piva_number: form.piva_number || "",
                      vat_number: form.vat_number || "",
                      codice_sdi: form.codice_sdi || "",
                      pec: form.pec || "",
                      previdential_status: form.previdential_status || "none",
                      is_public_employee: form.is_public_employee || false,
                      nulla_osta_file: form.nulla_osta_file || null,
                      criminal_record_declaration: form.criminal_record_declaration || false,
                    });
                  }}
                  disabled={saving}
                  sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
                >Salva e continua</Button>
              </Stack>
            </Stack>
          )}

          {/* ═══ STEP 2: RESIDENZA ═══ */}
          {step === 2 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Indirizzo di Residenza</Typography>
              <TextField fullWidth size="small" label="Indirizzo *" value={form.address || ""} onChange={(e) => set("address", e.target.value)} />
              <Grid container spacing={2}>
                <Grid item xs={4}><TextField fullWidth size="small" label="CAP *" value={form.zipcode || ""} onChange={(e) => set("zipcode", e.target.value)} inputProps={{ maxLength: 5 }} /></Grid>
                <Grid item xs={4}><TextField fullWidth size="small" label="Città *" value={form.city || ""} onChange={(e) => set("city", e.target.value)} /></Grid>
                <Grid item xs={4}><TextField fullWidth size="small" label="Provincia *" value={form.provincia || ""} onChange={(e) => set("provincia", e.target.value)} inputProps={{ maxLength: 2 }} placeholder="VR" /></Grid>
              </Grid>
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(1)} sx={{ color: "#aaa" }}>Indietro</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!form.address || !form.city || !form.zipcode || !form.provincia) { enqueueSnackbar("Tutti i campi dell'indirizzo sono obbligatori.", { variant: "error" }); return; }
                    save("save-address", { address: form.address, city: form.city, zipcode: form.zipcode, provincia: form.provincia, country: "IT" });
                  }}
                  disabled={saving}
                  sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
                >Salva e continua</Button>
              </Stack>
            </Stack>
          )}

          {/* ═══ STEP 3: DOCUMENTO (saltabile con avviso) ═══ */}
          {step === 3 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Documento di Identità</Typography>
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                Il documento è obbligatorio entro 30 giorni per il rilascio del Tesserino di Riconoscimento (D.Lgs. 114/1998).
              </Alert>
              <TextField select fullWidth size="small" label="Tipo documento" value={form.document_type || ""} onChange={(e) => set("document_type", e.target.value)}>
                <MenuItem value="carta_identita">Carta di Identità</MenuItem>
                <MenuItem value="passaporto">Passaporto</MenuItem>
                <MenuItem value="patente">Patente di Guida</MenuItem>
              </TextField>
              <Box>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: ESPRESSO, mb: 1 }}>Fronte</Typography>
                <input ref={frontRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={(e) => set("front_file", e.target.files[0])} />
                <Button variant="outlined" onClick={() => frontRef.current?.click()} startIcon={<Iconify icon="mdi:upload" />} sx={{ borderColor: alpha(ORO, 0.3), color: ORO }}>
                  {form.front_file ? form.front_file.name : (form.has_document_front ? "✓ Già caricato" : "Carica fronte")}
                </Button>
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: ESPRESSO, mb: 1 }}>Retro</Typography>
                <input ref={backRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={(e) => set("back_file", e.target.files[0])} />
                <Button variant="outlined" onClick={() => backRef.current?.click()} startIcon={<Iconify icon="mdi:upload" />} sx={{ borderColor: alpha(ORO, 0.3), color: ORO }}>
                  {form.back_file ? form.back_file.name : (form.has_document_back ? "✓ Già caricato" : "Carica retro")}
                </Button>
              </Box>
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(2)} sx={{ color: "#aaa" }}>Indietro</Button>
                <Stack direction="row" spacing={1}>
                  <Button onClick={() => setStep(4)} sx={{ color: "#aaa" }}>Salta per ora</Button>
                  <Button variant="contained" onClick={() => {
                    const fd = new FormData();
                    if (form.front_file) fd.append("front", form.front_file);
                    if (form.back_file) fd.append("back", form.back_file);
                    fd.append("document_type", form.document_type || "");
                    setSaving(true);
                    axiosInstance.post("api/wp/onboarding/upload-document", fd).then(() => {
                      enqueueSnackbar("Documento caricato!", { variant: "success" });
                      setStep(4);
                      axiosInstance.get("api/wp/onboarding/status").then(({ data: r }) => setStatus(r?.data));
                    }).catch(() => enqueueSnackbar("Errore upload", { variant: "error" })).finally(() => setSaving(false));
                  }} disabled={saving} sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}>Carica e continua</Button>
                </Stack>
              </Stack>
            </Stack>
          )}

          {/* ═══ STEP 4: DATI BANCARI ═══ */}
          {step === 4 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Dati Bancari</Typography>
              <TextField fullWidth size="small" label="IBAN (facoltativo, puoi aggiungere in seguito)" value={form.iban || ""} onChange={(e) => set("iban", e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="IT60X0542811101000000123456" helperText="Formato europeo SEPA — necessario per ricevere i pagamenti" />
              {form.iban && !form.iban.startsWith("IT") && (
                <TextField fullWidth size="small" label="BIC/SWIFT (obbligatorio per IBAN non italiano)" value={form.bic_swift || ""} onChange={(e) => set("bic_swift", e.target.value.toUpperCase())} placeholder="ABCDEFGH" />
              )}
              <TextField fullWidth size="small" label="Intestatario conto *" value={form.account_holder || `${form.first_name || ""} ${form.last_name || ""}`.trim()} onChange={(e) => set("account_holder", e.target.value)} />
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(3)} sx={{ color: "#aaa" }}>Indietro</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    save("save-bank", { iban: form.iban, bic_swift: form.bic_swift || "", bank_name: "", account_holder: form.account_holder || `${form.first_name || ""} ${form.last_name || ""}`.trim() });
                  }}
                  disabled={saving}
                  sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
                >Salva e continua</Button>
              </Stack>
            </Stack>
          )}

          {/* ═══ STEP 5: LETTERA DI INCARICO ═══ */}
          {step === 5 && (
            <Stack spacing={2.5}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Lettera di Incarico</Typography>

              <Box sx={{ p: 1.5, bgcolor: alpha(ORO, 0.06), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.2)}` }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="mdi:file-document-outline" width={20} sx={{ color: ORO }} />
                  <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO, flex: 1 }}>
                    Leggi il testo completo della Lettera di Incarico prima di accettare
                  </Typography>
                  <Button size="small" href="https://cdn.shopify.com/s/files/1/1013/1629/7050/files/Evea_Global_01_Lettera_Compatta_v3.pdf" target="_blank" rel="noreferrer" sx={{ color: ORO, fontWeight: 700, textTransform: "none" }}>
                    Apri PDF →
                  </Button>
                </Stack>
              </Box>

              {/* Riepilogo dati */}
              <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>Riepilogo dei tuoi dati</Typography>
                {[
                  ["Nome e Cognome", `${form.first_name || ""} ${form.last_name || ""}`],
                  ["Codice Fiscale", form.codice_fiscale],
                  ["Indirizzo", `${form.address || ""}, ${form.zipcode || ""} ${form.city || ""} (${form.provincia || ""})`],
                  ["IBAN", form.iban],
                  ["Regime Fiscale", form.regime_fiscale === "partita_iva" ? "Incaricato con P.IVA" : "Incaricato Occasionale"],
                ].map(([label, value]) => value && (
                  <Stack key={label} direction="row" spacing={1} sx={{ py: 0.3 }}>
                    <Typography sx={{ fontSize: "0.78rem", color: "#888", minWidth: 140 }}>{label}:</Typography>
                    <Typography sx={{ fontSize: "0.78rem", color: ESPRESSO, fontWeight: 500 }}>{value}</Typography>
                  </Stack>
                ))}
              </Box>

              <Divider />

              {/* Accettazione documenti obbligatori */}
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>Accettazione Documenti Contrattuali</Typography>
              <Stack spacing={1}>
                <FormControlLabel
                  control={<Checkbox checked={allegato_a} onChange={(e) => setAllegatoA(e.target.checked)} sx={{ "&.Mui-checked": { color: ORO } }} />}
                  label={<Stack direction="row" alignItems="center" spacing={1}><Typography sx={{ fontSize: "0.85rem" }}>Ho letto e accetto il <strong>Codice di Condotta del Promotore (Allegato A)</strong> *</Typography><Button size="small" href="https://cdn.shopify.com/s/files/1/1013/1629/7050/files/Evea_Global_Allegato_A_Codice_Condotta_v3.pdf" target="_blank" rel="noreferrer" sx={{ color: ORO, fontSize: "0.75rem", p: 0, minWidth: 0 }}>Leggi →</Button></Stack>}
                />
                <FormControlLabel
                  control={<Checkbox checked={allegato_b} onChange={(e) => setAllegatoB(e.target.checked)} sx={{ "&.Mui-checked": { color: ORO } }} />}
                  label={<Stack direction="row" alignItems="center" spacing={1}><Typography sx={{ fontSize: "0.85rem" }}>Ho letto e accetto il <strong>Piano Compensi (Allegato B)</strong> *</Typography><Button size="small" href="https://cdn.shopify.com/s/files/1/1013/1629/7050/files/Evea_Global_02_Piano_Compensi_v3.pdf" target="_blank" rel="noreferrer" sx={{ color: ORO, fontSize: "0.75rem", p: 0, minWidth: 0 }}>Leggi →</Button></Stack>}
                />
                <FormControlLabel
                  control={<Checkbox checked={allegato_c} onChange={(e) => setAllegatoC(e.target.checked)} sx={{ "&.Mui-checked": { color: ORO } }} />}
                  label={<Stack direction="row" alignItems="center" spacing={1}><Typography sx={{ fontSize: "0.85rem" }}>Ho letto l'<strong>Informativa Privacy (Allegato C)</strong> e autorizzo il trattamento dei dati *</Typography><Button size="small" href="https://cdn.shopify.com/s/files/1/1013/1629/7050/files/Evea_Global_Allegato_C_Privacy_v1.pdf" target="_blank" rel="noreferrer" sx={{ color: ORO, fontSize: "0.75rem", p: 0, minWidth: 0 }}>Leggi →</Button></Stack>}
                />
              </Stack>

              <Divider />

              {/* Consensi facoltativi */}
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>Consensi Facoltativi</Typography>
              <Stack spacing={0.5}>
                <FormControlLabel control={<Checkbox checked={consent_marketing} onChange={(e) => setConsentMarketing(e.target.checked)} />} label={<Typography sx={{ fontSize: "0.85rem" }}>Accetto di ricevere comunicazioni di marketing e newsletter (facoltativo)</Typography>} />
                <FormControlLabel control={<Checkbox checked={consent_image} onChange={(e) => setConsentImage(e.target.checked)} />} label={<Typography sx={{ fontSize: "0.85rem" }}>Autorizzo l'utilizzo della mia immagine per materiali promozionali (facoltativo)</Typography>} />
              </Stack>

              <Divider />

              {/* Clausole vessatorie */}
              <Box sx={{ p: 2, bgcolor: alpha(DANGER, 0.03), borderRadius: 2, border: `1px solid ${alpha(DANGER, 0.15)}` }}>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 1.5 }}>Approvazione Clausole Vessatorie (artt. 1341-1342 c.c.)</Typography>
                <Box sx={{ p: 1.5, bgcolor: "#fff", borderRadius: 1, border: "1px solid #eee", mb: 1.5, maxHeight: 160, overflowY: "auto" }}>
                  <Typography sx={{ fontSize: "0.78rem", color: "#555", lineHeight: 1.7 }}>
                    Clausole di recesso e cessazione automatica — Assenza di zona esclusiva — Divieto di incassare — Divieto e-commerce — Clawback provvigioni — Modifica unilaterale dei Documenti Contrattuali — Decadenza provvigioni indirette alla disdetta — Foro di Roma — Cross-sponsoring vietato — Inattività e chiusura codice — Regole cambio sponsor — Riservatezza triennale post-cessazione — Divieto di chargeback — Chiusura a discrezione della Società.
                  </Typography>
                </Box>
                <FormControlLabel
                  control={<Checkbox checked={clausole} onChange={(e) => setClausole(e.target.checked)} sx={{ color: DANGER, "&.Mui-checked": { color: DANGER } }} />}
                  label={<Typography sx={{ fontSize: "0.85rem", color: ESPRESSO, fontWeight: 600 }}>Approvo specificamente le clausole sopra elencate ai sensi degli artt. 1341 e 1342 c.c. *</Typography>}
                />
              </Box>

              <Divider />

              {/* OTP Verification */}
              <Box sx={{ p: 2, bgcolor: alpha("#1976D2", 0.05), borderRadius: 2, border: `2px solid ${alpha("#1976D2", 0.3)}` }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <Iconify icon="mdi:shield-check-outline" width={22} sx={{ color: "#1976D2" }} />
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ESPRESSO }}>Verifica Identita' (Firma Elettronica)</Typography>
                </Stack>
                <Typography sx={{ fontSize: "0.8rem", color: "#555", mb: 1.5 }}>
                  Per firmare digitalmente la Lettera di Incarico, ricevi un codice di verifica via email e inseriscilo qui sotto. Questa procedura conferisce valore legale alla tua firma elettronica.
                </Typography>

                {!otpSent ? (
                  <Button
                    variant="contained"
                    onClick={sendOtp}
                    disabled={otpSending || !allegato_a || !allegato_b || !allegato_c || !clausole}
                    startIcon={otpSending ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : <Iconify icon="mdi:email-fast-outline" />}
                    sx={{ bgcolor: "#1976D2", "&:hover": { bgcolor: "#1565C0" }, fontWeight: 700, textTransform: "none" }}
                  >
                    {otpSending ? "Invio in corso..." : "Invia codice via email"}
                  </Button>
                ) : (
                  <Stack spacing={1.5}>
                    <Typography sx={{ fontSize: "0.78rem", color: "#1976D2", fontWeight: 600 }}>
                      ✓ Codice inviato. Controlla la tua casella email (anche spam).
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      label="Inserisci codice OTP a 6 cifre"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      inputProps={{ maxLength: 6, style: { letterSpacing: 8, fontSize: "1.3rem", textAlign: "center", fontWeight: 700 } }}
                      sx={{ bgcolor: "#fff" }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={sendOtp}
                      disabled={otpSending}
                      sx={{ alignSelf: "flex-start", textTransform: "none", color: "#1976D2", borderColor: "#1976D2" }}
                    >
                      Reinvia codice
                    </Button>
                  </Stack>
                )}
              </Box>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button onClick={() => setStep(4)} sx={{ color: "#aaa" }}>Indietro</Button>
                <Button
                  variant="contained"
                  onClick={acceptLetter}
                  disabled={saving || !allegato_a || !allegato_b || !allegato_c || !clausole || !otpSent || otpCode.length !== 6}
                  startIcon={saving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <Iconify icon="mdi:check-all" />}
                  sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" }, "&.Mui-disabled": { bgcolor: "#ccc" }, fontWeight: 700, px: 3 }}
                >
                  Firma e Completa Onboarding
                </Button>
              </Stack>
            </Stack>
          )}

        </Card>
      </Box>
    </Page>
  );
};

export default OnboardingWizard;
