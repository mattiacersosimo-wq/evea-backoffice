import { Alert, Autocomplete, Box, Button, Card, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, LinearProgress, MenuItem, Radio, RadioGroup, Stack, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import apiError from "src/utils/api-error";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import CodiceFiscale from "codice-fiscale-js";
import { COMUNI } from "codice-fiscale-js/src/lista-comuni";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";
import { invalidateOnboardingStatus } from "src/hooks/useOnboardingStatus";
import { convertHeicIfNeeded } from "src/utils/heicConverter";

// Trasforma in formato Autocomplete {nome, prov, code}, solo comuni attivi.
// La lista include anche gli Stati esteri (provincia "EE", codici Z___): chi e'
// nato all'estero ha nel CF il codice dello Stato, non della citta'.
const listaComuni = COMUNI
  .filter((c) => c[3] === 1)
  .map((c) => ({ code: c[0], prov: c[1], nome: c[2] }));

// L'elenco ministeriale scrive gli accenti come apostrofo finale: PERU',
// CITTA' DEL VATICANO, SAO TOME'. Chi digita usa l'accento vero, quindi senza
// normalizzare "Peru'" e "Perù" non si trovano e l'utente conclude di non poter
// completare l'onboarding.
const normalizzaRicerca = (s) => (s || "")
  .toLowerCase()
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .replace(/['`’]/g, "")
  .trim();

// Calcola CF a partire dai dati anagrafici (ritorna stringa o null se dati incompleti)
const computeCfFromForm = (f) => {
  if (!f.first_name || !f.last_name || !f.date_of_birth || !f.gender || !f.birthplace) return null;
  try {
    const d = new Date(f.date_of_birth);
    if (isNaN(d.getTime())) return null;
    const cf = new CodiceFiscale({
      name: f.first_name,
      surname: f.last_name,
      gender: f.gender,
      day: d.getUTCDate(),
      month: d.getUTCMonth() + 1,
      year: d.getUTCFullYear(),
      birthplace: f.birthplace,
      birthplaceProvincia: f.birthplaceProvincia || undefined,
    });
    return cf.code;
  } catch {
    return null;
  }
};

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const DANGER = "#E24B4A";

const STEP_KEYS = [
  { key: "personal", fallback: "Dati Personali", icon: "mdi:account-outline" },
  { key: "fiscal", fallback: "Dati Fiscali", icon: "mdi:file-document-outline" },
  { key: "residence", fallback: "Residenza", icon: "mdi:home-outline" },
  { key: "document", fallback: "Documento", icon: "mdi:card-account-details-outline" },
  { key: "bank", fallback: "Dati Bancari", icon: "mdi:bank-outline" },
  { key: "letter", fallback: "Lettera Incarico", icon: "mdi:file-sign" },
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

// Bozza dello step Lettera, tenuta in locale per sopravvivere al ricaricamento
// dell'app: su Android uscire verso la mail per leggere il codice azzerava il
// form. Viene ripulita a firma completata e da clearSession al logout.
const LETTER_DRAFT_KEY = "onboarding_letter_draft";

const readLetterDraft = () => {
  try {
    return JSON.parse(localStorage.getItem(LETTER_DRAFT_KEY)) || {};
  } catch (e) {
    return {};
  }
};

const writeLetterDraft = (draft) => {
  try {
    localStorage.setItem(LETTER_DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    /* storage pieno o non disponibile: la bozza e' un comfort, non un requisito */
  }
};

const clearLetterDraft = () => {
  try {
    localStorage.removeItem(LETTER_DRAFT_KEY);
  } catch (e) {
    /* idem */
  }
};

const OnboardingWizard = () => {
  const { t } = useTranslation();
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
  // Su Android l'app viene ricaricata quando l'utente esce per leggere la mail
  // col codice: senza persistenza tornava indietro con le caselle svuotate e
  // il campo del codice sparito, pur avendo un OTP valido nella casella.
  // Il codice NON si salva: e' una firma elettronica, resta solo in memoria.
  const [allegato_a, setAllegatoA] = useState(() => readLetterDraft().allegato_a === true);
  const [allegato_b, setAllegatoB] = useState(() => readLetterDraft().allegato_b === true);
  const [allegato_c, setAllegatoC] = useState(() => readLetterDraft().allegato_c === true);
  const [clausole, setClausole] = useState(() => readLetterDraft().clausole === true);
  const [consent_marketing, setConsentMarketing] = useState(false);
  const [consent_image, setConsentImage] = useState(false);

  // OTP for letter signature
  const [otpSent, setOtpSent] = useState(() => readLetterDraft().otpSent === true);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const sendOtp = async () => {
    setOtpSending(true);
    try {
      const { data } = await axiosInstance.post("api/wp/onboarding/send-letter-otp", {});
      setOtpSent(true);
      setOtpCode("");
      setOtpEmail(data?.message || t("onboarding.otp.sent_to_email", "Codice inviato alla tua email"));
      enqueueSnackbar(
        t("onboarding.otp.sent_notice", "Codice inviato. Vale 15 minuti: usa l'ultimo che ricevi, i precedenti non sono più validi."),
        { variant: "success" }
      );
    } catch (e) {
      enqueueSnackbar(apiError(e, t("onboarding.otp.send_error", "Errore invio codice")), { variant: "error" });
    }
    setOtpSending(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/wp/onboarding/status");
        if (r?.data?.onboarding_done) {
          navigate("/user/dashboard");
          return;
        }
        setStatus(r?.data);
        const u = r?.data?.user || {};
        // Mappa i nomi backend (id_document_*) verso quelli usati nel form (document_*)
        setForm({
          ...u,
          document_type: u.document_type || u.id_document_type || "",
          document_number: u.document_number || u.id_document_number || "",
          document_issuer: u.document_issuer || u.id_document_issuer || "",
          document_issued_at: u.document_issued_at || u.id_document_issued_at || "",
          document_expires_at: u.document_expires_at || u.id_document_expires_at || "",
          nationality: u.nationality || "IT",
        });
        // Pre-flag consensi facoltativi con lo stato attuale (GDPR-safe: se
        // l'utente ha gia' acconsentito al signup Shopify deve vedere il
        // checkbox flaggato e poter revocare esplicitamente togliendo la spunta).
        setConsentMarketing(u.marketing_consent === true);
        setConsentImage(u.consent_image === true);
        const steps = r?.data?.steps || {};
        const stepKeys = ['personal', 'fiscal', 'address', 'document', 'bank', 'lettera'];
        const firstIncomplete = stepKeys.findIndex((k) => !steps[k]);
        if (firstIncomplete >= 0) setStep(firstIncomplete);
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  // Salva la bozza a ogni cambio: se l'app si ricarica mentre l'utente e' nella
  // casella di posta, al rientro ritrova le caselle spuntate e il campo codice.
  useEffect(() => {
    writeLetterDraft({ allegato_a, allegato_b, allegato_c, clausole, otpSent });
  }, [allegato_a, allegato_b, allegato_c, clausole, otpSent]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (endpoint, data) => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
      await axiosInstance.post(`api/wp/onboarding/${endpoint}`, fd);
      enqueueSnackbar(t("onboarding.toast.saved", "Salvato!"), { variant: "success" });
      setStep((s) => Math.min(s + 1, 5));
      const { data: r } = await axiosInstance.get("api/wp/onboarding/status");
      setStatus(r?.data);
    } catch (e) {
      enqueueSnackbar(apiError(e, t("onboarding.toast.save_error", "Errore nel salvataggio")), { variant: "error" });
    }
    setSaving(false);
  };

  const acceptLetter = async () => {
    if (!allegato_a || !allegato_b || !allegato_c || !clausole) {
      enqueueSnackbar(t("onboarding.letter.must_accept_all", "Devi accettare tutti i documenti obbligatori e le clausole vessatorie."), { variant: "error" });
      return;
    }
    if (!otpCode || otpCode.length !== 6) {
      enqueueSnackbar(t("onboarding.letter.otp_6_digits", "Inserisci il codice OTP a 6 cifre ricevuto via email."), { variant: "error" });
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
        // Nome canonico allineato al signup Shopify (/register-promoter).
        // Inviamo sempre il valore corrente esplicito (true/false) — mai
        // omettere il campo, altrimenti il backend lascerebbe lo stato invariato
        // e non potremmo mai revocare via unchecking del checkbox.
        marketing_consent: consent_marketing,
        consent_image,
      });
      // Firma completata: la bozza non serve piu'.
      clearLetterDraft();
      // Invalidate cache so all components see the new active status
      await invalidateOnboardingStatus();
      enqueueSnackbar(t("onboarding.toast.completed_downloading", "Onboarding completato! Scaricamento Lettera in corso..."), { variant: "success" });
      // Trigger download with token in URL (so it works in new tab too)
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
        const baseUrl = (axiosInstance.defaults.baseURL || "").replace(/\/$/, "");
        const downloadUrl = `${baseUrl}/api/download-letter?token=${encodeURIComponent(token)}`;
        // Open in new tab — the backend will serve the PDF as attachment
        window.open(downloadUrl, "_blank");
      } catch (e) {
        /* console.error */ // ("PDF download failed:", e);
        enqueueSnackbar(t("onboarding.toast.letter_saved_later", "Lettera salvata. Puoi scaricarla in seguito dal profilo."), { variant: "info" });
      }
      setTimeout(() => navigate("/user/dashboard"), 2000);
    } catch (e) {
      enqueueSnackbar(apiError(e, t("onboarding.toast.sign_error", "Errore durante la firma. Riprova.")), { variant: "error" });
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
    <Page title={t("onboarding.page_title", "Onboarding")}>
      <Box sx={{ maxWidth: 700, mx: "auto", px: 2, py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <img src="/logo/evea_logo_small.png" alt="EVEA" style={{ width: 80, marginBottom: 16 }} />
          <Typography variant="h5" fontWeight={700} color={ESPRESSO}>{t("onboarding.welcome", "Benvenuto in EVEA")}</Typography>
          <Typography sx={{ color: "#7A6A5C", fontSize: "0.85rem", mt: 0.5 }}>{t("onboarding.welcome_subtitle", "Completa il tuo profilo per diventare Promotore")}</Typography>
          <Box sx={{ mt: 2, mx: "auto", maxWidth: 300 }}>
            <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4, bgcolor: "#eee", "& .MuiLinearProgress-bar": { bgcolor: ORO, borderRadius: 4 } }} />
            <Typography sx={{ fontSize: "0.7rem", color: "#aaa", mt: 0.5 }}>{t("onboarding.pct_completed", "{{pct}}% completato", { pct })}</Typography>
          </Box>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4, "& .MuiStepLabel-label": { fontSize: "0.7rem" }, "& .Mui-active .MuiStepIcon-root": { color: ORO }, "& .Mui-completed .MuiStepIcon-root": { color: "#4CAF50" } }}>
          {STEP_KEYS.map((s, i) => (
            <Step key={i} completed={status?.steps?.[['personal', 'fiscal', 'address', 'document', 'bank', 'lettera'][i]]}>
              <StepLabel onClick={() => setStep(i)} sx={{ cursor: "pointer" }}>{t(`onboarding.step.${s.key}`, s.fallback)}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card sx={{ p: 3, borderRadius: 3, border: "1px solid #f0ece6" }}>

          {/* ═══ STEP 0: DATI PERSONALI ═══ */}
          {step === 0 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>{t("onboarding.step.personal", "Dati Personali")}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField fullWidth size="small" label={t("onboarding.form.first_name", "Nome *")} value={form.first_name || ""} onChange={(e) => set("first_name", e.target.value)} /></Grid>
                <Grid item xs={6}><TextField fullWidth size="small" label={t("onboarding.form.last_name", "Cognome *")} value={form.last_name || ""} onChange={(e) => set("last_name", e.target.value)} /></Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" label={t("onboarding.form.date_of_birth", "Data di nascita *")} type="date" InputLabelProps={{ shrink: true }} value={form.date_of_birth || ""} onChange={(e) => set("date_of_birth", e.target.value)} />
                  {form.date_of_birth && !isAdult(form.date_of_birth) && (
                    <Typography sx={{ fontSize: "0.75rem", color: DANGER, mt: 0.5 }}>
                      {t("onboarding.form.must_be_adult", "Devi essere maggiorenne (18+ anni) per registrarti come Promotore.")}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" select label={t("onboarding.form.gender", "Sesso *")} value={form.gender || ""} onChange={(e) => set("gender", e.target.value)}>
                    <MenuItem value="M">{t("onboarding.form.gender_male", "Maschio")}</MenuItem>
                    <MenuItem value="F">{t("onboarding.form.gender_female", "Femmina")}</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Autocomplete
                    size="small"
                    options={listaComuni}
                    getOptionLabel={(o) => typeof o === "string" ? o : `${o.nome} (${o.prov === "EE" ? t("onboarding.form.foreign_short", "Estero") : o.prov})`}
                    isOptionEqualToValue={(o, v) => o.nome === v.nome && o.prov === v.prov}
                    value={form.birthplace ? listaComuni.find((c) => c.nome === form.birthplace && c.prov === form.birthplaceProvincia) || null : null}
                    onChange={(_, v) => {
                      if (v) {
                        set("birthplace", v.nome);
                        set("birthplaceProvincia", v.prov);
                      } else {
                        set("birthplace", "");
                        set("birthplaceProvincia", "");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("onboarding.form.birthplace_or_country", "Comune o Stato estero di nascita *")}
                        placeholder={t("onboarding.form.type_to_search", "Inizia a digitare...")}
                        helperText={t("onboarding.form.birthplace_helper", "Se sei nato all'estero cerca lo Stato (es. Perù), non la città.")}
                      />
                    )}
                    filterOptions={(opts, state) => {
                      const q = normalizzaRicerca(state.inputValue);
                      if (!q) return opts.slice(0, 50);
                      // Prima chi inizia con la stringa cercata, poi chi la contiene:
                      // "stati uniti" continua a venire prima, ma "america" trova
                      // comunque STATI UNITI D'AMERICA invece di non dare nulla.
                      const conNome = opts.map((o) => ({ o, n: normalizzaRicerca(o.nome) }));
                      const iniziano = conNome.filter((x) => x.n.startsWith(q));
                      const contengono = conNome.filter((x) => !x.n.startsWith(q) && x.n.includes(q));
                      return [...iniziano, ...contengono].slice(0, 50).map((x) => x.o);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField select fullWidth size="small" label={t("onboarding.form.nationality", "Cittadinanza *")} value={form.nationality || "IT"} onChange={(e) => set("nationality", e.target.value)}>
                    <MenuItem value="IT">{t("onboarding.nationality.it", "Italiana")}</MenuItem>
                    <MenuItem value="FR">{t("onboarding.nationality.fr", "Francese")}</MenuItem>
                    <MenuItem value="DE">{t("onboarding.nationality.de", "Tedesca")}</MenuItem>
                    <MenuItem value="ES">{t("onboarding.nationality.es", "Spagnola")}</MenuItem>
                    <MenuItem value="CH">{t("onboarding.nationality.ch", "Svizzera")}</MenuItem>
                    <MenuItem value="AT">{t("onboarding.nationality.at", "Austriaca")}</MenuItem>
                    <MenuItem value="GB">{t("onboarding.nationality.gb", "Britannica")}</MenuItem>
                    <MenuItem value="US">{t("onboarding.nationality.us", "Statunitense")}</MenuItem>
                    <MenuItem value="ALTRA">{t("onboarding.nationality.other", "Altra")}</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={!!form.has_co_holder} onChange={(e) => { set("has_co_holder", e.target.checked); if (!e.target.checked) { set("co_holder_first_name", ""); set("co_holder_last_name", ""); set("co_holder_date_of_birth", ""); } }} />}
                    label={t("onboarding.form.add_co_holder", "Aggiungi un co-intestatario (es. coniuge, familiare)")}
                  />
                </Grid>
                {form.has_co_holder && (
                  <>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: "0.75rem", color: "#7A6A5C", fontStyle: "italic" }}>
                        {t("onboarding.form.co_holder_note", "Il co-intestatario è una figura informativa (es. coniuge): commissioni, ritenute e note di compenso restano intestate solo al titolare principale.")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth size="small" label={t("onboarding.form.co_holder_first_name", "Nome co-intestatario")} value={form.co_holder_first_name || ""} onChange={(e) => set("co_holder_first_name", e.target.value)} /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth size="small" label={t("onboarding.form.co_holder_last_name", "Cognome co-intestatario")} value={form.co_holder_last_name || ""} onChange={(e) => set("co_holder_last_name", e.target.value)} /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth size="small" type="date" label={t("onboarding.form.co_holder_date_of_birth", "Data di nascita co-intestatario")} InputLabelProps={{ shrink: true }} value={form.co_holder_date_of_birth || ""} onChange={(e) => set("co_holder_date_of_birth", e.target.value)} /></Grid>
                  </>
                )}
              </Grid>
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!form.first_name || !form.last_name) { enqueueSnackbar(t("onboarding.err.name_required", "Nome e Cognome sono obbligatori."), { variant: "error" }); return; }
                    if (!form.date_of_birth) { enqueueSnackbar(t("onboarding.err.dob_required", "La data di nascita è obbligatoria."), { variant: "error" }); return; }
                    if (!isAdult(form.date_of_birth)) { enqueueSnackbar(t("onboarding.err.must_be_adult_short", "Devi essere maggiorenne per registrarti come Promotore."), { variant: "error" }); return; }
                    if (!form.gender) { enqueueSnackbar(t("onboarding.err.gender_required", "Il sesso è obbligatorio."), { variant: "error" }); return; }
                    if (!form.birthplace) { enqueueSnackbar(t("onboarding.err.birthplace_required", "Il luogo di nascita è obbligatorio: seleziona il comune o, se sei nato all'estero, lo Stato."), { variant: "error" }); return; }
                    if (form.has_co_holder && (!form.co_holder_first_name || !form.co_holder_last_name)) { enqueueSnackbar(t("onboarding.err.co_holder_required", "Nome e cognome co-intestatario sono obbligatori (oppure deseleziona la voce)."), { variant: "error" }); return; }
                    save("save-personal", {
                      first_name: form.first_name, last_name: form.last_name, date_of_birth: form.date_of_birth,
                      gender: form.gender, birthplace: form.birthplace, birthplaceProvincia: form.birthplaceProvincia,
                      nationality: form.nationality || "IT",
                      co_holder_first_name: form.has_co_holder ? form.co_holder_first_name : "",
                      co_holder_last_name: form.has_co_holder ? form.co_holder_last_name : "",
                      co_holder_date_of_birth: form.has_co_holder ? form.co_holder_date_of_birth : "",
                    });
                  }}
                  disabled={saving}
                  sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
                >{t("onboarding.button.save_continue", "Salva e continua")}</Button>
              </Stack>
            </Stack>
          )}

          {/* ═══ STEP 1: DATI FISCALI ═══ */}
          {step === 1 && (
            <Stack spacing={2.5}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>{t("onboarding.fiscal.title", "Dati Fiscali e Dichiarazioni")}</Typography>

              {/* Codice Fiscale auto-calcolato + verifica coerenza */}
              {(() => {
                const computed = computeCfFromForm(form);
                const current = (form.codice_fiscale || "").toUpperCase();
                const isFormallyValid = current.length === 16 && CodiceFiscale.check(current);
                const matches = computed && current === computed;
                const showMismatch = computed && current && !matches && current.length === 16;
                return (
                  <Box>
                    <TextField
                      fullWidth size="small" label={t("onboarding.form.codice_fiscale", "Codice Fiscale *")}
                      value={current}
                      onChange={(e) => set("codice_fiscale", e.target.value.toUpperCase())}
                      inputProps={{ maxLength: 16, style: { fontFamily: "monospace", letterSpacing: 1 } }}
                      InputProps={{
                        endAdornment: current && (
                          isFormallyValid && (matches || !computed)
                            ? <Iconify icon="mdi:check-circle" width={20} sx={{ color: "#4CAF50" }} />
                            : current.length === 16
                              ? <Iconify icon="mdi:alert-circle" width={20} sx={{ color: "#FF9800" }} />
                              : null
                        ),
                      }}
                    />
                    {computed && !current && (
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: "0.75rem", color: ESPRESSO }}>
                          {t("onboarding.cf.computed_prefix", "Calcolato dai tuoi dati anagrafici:")} <strong style={{ fontFamily: "monospace", color: ORO }}>{computed}</strong>
                        </Typography>
                        <Button size="small" variant="text" onClick={() => set("codice_fiscale", computed)} sx={{ fontSize: "0.7rem", color: ORO, textTransform: "none" }}>
                          {t("onboarding.cf.use_this", "Usa questo")}
                        </Button>
                      </Stack>
                    )}
                    {showMismatch && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: alpha("#FF9800", 0.08), borderRadius: 1, border: `1px solid ${alpha("#FF9800", 0.3)}`, display: "flex", gap: 1, alignItems: "flex-start" }}>
                        <Iconify icon="mdi:alert-circle-outline" width={16} sx={{ color: "#FF9800", flexShrink: 0, mt: 0.2 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: "0.7rem", color: ESPRESSO }}>
                            {t("onboarding.cf.mismatch_prefix", "Il CF inserito non corrisponde ai dati anagrafici. Atteso:")} <strong style={{ fontFamily: "monospace" }}>{computed}</strong>.
                            <br />
                            <em style={{ color: "#7A6A5C" }}>{t("onboarding.cf.homocode_note", "Se hai casi di omocodia (CF ricalcolato dall'Agenzia Entrate per evitare duplicati) puoi ignorare questo messaggio. Altrimenti verifica i tuoi dati.")}</em>
                          </Typography>
                          <Button size="small" variant="text" onClick={() => set("codice_fiscale", computed)} sx={{ fontSize: "0.7rem", color: ORO, textTransform: "none", mt: 0.5 }}>
                            {t("onboarding.cf.recompute", "Ricalcola da dati anagrafici")}
                          </Button>
                        </Box>
                      </Box>
                    )}
                    {current.length === 16 && !isFormallyValid && (
                      <Typography sx={{ fontSize: "0.7rem", color: DANGER, mt: 0.5 }}>
                        {t("onboarding.cf.invalid", "Codice fiscale formalmente non valido (controllo carattere di controllo fallito).")}
                      </Typography>
                    )}
                  </Box>
                );
              })()}

              {/* Domanda 1 — IVD income */}
              <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: ESPRESSO, mb: 1.5 }}>
                  {t("onboarding.fiscal.q_ivd", "Nell'anno solare in corso, hai percepito compensi da attività di Incaricato alle Vendite a Domicilio — cioè vendite porta a porta o presso il domicilio dei clienti (L. 173/2005) — presso altre aziende?")}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <FormControlLabel control={<Checkbox checked={!form.has_other_ivd_income} onChange={() => { set("has_other_ivd_income", false); set("other_ivd_amount", ""); }} />} label={t("onboarding.form.no", "No")} />
                  <FormControlLabel control={<Checkbox checked={!!form.has_other_ivd_income} onChange={() => set("has_other_ivd_income", true)} />} label={t("onboarding.form.yes", "Sì")} />
                </Stack>
                {form.has_other_ivd_income && (
                  <TextField fullWidth size="small" label={t("onboarding.form.ivd_amount", "Importo netto complessivo (€)")} type="number" value={form.other_ivd_amount || ""} onChange={(e) => set("other_ivd_amount", e.target.value)} sx={{ mt: 1.5 }} inputProps={{ min: 0 }} />
                )}
              </Box>

              {/* Domanda 2 — P.IVA (Sì/No solamente; il numero si chiede sotto nel box Regime Fiscale) */}
              <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: ESPRESSO, mb: 1.5 }}>
                  {t("onboarding.fiscal.q_piva", "Sei già titolare di Partita IVA per attività di vendita a domicilio?")}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <FormControlLabel control={<Checkbox checked={!form.has_piva_ivd} onChange={() => { set("has_piva_ivd", false); set("piva_number", ""); set("vat_number", ""); }} />} label={t("onboarding.form.no", "No")} />
                  <FormControlLabel control={<Checkbox checked={!!form.has_piva_ivd} onChange={() => set("has_piva_ivd", true)} />} label={t("onboarding.form.yes", "Sì")} />
                </Stack>
              </Box>

              {/* Auto-derived regime display */}
              <Box sx={{ p: 1.5, bgcolor: alpha(ORO, 0.06), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.2)}` }}>
                <Typography sx={{ fontSize: "0.8rem", color: ESPRESSO }}>
                  <strong>{t("onboarding.fiscal.regime_label", "Regime Fiscale:")}</strong> {autoRegime === "partita_iva" ? t("onboarding.fiscal.regime_piva", "Incaricato con P.IVA") : t("onboarding.fiscal.regime_occasional", "Incaricato Occasionale")}
                </Typography>
                {autoRegime === "partita_iva" && (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}><TextField fullWidth size="small" label={t("onboarding.form.vat_number", "Partita IVA")} value={form.vat_number || ""} onChange={(e) => { set("vat_number", e.target.value); set("piva_number", e.target.value); }} inputProps={{ maxLength: 11 }} /></Grid>
                    <Grid item xs={6}><TextField fullWidth size="small" label={t("onboarding.form.codice_sdi", "Codice SDI (facoltativo)")} value={form.codice_sdi || ""} onChange={(e) => set("codice_sdi", e.target.value)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth size="small" label={t("onboarding.form.pec", "PEC (facoltativa)")} value={form.pec || ""} onChange={(e) => set("pec", e.target.value)} /></Grid>
                  </Grid>
                )}
              </Box>

              {/* Inquadramento fiscale UNIFICATO — stile scontrino */}
              {(() => {
                const isPiva = autoRegime === "partita_iva";
                const isRidotta = form.previdential_status === "other_position" || form.previdential_status === "retired";
                const inpsPct = isRidotta ? "6,24" : "8,77";
                const inpsEur1000 = isRidotta ? "62,40" : "87,67";
                // Stili scontrino
                const row = { display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontFamily: "monospace", color: "#3D3229", py: 0.15 };
                const totalRow = { ...row, fontWeight: 700, color: ESPRESSO, borderTop: `1px solid ${alpha(ORO, 0.4)}`, mt: 0.5, pt: 0.5 };

                return (
                  <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px solid #eee" }}>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>
                      {t("onboarding.fiscal.framework_title", "Inquadramento fiscale e previdenziale")}
                    </Typography>

                    {/* Riga IRPEF in linguaggio umano */}
                    <Typography sx={{ fontSize: "0.74rem", color: "#5C4A3E", lineHeight: 1.55, mb: 1.5 }}>
                      {t("onboarding.fiscal.irpef_intro", "EVEA trattiene automaticamente la tassa IRPEF dai tuoi guadagni e la versa per te all'Agenzia delle Entrate.")}
                      {!isPiva && <> {t("onboarding.fiscal.irpef_occasional", "Per gli Incaricati Occasionali non devi dichiararli nel 730: sono già chiusi qui.")}</>}
                      {isPiva && <> {t("onboarding.fiscal.irpef_piva", "Per chi ha Partita IVA è ritenuta a titolo d'acconto e si conguaglia in dichiarazione annuale col tuo commercialista.")}</>}
                    </Typography>

                    {/* Domanda previdenziale */}
                    <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: ESPRESSO, mb: 0.5 }}>
                      {t("onboarding.fiscal.q_other_job", "Hai un altro lavoro o una pensione?")}
                    </Typography>
                    <Stack spacing={0.3} sx={{ mb: 1.5 }}>
                      {[
                        // Chi è disoccupato, studente o casalinga deve riconoscersi qui:
                        // senza altre coperture previdenziali paga l'aliquota piena.
                        // La formulazione precedente ("il Network Marketing è la mia unica
                        // entrata") non li includeva in modo evidente, col rischio che
                        // spuntassero un'altra opzione e si prendessero l'aliquota ridotta
                        // senza averne diritto.
                        { value: "none", label: t("onboarding.fiscal.opt_none", "No, non ho altri lavori né una pensione"), sublabel: t("onboarding.fiscal.opt_none_sub", "(es. disoccupato, studente, in cerca di occupazione, oppure il Network Marketing è la tua unica entrata)"), inps: t("onboarding.fiscal.opt_none_inps", "Trattenuta INPS più alta (non hai altre coperture previdenziali)") },
                        { value: "other_position", label: t("onboarding.fiscal.opt_other_position", "Sì, ho un lavoro dipendente o un'altra attività"), sublabel: t("onboarding.fiscal.opt_other_position_sub", "(es. lavoro in azienda, libero professionista)"), inps: t("onboarding.fiscal.opt_other_position_inps", "Trattenuta INPS ridotta (sei già coperto altrove)") },
                        { value: "retired", label: t("onboarding.fiscal.opt_retired", "Sono in pensione"), inps: t("onboarding.fiscal.opt_retired_inps", "Trattenuta INPS ridotta (sei già coperto dalla pensione)") },
                      ].map((opt) => (
                        <FormControlLabel
                          key={opt.value}
                          control={<Checkbox checked={form.previdential_status === opt.value} onChange={() => set("previdential_status", opt.value)} sx={{ alignSelf: "flex-start", pt: 0.3, py: 0.3 }} size="small" />}
                          sx={{ alignItems: "flex-start", mr: 0 }}
                          label={
                            <Box sx={{ py: 0.2 }}>
                              <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: ESPRESSO }}>
                                {opt.label}
                                {opt.sublabel && <span style={{ fontSize: "0.72rem", color: "#7A6A5C", fontWeight: 400 }}> {opt.sublabel}</span>}
                              </Typography>
                              <Typography sx={{ fontSize: "0.68rem", color: ORO }}>{opt.inps}</Typography>
                            </Box>
                          }
                        />
                      ))}
                    </Stack>

                    {/* Scontrino dinamico */}
                    <Box sx={{ p: 1.5, bgcolor: "#fffdf7", borderRadius: 1.5, border: `1px solid ${alpha(ORO, 0.3)}` }}>
                      <Typography sx={{ fontSize: "0.74rem", fontWeight: 700, color: ESPRESSO, mb: 0.7, textAlign: "center" }}>
                        {t("onboarding.fiscal.example_title", "Esempio su €100 di provvigione")}
                      </Typography>

                      {!isPiva ? (
                        <>
                          <Box sx={row}><span>{t("onboarding.fiscal.gross_commission", "Provvigione lorda")}</span><span>€100,00</span></Box>
                          <Box sx={row}><span>{t("onboarding.fiscal.irpef_row", "− IRPEF")}</span><span>− €17,94</span></Box>
                          <Box sx={row}><span>{t("onboarding.fiscal.stamp_row", "− Marca da bollo")}</span><span>− €2,00</span></Box>
                          <Box sx={totalRow}><span>{t("onboarding.fiscal.to_your_account", "Sul tuo conto")}</span><span style={{ color: ORO }}>€80,06</span></Box>
                          <Typography sx={{ fontSize: "0.68rem", color: "#7A6A5C", mt: 1.2, lineHeight: 1.5, fontStyle: "italic", textAlign: "center" }}>
                            {t("onboarding.fiscal.inps_threshold_note", "Oltre €5.000 netti/anno scatta anche INPS")}<br />
                            <strong>{t("onboarding.fiscal.inps_pct_line", "~€{{pct}} ogni €100", { pct: inpsPct })}</strong> {t("onboarding.fiscal.inps_pct_suffix", "sulla sola parte in eccedenza")}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Box sx={row}><span>{t("onboarding.fiscal.taxable_78", "Imponibile (78%)")}</span><span>€78,00</span></Box>
                          <Box sx={row}><span>{t("onboarding.fiscal.vat_22", "+ IVA 22%")}</span><span>+ €17,16</span></Box>
                          <Box sx={row}><span>{t("onboarding.fiscal.irpef_acconto", "− IRPEF (acconto)")}</span><span>− €17,94</span></Box>
                          <Box sx={totalRow}><span>{t("onboarding.fiscal.evea_transfer", "Bonifico EVEA")}</span><span style={{ color: ORO }}>€77,22</span></Box>
                          <Typography sx={{ fontSize: "0.68rem", color: "#7A6A5C", mt: 1.2, lineHeight: 1.5, fontStyle: "italic", textAlign: "center" }}>
                            {t("onboarding.fiscal.vat_note_prefix", "L'IVA")} <strong>€17,16</strong> {t("onboarding.fiscal.vat_note_suffix", "la versi tu all'Agenzia Entrate.")}<br />
                            {t("onboarding.fiscal.inps_gestione_prefix", "L'")}<strong>{t("onboarding.fiscal.inps_gestione", "INPS Gestione Separata")}</strong> {t("onboarding.fiscal.inps_gestione_suffix", "la gestisci col tuo commercialista (EVEA non trattiene).")}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                );
              })()}

              {/* Domanda 4 — Dipendente PA */}
              <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: ESPRESSO, mb: 1.5 }}>
                  {t("onboarding.fiscal.q_public_employee", "Sei dipendente della Pubblica Amministrazione?")}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <FormControlLabel control={<Checkbox checked={!form.is_public_employee} onChange={() => { set("is_public_employee", false); set("nulla_osta_file", null); }} />} label={t("onboarding.form.no", "No")} />
                  <FormControlLabel control={<Checkbox checked={!!form.is_public_employee} onChange={() => set("is_public_employee", true)} />} label={t("onboarding.form.yes", "Sì")} />
                </Stack>
                {form.is_public_employee && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography sx={{ fontSize: "0.8rem", color: ESPRESSO, mb: 1 }}>{t("onboarding.fiscal.upload_nulla_osta_title", "Carica il nulla osta del tuo ente (obbligatorio)")}</Typography>
                    <input ref={nullaOstaRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={(e) => set("nulla_osta_file", e.target.files[0])} />
                    <Button variant="outlined" onClick={() => nullaOstaRef.current?.click()} startIcon={<Iconify icon="mdi:upload" />} sx={{ borderColor: alpha(ORO, 0.3), color: ORO }} size="small">
                      {form.nulla_osta_file ? form.nulla_osta_file.name : t("onboarding.fiscal.upload_nulla_osta_button", "Carica nulla osta")}
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
                      {t("onboarding.fiscal.criminal_record_decl", "Dichiaro di non avere precedenti penali né procedimenti penali pendenti (art. 71 D.Lgs. 59/2010) *")}
                    </Typography>
                  }
                />
              </Box>

              {/* INPS threshold info */}
              <Box sx={{ p: 1.5, bgcolor: "#f9f9f9", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.75rem", color: "#666", lineHeight: 1.6 }}>
                  {t("onboarding.fiscal.inps_threshold_info", "La soglia di €5.000,00 netti è cumulativa su tutti i compensi percepiti come Incaricato alle Vendite a Domicilio nell'anno solare, indipendentemente dal numero di aziende mandanti. Sei tenuto a comunicare ogni variazione entro 10 giorni a info@myevea.com.")}
                </Typography>
              </Box>

              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(0)} sx={{ color: "#aaa" }}>{t("onboarding.button.back", "Indietro")}</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!form.codice_fiscale) { enqueueSnackbar(t("onboarding.err.cf_required", "Il Codice Fiscale è obbligatorio."), { variant: "error" }); return; }
                    if (!form.criminal_record_declaration) { enqueueSnackbar(t("onboarding.err.criminal_record_required", "La dichiarazione sui precedenti penali è obbligatoria."), { variant: "error" }); return; }
                    if (form.is_public_employee && !form.nulla_osta_file) { enqueueSnackbar(t("onboarding.err.nulla_osta_required", "Il nulla osta è obbligatorio per i dipendenti pubblici."), { variant: "error" }); return; }
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
                >{t("onboarding.button.save_continue", "Salva e continua")}</Button>
              </Stack>
            </Stack>
          )}

          {/* ═══ STEP 2: RESIDENZA ═══ */}
          {step === 2 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>{t("onboarding.residence.title", "Indirizzo di Residenza")}</Typography>
              <TextField fullWidth size="small" label={t("onboarding.form.address", "Indirizzo *")} value={form.address || ""} onChange={(e) => set("address", e.target.value)} />
              <Grid container spacing={2}>
                <Grid item xs={4}><TextField fullWidth size="small" label={t("onboarding.form.zipcode", "CAP *")} value={form.zipcode || ""} onChange={(e) => set("zipcode", e.target.value)} inputProps={{ maxLength: 5 }} /></Grid>
                <Grid item xs={4}><TextField fullWidth size="small" label={t("onboarding.form.city", "Città *")} value={form.city || ""} onChange={(e) => set("city", e.target.value)} /></Grid>
                <Grid item xs={4}><TextField fullWidth size="small" label={t("onboarding.form.province", "Provincia *")} value={form.provincia || ""} onChange={(e) => set("provincia", e.target.value)} inputProps={{ maxLength: 2 }} placeholder="VR" /></Grid>
              </Grid>
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(1)} sx={{ color: "#aaa" }}>{t("onboarding.button.back", "Indietro")}</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!form.address || !form.city || !form.zipcode || !form.provincia) { enqueueSnackbar(t("onboarding.err.address_required", "Tutti i campi dell'indirizzo sono obbligatori."), { variant: "error" }); return; }
                    save("save-address", { address: form.address, city: form.city, zipcode: form.zipcode, provincia: form.provincia, country: "IT" });
                  }}
                  disabled={saving}
                  sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
                >{t("onboarding.button.save_continue", "Salva e continua")}</Button>
              </Stack>
            </Stack>
          )}

          {/* ═══ STEP 3: DOCUMENTO (saltabile con avviso) ═══ */}
          {step === 3 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>{t("onboarding.document.title", "Documento di Identità")}</Typography>
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                {t("onboarding.document.warning", "Il documento è obbligatorio entro 30 giorni per il rilascio del Tesserino di Riconoscimento (D.Lgs. 114/1998).")}
              </Alert>
              <TextField select fullWidth size="small" label={t("onboarding.form.document_type", "Tipo documento *")} value={form.document_type || ""} onChange={(e) => set("document_type", e.target.value)}>
                <MenuItem value="carta_identita">{t("onboarding.document.id_card", "Carta di Identità")}</MenuItem>
                <MenuItem value="passaporto">{t("onboarding.document.passport", "Passaporto")}</MenuItem>
                <MenuItem value="patente">{t("onboarding.document.driver_license", "Patente di Guida")}</MenuItem>
              </TextField>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" label={t("onboarding.form.document_number", "Numero documento *")} value={form.document_number || ""} onChange={(e) => set("document_number", e.target.value.toUpperCase())} placeholder={t("onboarding.form.document_number_placeholder", "es. CA12345AB")} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" label={t("onboarding.form.document_issuer", "Rilasciato da *")} value={form.document_issuer || ""} onChange={(e) => set("document_issuer", e.target.value)} placeholder={t("onboarding.form.document_issuer_placeholder", "es. Comune di Roma / Questura di Verona")} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" type="date" label={t("onboarding.form.document_issued_at", "Data rilascio *")} InputLabelProps={{ shrink: true }} value={form.document_issued_at || ""} onChange={(e) => set("document_issued_at", e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" type="date" label={t("onboarding.form.document_expires_at", "Data scadenza *")} InputLabelProps={{ shrink: true }} value={form.document_expires_at || ""} onChange={(e) => set("document_expires_at", e.target.value)} />
                </Grid>
              </Grid>
              <Box>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: ESPRESSO, mb: 1 }}>{t("onboarding.document.front", "Fronte")}</Typography>
                <input ref={frontRef} type="file" accept="image/*,.heic,.heif,.pdf" style={{ display: "none" }} onChange={async (e) => {
                  const f = e.target.files[0]; if (!f) return;
                  try {
                    setSaving(true);
                    const converted = await convertHeicIfNeeded(f);
                    set("front_file", converted);
                  } catch (err) {
                    enqueueSnackbar(t("onboarding.document.photo_error", "Impossibile leggere la foto. Riprova o usa JPG/PDF."), { variant: "error" });
                  } finally { setSaving(false); }
                }} />
                <Button variant="outlined" onClick={() => frontRef.current?.click()} startIcon={<Iconify icon="mdi:upload" />} sx={{ borderColor: alpha(ORO, 0.3), color: ORO }}>
                  {form.front_file ? form.front_file.name : (form.has_document_front ? t("onboarding.document.already_uploaded", "✓ Già caricato") : t("onboarding.document.upload_front", "Carica fronte"))}
                </Button>
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: ESPRESSO, mb: 1 }}>{t("onboarding.document.back", "Retro")}</Typography>
                <input ref={backRef} type="file" accept="image/*,.heic,.heif,.pdf" style={{ display: "none" }} onChange={async (e) => {
                  const f = e.target.files[0]; if (!f) return;
                  try {
                    setSaving(true);
                    const converted = await convertHeicIfNeeded(f);
                    set("back_file", converted);
                  } catch (err) {
                    enqueueSnackbar(t("onboarding.document.photo_error", "Impossibile leggere la foto. Riprova o usa JPG/PDF."), { variant: "error" });
                  } finally { setSaving(false); }
                }} />
                <Button variant="outlined" onClick={() => backRef.current?.click()} startIcon={<Iconify icon="mdi:upload" />} sx={{ borderColor: alpha(ORO, 0.3), color: ORO }}>
                  {form.back_file ? form.back_file.name : (form.has_document_back ? t("onboarding.document.already_uploaded", "✓ Già caricato") : t("onboarding.document.upload_back", "Carica retro"))}
                </Button>
              </Box>
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(2)} sx={{ color: "#aaa" }}>{t("onboarding.button.back", "Indietro")}</Button>
                <Stack direction="row" spacing={1}>
                  <Button onClick={() => setStep(4)} sx={{ color: "#aaa" }}>{t("onboarding.button.skip_for_now", "Salta per ora")}</Button>
                  <Button variant="contained" onClick={() => {
                    const fd = new FormData();
                    if (form.front_file) fd.append("front", form.front_file);
                    if (form.back_file) fd.append("back", form.back_file);
                    fd.append("document_type", form.document_type || "");
                    if (form.document_number) fd.append("document_number", form.document_number);
                    if (form.document_issuer) fd.append("document_issuer", form.document_issuer);
                    if (form.document_issued_at) fd.append("document_issued_at", form.document_issued_at);
                    if (form.document_expires_at) fd.append("document_expires_at", form.document_expires_at);
                    setSaving(true);
                    axiosInstance.post("api/wp/onboarding/upload-document", fd).then(() => {
                      enqueueSnackbar(t("onboarding.document.uploaded", "Documento caricato!"), { variant: "success" });
                      setStep(4);
                      axiosInstance.get("api/wp/onboarding/status").then(({ data: r }) => setStatus(r?.data)).catch(() => {});
                    }).catch(() => enqueueSnackbar(t("onboarding.document.upload_error", "Errore upload"), { variant: "error" })).finally(() => setSaving(false));
                  }} disabled={saving} sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}>{t("onboarding.button.upload_continue", "Carica e continua")}</Button>
                </Stack>
              </Stack>
            </Stack>
          )}

          {/* ═══ STEP 4: DATI BANCARI ═══ */}
          {step === 4 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>{t("onboarding.step.bank", "Dati Bancari")}</Typography>
              <TextField fullWidth size="small" required label={t("onboarding.form.iban", "IBAN *")} value={form.iban || ""} onChange={(e) => set("iban", e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="IT60X0542811101000000123456" helperText={t("onboarding.form.iban_helper", "Formato europeo SEPA — obbligatorio per ricevere i pagamenti")} />
              {form.iban && !form.iban.startsWith("IT") && (
                <TextField fullWidth size="small" label={t("onboarding.form.bic_swift_foreign", "BIC/SWIFT (obbligatorio per IBAN non italiano)")} value={form.bic_swift || ""} onChange={(e) => set("bic_swift", e.target.value.toUpperCase())} placeholder="ABCDEFGH" />
              )}
              <TextField fullWidth size="small" label={t("onboarding.form.account_holder", "Intestatario conto *")} value={form.account_holder || `${form.first_name || ""} ${form.last_name || ""}`.trim()} onChange={(e) => set("account_holder", e.target.value)} />
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => setStep(3)} sx={{ color: "#aaa" }}>{t("onboarding.button.back", "Indietro")}</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    const iban = (form.iban || "").trim();
                    if (!iban) {
                      enqueueSnackbar(t("onboarding.err.iban_required", "L'IBAN è obbligatorio per ricevere i pagamenti"), { variant: "warning" });
                      return;
                    }
                    if (!iban.startsWith("IT") && !(form.bic_swift || "").trim()) {
                      enqueueSnackbar(t("onboarding.err.bic_required_foreign", "BIC/SWIFT obbligatorio per IBAN non italiano"), { variant: "warning" });
                      return;
                    }
                    save("save-bank", { iban, bic_swift: form.bic_swift || "", bank_name: "", account_holder: form.account_holder || `${form.first_name || ""} ${form.last_name || ""}`.trim() });
                  }}
                  disabled={saving}
                  sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
                >{t("onboarding.button.save_continue", "Salva e continua")}</Button>
              </Stack>
            </Stack>
          )}

          {/* ═══ STEP 5: LETTERA DI INCARICO ═══ */}
          {step === 5 && (
            <Stack spacing={2.5}>
              <Typography variant="h6" fontWeight={700} color={ESPRESSO}>{t("onboarding.letter.title", "Lettera di Incarico")}</Typography>

              <Box sx={{ p: 1.5, bgcolor: alpha(ORO, 0.06), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.2)}` }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="mdi:file-document-outline" width={20} sx={{ color: ORO }} />
                  <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO, flex: 1 }}>
                    {t("onboarding.letter.read_full", "Leggi il testo completo della Lettera di Incarico prima di accettare")}
                  </Typography>
                  <Button size="small" href="https://cdn.shopify.com/s/files/1/1013/1629/7050/files/Evea_Global_01_Lettera_Compatta_v5.pdf?v=1787252951" target="_blank" rel="noreferrer" sx={{ color: ORO, fontWeight: 700, textTransform: "none" }}>
                    {t("onboarding.letter.open_pdf", "Apri PDF →")}
                  </Button>
                </Stack>
              </Box>

              {/* Riepilogo dati */}
              <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>{t("onboarding.letter.summary_title", "Riepilogo dei tuoi dati")}</Typography>
                {[
                  [t("onboarding.letter.summary_name", "Nome e Cognome"), `${form.first_name || ""} ${form.last_name || ""}`],
                  [t("onboarding.letter.summary_cf", "Codice Fiscale"), form.codice_fiscale],
                  [t("onboarding.letter.summary_address", "Indirizzo"), `${form.address || ""}, ${form.zipcode || ""} ${form.city || ""} (${form.provincia || ""})`],
                  [t("onboarding.letter.summary_iban", "IBAN"), form.iban],
                  [t("onboarding.letter.summary_regime", "Regime Fiscale"), autoRegime === "partita_iva" ? t("onboarding.fiscal.regime_piva", "Incaricato con P.IVA") : t("onboarding.fiscal.regime_occasional", "Incaricato Occasionale")],
                ].map(([label, value]) => value && (
                  <Stack key={label} direction="row" spacing={1} sx={{ py: 0.3 }}>
                    <Typography sx={{ fontSize: "0.78rem", color: "#888", minWidth: 140 }}>{label}:</Typography>
                    <Typography sx={{ fontSize: "0.78rem", color: ESPRESSO, fontWeight: 500 }}>{value}</Typography>
                  </Stack>
                ))}
              </Box>

              <Divider />

              {/* Accettazione documenti obbligatori */}
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>{t("onboarding.letter.docs_accept_title", "Accettazione Documenti Contrattuali")}</Typography>
              <Stack spacing={1}>
                <FormControlLabel
                  control={<Checkbox checked={allegato_a} onChange={(e) => setAllegatoA(e.target.checked)} sx={{ "&.Mui-checked": { color: ORO } }} />}
                  label={<Stack direction="row" alignItems="center" spacing={1}><Typography sx={{ fontSize: "0.85rem" }}>{t("onboarding.letter.read_accept_prefix", "Ho letto e accetto il")} <strong>{t("onboarding.letter.allegato_a_name", "Codice di Condotta del Promotore (Allegato A)")}</strong> *</Typography><Button size="small" href="https://cdn.shopify.com/s/files/1/1013/1629/7050/files/Evea_Global_Allegato_A_Codice_Condotta_v3.pdf" target="_blank" rel="noreferrer" sx={{ color: ORO, fontSize: "0.75rem", p: 0, minWidth: 0 }}>{t("onboarding.letter.read_link", "Leggi →")}</Button></Stack>}
                />
                <FormControlLabel
                  control={<Checkbox checked={allegato_b} onChange={(e) => setAllegatoB(e.target.checked)} sx={{ "&.Mui-checked": { color: ORO } }} />}
                  label={<Stack direction="row" alignItems="center" spacing={1}><Typography sx={{ fontSize: "0.85rem" }}>{t("onboarding.letter.read_accept_prefix", "Ho letto e accetto il")} <strong>{t("onboarding.letter.allegato_b_name", "Piano Compensi (Allegato B)")}</strong> *</Typography><Button size="small" href="https://cdn.shopify.com/s/files/1/1013/1629/7050/files/EVEA_Piano_Compensi_v1.9.pdf?v=1790459052" target="_blank" rel="noreferrer" sx={{ color: ORO, fontSize: "0.75rem", p: 0, minWidth: 0 }}>{t("onboarding.letter.read_link", "Leggi →")}</Button></Stack>}
                />
                <FormControlLabel
                  control={<Checkbox checked={allegato_c} onChange={(e) => setAllegatoC(e.target.checked)} sx={{ "&.Mui-checked": { color: ORO } }} />}
                  label={<Stack direction="row" alignItems="center" spacing={1}><Typography sx={{ fontSize: "0.85rem" }}>{t("onboarding.letter.allegato_c_prefix", "Ho letto l'")}<strong>{t("onboarding.letter.allegato_c_name", "Informativa Privacy (Allegato C)")}</strong> {t("onboarding.letter.allegato_c_suffix", "e autorizzo il trattamento dei dati")} *</Typography><Button size="small" href="https://cdn.shopify.com/s/files/1/1013/1629/7050/files/Evea_Global_Allegato_C_Privacy_v1.pdf" target="_blank" rel="noreferrer" sx={{ color: ORO, fontSize: "0.75rem", p: 0, minWidth: 0 }}>{t("onboarding.letter.read_link", "Leggi →")}</Button></Stack>}
                />
              </Stack>

              <Divider />

              {/* Consensi facoltativi */}
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>{t("onboarding.letter.optional_consents_title", "Consensi Facoltativi")}</Typography>
              <Stack spacing={0.5}>
                <FormControlLabel
                  control={<Checkbox checked={consent_marketing} onChange={(e) => setConsentMarketing(e.target.checked)} />}
                  label={
                    <Typography sx={{ fontSize: "0.85rem" }}>
                      {status?.user?.marketing_consent === true
                        ? t("onboarding.letter.marketing_subscribed", "Sei iscritto/a alle comunicazioni eVea (rituali, storie dal Fujian, offerte esclusive). Togli la spunta per revocare il consenso.")
                        : t("onboarding.letter.marketing_subscribe", "Iscrivimi alle comunicazioni eVea via email: rituali, storie dal Fujian e offerte esclusive. (facoltativo)")}
                    </Typography>
                  }
                />
                <FormControlLabel control={<Checkbox checked={consent_image} onChange={(e) => setConsentImage(e.target.checked)} />} label={<Typography sx={{ fontSize: "0.85rem" }}>{t("onboarding.letter.image_consent", "Autorizzo l'utilizzo della mia immagine per materiali promozionali (facoltativo)")}</Typography>} />
              </Stack>

              <Divider />

              {/* Clausole vessatorie */}
              <Box sx={{ p: 2, bgcolor: alpha(DANGER, 0.03), borderRadius: 2, border: `1px solid ${alpha(DANGER, 0.15)}` }}>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 1.5 }}>{t("onboarding.letter.unfair_clauses_title", "Approvazione Clausole Vessatorie (artt. 1341-1342 c.c.)")}</Typography>
                <Box sx={{ p: 1.5, bgcolor: "#fff", borderRadius: 1, border: "1px solid #eee", mb: 1.5, maxHeight: 160, overflowY: "auto" }}>
                  <Typography sx={{ fontSize: "0.78rem", color: "#555", lineHeight: 1.7 }}>
                    {t("onboarding.letter.unfair_clauses_list", "Clausole di recesso e cessazione automatica — Assenza di zona esclusiva — Divieto di incassare — Divieto e-commerce — Clawback provvigioni — Modifica unilaterale dei Documenti Contrattuali — Decadenza provvigioni indirette alla disdetta — Foro di Roma — Cross-sponsoring vietato — Inattività e chiusura codice — Regole cambio sponsor — Riservatezza triennale post-cessazione — Divieto di chargeback.")}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={<Checkbox checked={clausole} onChange={(e) => setClausole(e.target.checked)} sx={{ color: DANGER, "&.Mui-checked": { color: DANGER } }} />}
                  label={<Typography sx={{ fontSize: "0.85rem", color: ESPRESSO, fontWeight: 600 }}>{t("onboarding.letter.unfair_clauses_accept", "Approvo specificamente le clausole sopra elencate ai sensi degli artt. 1341 e 1342 c.c. *")}</Typography>}
                />
              </Box>

              <Divider />

              {/* OTP Verification */}
              <Box sx={{ p: 2, bgcolor: alpha("#1976D2", 0.05), borderRadius: 2, border: `2px solid ${alpha("#1976D2", 0.3)}` }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <Iconify icon="mdi:shield-check-outline" width={22} sx={{ color: "#1976D2" }} />
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ESPRESSO }}>{t("onboarding.letter.identity_check_title", "Verifica Identita' (Firma Elettronica)")}</Typography>
                </Stack>
                <Typography sx={{ fontSize: "0.8rem", color: "#555", mb: 1.5 }}>
                  {t("onboarding.letter.identity_check_desc", "Per firmare digitalmente la Lettera di Incarico, ricevi un codice di verifica via email e inseriscilo qui sotto. Questa procedura conferisce valore legale alla tua firma elettronica.")}
                </Typography>

                {!otpSent ? (
                  <Button
                    variant="contained"
                    onClick={sendOtp}
                    disabled={otpSending || !allegato_a || !allegato_b || !allegato_c || !clausole}
                    startIcon={otpSending ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : <Iconify icon="mdi:email-fast-outline" />}
                    sx={{ bgcolor: "#1976D2", "&:hover": { bgcolor: "#1565C0" }, fontWeight: 700, textTransform: "none" }}
                  >
                    {otpSending ? t("onboarding.letter.sending", "Invio in corso...") : t("onboarding.letter.send_code_email", "Invia codice via email")}
                  </Button>
                ) : (
                  <Stack spacing={1.5}>
                    <Typography sx={{ fontSize: "0.78rem", color: "#1976D2", fontWeight: 600 }}>
                      {t("onboarding.letter.code_sent_check_inbox", "✓ Codice inviato. Controlla la tua casella email (anche spam).")}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      label={t("onboarding.letter.otp_input_label", "Inserisci codice OTP a 6 cifre")}
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
                      {t("onboarding.letter.resend_code", "Reinvia codice")}
                    </Button>
                  </Stack>
                )}
              </Box>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button onClick={() => setStep(4)} sx={{ color: "#aaa" }}>{t("onboarding.button.back", "Indietro")}</Button>
                <Button
                  variant="contained"
                  onClick={acceptLetter}
                  disabled={saving || !allegato_a || !allegato_b || !allegato_c || !clausole || !otpSent || otpCode.length !== 6}
                  startIcon={saving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <Iconify icon="mdi:check-all" />}
                  sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" }, "&.Mui-disabled": { bgcolor: "#ccc" }, fontWeight: 700, px: 3 }}
                >
                  {t("onboarding.letter.sign_complete", "Firma e Completa Onboarding")}
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
