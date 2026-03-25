import { Alert, Box, Button, Card, Chip, CircularProgress, Grid, LinearProgress, MenuItem, Stack, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

const STEPS = [
  { label: "Dati Personali", labelEn: "Personal Info", icon: "mdi:account-outline" },
  { label: "Dati Fiscali", labelEn: "Tax Info", icon: "mdi:file-document-outline" },
  { label: "Residenza", labelEn: "Address", icon: "mdi:home-outline" },
  { label: "Documento", labelEn: "ID Document", icon: "mdi:card-account-details-outline" },
  { label: "Dati Bancari", labelEn: "Bank Info", icon: "mdi:bank-outline" },
  { label: "Lettera Incarico", labelEn: "Agreement", icon: "mdi:file-sign" },
];

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

  useEffect(() => {
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/wp/onboarding/status");
        setStatus(r?.data);
        setForm(r?.data?.user || {});
        // Find first incomplete step
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
      // Refresh status
      const { data: r } = await axiosInstance.get("api/wp/onboarding/status");
      setStatus(r?.data);
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Errore nel salvataggio", { variant: "error" });
    }
    setSaving(false);
  };

  const skip = () => setStep((s) => Math.min(s + 1, 5));

  const finish = async () => {
    try {
      await axiosInstance.post("api/wp/onboarding/complete", new FormData());
      enqueueSnackbar("Onboarding completato!", { variant: "success" });
      navigate("/user/dashboard");
    } catch { enqueueSnackbar("Errore", { variant: "error" }); }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: ORO }} /></Box>;

  const pct = status?.pct || 0;

  return (
    <Page title="Onboarding">
      <Box sx={{ maxWidth: 700, mx: "auto", px: 2, py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <img src="/logo/evea_logo_small.png" alt="EVEA" style={{ width: 80, marginBottom: 16 }} />
          <Typography variant="h5" fontWeight={700} color={ESPRESSO}>Benvenuto in EVEA</Typography>
          <Typography sx={{ color: "#7A6A5C", fontSize: "0.85rem", mt: 0.5 }}>Completa il tuo profilo per iniziare</Typography>
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

        {/* Step Content */}
        <Card sx={{ p: 3, borderRadius: 3, border: "1px solid #f0ece6" }}>

          {/* Step 0: Personal */}
          {step === 0 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Dati Personali</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField fullWidth size="small" label="Nome" value={form.first_name || ""} onChange={(e) => set("first_name", e.target.value)} /></Grid>
                <Grid item xs={6}><TextField fullWidth size="small" label="Cognome" value={form.last_name || ""} onChange={(e) => set("last_name", e.target.value)} /></Grid>
                <Grid item xs={12}><TextField fullWidth size="small" label="Data di nascita" type="date" InputLabelProps={{ shrink: true }} value={form.date_of_birth || ""} onChange={(e) => set("date_of_birth", e.target.value)} /></Grid>
              </Grid>
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={skip} sx={{ color: "#aaa" }}>Salta</Button>
                <Button variant="contained" onClick={() => save("save-personal", { first_name: form.first_name, last_name: form.last_name, date_of_birth: form.date_of_birth })} disabled={saving} sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}>Salva e continua</Button>
              </Stack>
            </Stack>
          )}

          {/* Step 1: Fiscal */}
          {step === 1 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Dati Fiscali</Typography>
              <TextField fullWidth size="small" label="Codice Fiscale" value={form.codice_fiscale || ""} onChange={(e) => set("codice_fiscale", e.target.value.toUpperCase())} inputProps={{ maxLength: 16 }} />
              <TextField select fullWidth size="small" label="Regime Fiscale" value={form.regime_fiscale || "incaricato_occasionale"} onChange={(e) => set("regime_fiscale", e.target.value)}>
                <MenuItem value="incaricato_occasionale">Incaricato Occasionale</MenuItem>
                <MenuItem value="partita_iva">Partita IVA</MenuItem>
              </TextField>
              {form.regime_fiscale === "partita_iva" && (
                <>
                  <TextField fullWidth size="small" label="Partita IVA" value={form.vat_number || ""} onChange={(e) => set("vat_number", e.target.value)} inputProps={{ maxLength: 11 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}><TextField fullWidth size="small" label="Codice SDI" value={form.codice_sdi || ""} onChange={(e) => set("codice_sdi", e.target.value)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth size="small" label="PEC" value={form.pec || ""} onChange={(e) => set("pec", e.target.value)} /></Grid>
                  </Grid>
                </>
              )}
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(0)} sx={{ color: "#aaa" }}>Indietro</Button>
                <Stack direction="row" spacing={1}>
                  <Button onClick={skip} sx={{ color: "#aaa" }}>Salta</Button>
                  <Button variant="contained" onClick={() => save("save-fiscal", { codice_fiscale: form.codice_fiscale, regime_fiscale: form.regime_fiscale, vat_number: form.vat_number, codice_sdi: form.codice_sdi, pec: form.pec })} disabled={saving} sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}>Salva e continua</Button>
                </Stack>
              </Stack>
            </Stack>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Indirizzo di Residenza</Typography>
              <TextField fullWidth size="small" label="Indirizzo" value={form.address || ""} onChange={(e) => set("address", e.target.value)} />
              <Grid container spacing={2}>
                <Grid item xs={4}><TextField fullWidth size="small" label="CAP" value={form.zipcode || ""} onChange={(e) => set("zipcode", e.target.value)} inputProps={{ maxLength: 5 }} /></Grid>
                <Grid item xs={4}><TextField fullWidth size="small" label="Città" value={form.city || ""} onChange={(e) => set("city", e.target.value)} /></Grid>
                <Grid item xs={4}><TextField fullWidth size="small" label="Provincia" value={form.provincia || ""} onChange={(e) => set("provincia", e.target.value)} inputProps={{ maxLength: 2 }} placeholder="VR" /></Grid>
              </Grid>
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(1)} sx={{ color: "#aaa" }}>Indietro</Button>
                <Stack direction="row" spacing={1}>
                  <Button onClick={skip} sx={{ color: "#aaa" }}>Salta</Button>
                  <Button variant="contained" onClick={() => save("save-address", { address: form.address, city: form.city, zipcode: form.zipcode, state: form.state, provincia: form.provincia, country: "IT" })} disabled={saving} sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}>Salva e continua</Button>
                </Stack>
              </Stack>
            </Stack>
          )}

          {/* Step 3: Document */}
          {step === 3 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Documento di Identità</Typography>
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
                  <Button onClick={skip} sx={{ color: "#aaa" }}>Salta</Button>
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

          {/* Step 4: Bank */}
          {step === 4 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Dati Bancari</Typography>
              <TextField fullWidth size="small" label="IBAN" value={form.iban || ""} onChange={(e) => set("iban", e.target.value.toUpperCase())} placeholder="IT60X0542811101000000123456" />
              <TextField fullWidth size="small" label="Nome Banca" value={form.bank_name || ""} onChange={(e) => set("bank_name", e.target.value)} />
              <TextField fullWidth size="small" label="Intestatario conto" value={form.account_holder || `${form.first_name || ""} ${form.last_name || ""}`} onChange={(e) => set("account_holder", e.target.value)} />
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(3)} sx={{ color: "#aaa" }}>Indietro</Button>
                <Stack direction="row" spacing={1}>
                  <Button onClick={skip} sx={{ color: "#aaa" }}>Salta</Button>
                  <Button variant="contained" onClick={() => save("save-bank", { iban: form.iban, bank_name: form.bank_name, account_holder: form.account_holder })} disabled={saving} sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}>Salva e continua</Button>
                </Stack>
              </Stack>
            </Stack>
          )}

          {/* Step 5: Lettera */}
          {step === 5 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>Lettera di Incarico</Typography>
              {form.lettera_accettata ? (
                <Alert severity="success" sx={{ borderRadius: 2 }}>Lettera già accettata</Alert>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  La lettera di incarico è disponibile nella sezione dedicata. Puoi accettarla ora o dopo.
                </Alert>
              )}
              <Button variant="outlined" onClick={() => navigate("/user/lettera-incarico")} startIcon={<Iconify icon="mdi:file-sign" />} sx={{ borderColor: alpha(ORO, 0.3), color: ORO }}>
                {form.lettera_accettata ? "Vedi lettera di incarico" : "Vai alla lettera di incarico"}
              </Button>
              <Box sx={{ borderTop: "1px solid #eee", pt: 2, mt: 2 }}>
                <Typography variant="h6" fontWeight={700} color={ESPRESSO} sx={{ mb: 1 }}>Riepilogo</Typography>
                <Stack spacing={0.5}>
                  {Object.entries(status?.steps || {}).map(([k, v]) => (
                    <Stack key={k} direction="row" alignItems="center" spacing={1}>
                      <Iconify icon={v ? "mdi:check-circle" : "mdi:close-circle-outline"} width={18} sx={{ color: v ? "#4CAF50" : "#ddd" }} />
                      <Typography sx={{ fontSize: "0.8rem", color: v ? ESPRESSO : "#aaa" }}>
                        {STEPS[['personal', 'fiscal', 'address', 'document', 'bank', 'lettera'].indexOf(k)]?.label || k}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(4)} sx={{ color: "#aaa" }}>Indietro</Button>
                <Button variant="contained" onClick={finish} sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" }, fontWeight: 700, px: 4 }} startIcon={<Iconify icon="mdi:check-all" />}>
                  Completa Onboarding
                </Button>
              </Stack>
            </Stack>
          )}
        </Card>

        {/* Skip all */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button onClick={() => navigate("/user/dashboard")} sx={{ color: "#aaa", fontSize: "0.8rem" }}>
            Completa dopo — vai alla dashboard
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default OnboardingWizard;
