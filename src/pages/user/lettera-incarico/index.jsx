import {
  Alert, Box, Button, Card, Checkbox, CircularProgress, Divider,
  FormControlLabel, Grid, Stack, Step, StepLabel, Stepper, TextField, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const STEPS = ["Dati Personali", "Dati Fiscali", "Lettera di Incarico"];

const LetteraIncarico = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const profile = user?.user_profile || {};

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [testo, setTesto] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [form, setForm] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    date_of_birth: profile.date_of_birth || "",
    city: profile.city || "",
    codice_fiscale: user?.codice_fiscale || user?.tax_code || "",
    address: profile.address || "",
    zipcode: profile.zipcode || "",
    state: profile.state || "",
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Check status
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("api/wp/lettera-incarico/status");
        setStatus(data?.data);
      } catch {}
      setStatusLoading(false);
    })();
  }, []);

  // Load testo when reaching step 3
  useEffect(() => {
    if (step === 2) {
      (async () => {
        try {
          const { data } = await axiosInstance.get("api/wp/lettera-incarico/testo");
          setTesto(data?.data?.testo || "");
        } catch {}
      })();
    }
  }, [step]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      await axiosInstance.put("api/user/profile", fd);
      enqueueSnackbar("Dati salvati!", { variant: "success" });
      setStep(step + 1);
    } catch (err) {
      enqueueSnackbar("Errore nel salvataggio", { variant: "error" });
    }
    setLoading(false);
  };

  const handleAccetta = async () => {
    if (!accepted) {
      enqueueSnackbar("Devi accettare i termini", { variant: "warning" });
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("api/wp/lettera-incarico/accetta");
      enqueueSnackbar("Lettera accettata!", { variant: "success" });
      setStatus({ accettata: true, data: new Date().toISOString() });
    } catch (err) {
      enqueueSnackbar(err?.error || "Errore", { variant: "error" });
    }
    setLoading(false);
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await axiosInstance.get("api/wp/lettera-incarico/pdf", { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "lettera_incarico.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      enqueueSnackbar("Errore download", { variant: "error" });
    }
  };

  if (statusLoading) return <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress sx={{ color: ORO }} /></Box>;

  // Already accepted
  if (status?.accettata) {
    return (
      <Page title="Lettera di Incarico">
        <Box sx={{ px: 3, pb: 4 }}>
          <Card sx={{ ...cs, p: 4, textAlign: "center", maxWidth: 600, mx: "auto", mt: 4 }}>
            <Iconify icon="mdi:check-decagram" width={60} sx={{ color: "#4CAF50", mb: 2 }} />
            <Typography variant="h5" fontWeight={700} color={ESPRESSO} mb={1}>Lettera di Incarico Accettata</Typography>
            <Typography sx={{ color: MUTED, mb: 3 }}>
              Accettata il {new Date(status.data).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="mdi:file-pdf-box" />} onClick={handleDownloadPdf}
              sx={{ bgcolor: "#E24B4A", "&:hover": { bgcolor: "#C0392B" }, fontWeight: 700, textTransform: "none", borderRadius: 2 }}>
              Scarica PDF
            </Button>
          </Card>
        </Box>
      </Page>
    );
  }

  return (
    <Page title="Lettera di Incarico">
      <Box sx={{ px: 3, pb: 4, maxWidth: 700, mx: "auto" }}>
        {/* Hero */}
        <Card sx={{ bgcolor: "#FAF6EF", borderRadius: 4, p: 3, mb: 3, border: `1px solid ${alpha(ORO, 0.2)}` }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:file-sign" width={28} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color={ESPRESSO}>Lettera di Incarico</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: MUTED }}>Completa i tuoi dati e accetta la lettera per operare come incaricato EVEA</Typography>
            </Box>
          </Stack>
        </Card>

        {/* Stepper */}
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel StepIconProps={{ sx: { color: ORO, "&.Mui-active": { color: ORO }, "&.Mui-completed": { color: "#4CAF50" } } }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Dati Personali */}
        {step === 0 && (
          <Card sx={{ ...cs, p: 3 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>
              <Iconify icon="mdi:account" width={20} sx={{ mr: 1, verticalAlign: "middle", color: ORO }} />
              Dati Personali
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Nome" value={form.first_name} onChange={set("first_name")} required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Cognome" value={form.last_name} onChange={set("last_name")} required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Data di nascita" type="date" value={form.date_of_birth} onChange={set("date_of_birth")} InputLabelProps={{ shrink: true }} required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Luogo di nascita (Città)" value={form.city} onChange={set("city")} required />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Button variant="contained" onClick={() => setStep(1)} disabled={!form.first_name || !form.last_name}
                sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none", borderRadius: 2 }}>
                Avanti
              </Button>
            </Box>
          </Card>
        )}

        {/* Step 2: Dati Fiscali */}
        {step === 1 && (
          <Card sx={{ ...cs, p: 3 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>
              <Iconify icon="mdi:file-document" width={20} sx={{ mr: 1, verticalAlign: "middle", color: ORO }} />
              Dati Fiscali e Indirizzo
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth size="small" label="Codice Fiscale" value={form.codice_fiscale} onChange={set("codice_fiscale")} inputProps={{ maxLength: 16, style: { textTransform: "uppercase" } }} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size="small" label="Indirizzo" value={form.address} onChange={set("address")} required />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth size="small" label="CAP" value={form.zipcode} onChange={set("zipcode")} inputProps={{ maxLength: 5 }} required />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth size="small" label="Città" value={form.city} onChange={set("city")} required />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth size="small" label="Provincia" value={form.state} onChange={set("state")} inputProps={{ maxLength: 2, style: { textTransform: "uppercase" } }} />
              </Grid>
            </Grid>
            <Stack direction="row" justifyContent="space-between" mt={3}>
              <Button onClick={() => setStep(0)} sx={{ color: MUTED, textTransform: "none" }}>Indietro</Button>
              <Button variant="contained" onClick={handleSaveProfile} disabled={loading || !form.codice_fiscale || !form.address}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="mdi:content-save" />}
                sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none", borderRadius: 2 }}>
                Salva e Continua
              </Button>
            </Stack>
          </Card>
        )}

        {/* Step 3: Lettera */}
        {step === 2 && (
          <Card sx={{ ...cs, p: 3 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>
              <Iconify icon="mdi:file-sign" width={20} sx={{ mr: 1, verticalAlign: "middle", color: ORO }} />
              Lettera di Incarico
            </Typography>

            <Box sx={{ maxHeight: 400, overflow: "auto", p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px solid #eee", mb: 2, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.6, color: "#333" }}>
              {testo || "Caricamento..."}
            </Box>

            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              Leggendo e accettando questa lettera, confermi di voler operare come incaricato alla vendita a domicilio per EVEA Global S.r.l. ai sensi della L. 173/2005.
            </Alert>

            <FormControlLabel
              control={<Checkbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)} sx={{ color: ORO, "&.Mui-checked": { color: ORO } }} />}
              label={<Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: ESPRESSO }}>Dichiaro di aver letto e accetto integralmente la Lettera di Incarico</Typography>}
            />

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between">
              <Button onClick={() => setStep(1)} sx={{ color: MUTED, textTransform: "none" }}>Indietro</Button>
              <Button variant="contained" onClick={handleAccetta} disabled={loading || !accepted}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="mdi:check-bold" />}
                sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" }, fontWeight: 700, textTransform: "none", borderRadius: 2, px: 4 }}>
                Accetto e Firmo
              </Button>
            </Stack>
          </Card>
        )}
      </Box>
    </Page>
  );
};

export default LetteraIncarico;
