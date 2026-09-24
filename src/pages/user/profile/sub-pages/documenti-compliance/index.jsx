import { useEffect, useState, useRef } from "react";
import {
  Box, Card, Stack, Typography, Button, Chip, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, CircularProgress, Alert, IconButton, MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";
import { convertHeicIfNeeded } from "src/utils/heicConverter";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const VERDE = "#2C5F2D";
const ROSSO = "#B23A48";
const GRIGIO = "#7A6A5C";

const SectionCard = ({ icon, title, status, statusColor, children }) => (
  <Card sx={{ p: 2.5, mb: 2, border: "1px solid #f0ece6", borderRadius: 2 }}>
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
      <Iconify icon={icon} width={24} sx={{ color: ORO }} />
      <Typography variant="h6" fontWeight={700} color={ESPRESSO} sx={{ flex: 1 }}>{title}</Typography>
      {status && (
        <Chip
          label={status}
          size="small"
          sx={{ bgcolor: alpha(statusColor || GRIGIO, 0.12), color: statusColor || GRIGIO, fontWeight: 700 }}
        />
      )}
    </Stack>
    {children}
  </Card>
);

const DocumentiCompliance = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [bank, setBank] = useState(null);
  const [ibanDialogOpen, setIbanDialogOpen] = useState(false);
  const [ibanForm, setIbanForm] = useState({ iban: "", bic_swift: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [savingIban, setSavingIban] = useState(false);
  const downloadingRef = useRef(false);
  // Dialog ri-caricamento documenti
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [docForm, setDocForm] = useState({ document_type: "", document_number: "", document_issuer: "", document_issued_at: "", document_expires_at: "" });
  const [docFrontFile, setDocFrontFile] = useState(null);
  const [docBackFile, setDocBackFile] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const docFrontRef = useRef(null);
  const docBackRef = useRef(null);

  const load = async () => {
    try {
      const [s, b] = await Promise.all([
        axiosInstance.get("api/wp/onboarding/status").catch(() => null),
        axiosInstance.get("api/wp/me/bank").catch(() => null),
      ]);
      // status() returns { data: { user: {...}, steps: {...}, onboarding_done } }
      const payload = s?.data?.data || {};
      setStatus({ ...(payload.user || {}), onboarding_done: payload.onboarding_done });
      setBank(b?.data || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const formatDate = (s) => {
    if (!s) return "—";
    try { return new Date(s).toLocaleString("it-IT", { dateStyle: "medium", timeStyle: "short" }); }
    catch { return s; }
  };

  const downloadLettera = () => {
    if (downloadingRef.current) return;
    downloadingRef.current = true;
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
      const baseUrl = (axiosInstance.defaults.baseURL || "").replace(/\/$/, "");
      window.open(`${baseUrl}/api/download-letter?token=${encodeURIComponent(token)}`, "_blank");
    } catch (e) {
      enqueueSnackbar(t("compliance.letter_download_error", "Errore download lettera"), { variant: "error" });
    } finally {
      setTimeout(() => { downloadingRef.current = false; }, 1500);
    }
  };

  const sendIbanOtp = async () => {
    const iban = ibanForm.iban.trim().toUpperCase().replace(/\s/g, "");
    if (!iban) { enqueueSnackbar(t("compliance.enter_new_iban", "Inserisci il nuovo IBAN"), { variant: "warning" }); return; }
    if (!iban.startsWith("IT") && !ibanForm.bic_swift.trim()) {
      enqueueSnackbar(t("compliance.bic_required_foreign", "BIC/SWIFT obbligatorio per IBAN non italiano"), { variant: "warning" });
      return;
    }
    setOtpSending(true);
    try {
      const r = await axiosInstance.post("api/wp/me/bank/send-otp", {});
      enqueueSnackbar(r?.data?.message || t("compliance.code_sent_email", "Codice inviato via email"), { variant: "success" });
      setOtpSent(true);
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || t("compliance.code_send_error", "Errore invio codice"), { variant: "error" });
    } finally {
      setOtpSending(false);
    }
  };

  const uploadNewDocuments = async () => {
    if (!docForm.document_type) { enqueueSnackbar(t("compliance.select_document_type", "Seleziona il tipo di documento"), { variant: "warning" }); return; }
    if (!docFrontFile && !docBackFile) { enqueueSnackbar(t("compliance.upload_front_or_back", "Carica almeno il fronte o il retro del documento"), { variant: "warning" }); return; }
    setUploadingDoc(true);
    try {
      const fd = new FormData();
      if (docFrontFile) fd.append("front", docFrontFile);
      if (docBackFile) fd.append("back", docBackFile);
      fd.append("document_type", docForm.document_type);
      if (docForm.document_number) fd.append("document_number", docForm.document_number);
      if (docForm.document_issuer) fd.append("document_issuer", docForm.document_issuer);
      if (docForm.document_issued_at) fd.append("document_issued_at", docForm.document_issued_at);
      if (docForm.document_expires_at) fd.append("document_expires_at", docForm.document_expires_at);
      await axiosInstance.post("api/wp/onboarding/upload-document", fd);
      enqueueSnackbar(t("compliance.new_documents_uploaded", "Nuovi documenti caricati. Saranno verificati a breve."), { variant: "success" });
      setDocDialogOpen(false);
      setDocFrontFile(null);
      setDocBackFile(null);
      setDocForm({ document_type: "", document_number: "", document_issuer: "", document_issued_at: "", document_expires_at: "" });
      await load();
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || t("compliance.upload_documents_error", "Errore caricamento documenti"), { variant: "error" });
    } finally {
      setUploadingDoc(false);
    }
  };

  const openDocDialog = () => {
    setDocForm({
      document_type: status?.id_document_type || status?.document_type || "",
      document_number: status?.id_document_number || "",
      document_issuer: status?.id_document_issuer || "",
      document_issued_at: status?.id_document_issued_at ? String(status.id_document_issued_at).slice(0, 10) : "",
      document_expires_at: status?.id_document_expires_at ? String(status.id_document_expires_at).slice(0, 10) : "",
    });
    setDocFrontFile(null);
    setDocBackFile(null);
    setDocDialogOpen(true);
  };

  const saveIban = async () => {
    if (!ibanForm.otp.trim()) { enqueueSnackbar(t("compliance.enter_otp_code", "Inserisci il codice OTP"), { variant: "warning" }); return; }
    setSavingIban(true);
    try {
      const iban = ibanForm.iban.trim().toUpperCase().replace(/\s/g, "");
      const r = await axiosInstance.post("api/wp/me/bank/update", {
        iban,
        bic_swift: ibanForm.bic_swift.trim().toUpperCase(),
        otp_code: ibanForm.otp.trim(),
      });
      enqueueSnackbar(r?.data?.message || t("compliance.iban_updated", "IBAN aggiornato"), { variant: "success" });
      setBank(r?.data?.data || { ...bank, iban, bic_swift: ibanForm.bic_swift });
      setIbanDialogOpen(false);
      setIbanForm({ iban: "", bic_swift: "", otp: "" });
      setOtpSent(false);
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || t("compliance.iban_update_error", "Errore aggiornamento IBAN"), { variant: "error" });
    } finally {
      setSavingIban(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress sx={{ color: ORO }} /></Box>;
  }

  const letteraAccepted = !!status?.lettera_accettata || !!status?.lettera_accepted_at;
  const docFront = !!status?.has_document_front;
  const docBack = !!status?.has_document_back;
  const kycApproved = status?.kyc_status === "approved";
  const kycPending = status?.kyc_status === "pending";
  const kycRejected = status?.kyc_status === "rejected";
  const kycRejectReason = status?.kyc_reject_reason || "";
  const iban = bank?.iban || "";
  const isItalianIban = iban.startsWith("IT");

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
        {t("compliance.page_intro", "Da questa sezione puoi consultare i tuoi documenti firmati, scaricare la Lettera di Incarico e aggiornare i dati per l'accredito dei compensi. L'onboarding gia completato non puo essere rifatto.")}
      </Alert>

      {/* Lettera */}
      <SectionCard
        icon="mdi:file-document-check-outline"
        title={t("compliance.letter_title", "Lettera di Incarico")}
        status={letteraAccepted ? t("compliance.status_signed", "Firmata") : t("compliance.status_not_signed", "Non firmata")}
        statusColor={letteraAccepted ? VERDE : ROSSO}
      >
        {letteraAccepted ? (
          <Stack spacing={1.2}>
            <Typography sx={{ fontSize: "0.88rem", color: ESPRESSO }}>
              {t("compliance.signed_digitally_on", "Sottoscritta digitalmente il")} <b>{formatDate(status.lettera_accepted_at)}</b>
              {status.lettera_accepted_ip && <> {t("compliance.from_ip", "dall'IP")} <b>{status.lettera_accepted_ip}</b></>}.
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mdi:download" />}
                onClick={downloadLettera}
                sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
              >{t("compliance.download_signed_pdf", "Scarica PDF firmato")}</Button>
            </Box>
          </Stack>
        ) : (
          <Typography sx={{ fontSize: "0.88rem", color: GRIGIO }}>
            {t("compliance.letter_not_signed_hint", "Non hai ancora firmato la Lettera di Incarico. Completa l'onboarding per attivare il tuo ruolo.")}
          </Typography>
        )}
      </SectionCard>

      {/* Documento identita */}
      <SectionCard
        icon="mdi:card-account-details-outline"
        title={t("compliance.id_document_title", "Documento d'identita")}
        status={kycRejected ? t("compliance.status_rejected", "Rifiutato") : (docFront && docBack ? t("compliance.status_uploaded", "Caricato") : (docFront || docBack ? t("compliance.status_partial", "Parziale") : t("compliance.status_missing", "Mancante")))}
        statusColor={kycRejected ? ROSSO : (docFront && docBack ? VERDE : (docFront || docBack ? ORO : ROSSO))}
      >
        {kycRejected && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, mb: 0.5 }}>{t("compliance.docs_not_approved", "I tuoi documenti non sono stati approvati")}</Typography>
            {kycRejectReason && (
              <Typography sx={{ fontSize: "0.82rem" }}><b>{t("compliance.reason_colon", "Motivo:")}</b> {kycRejectReason}</Typography>
            )}
            <Typography sx={{ fontSize: "0.82rem", mt: 0.5 }}>{t("compliance.upload_new_correct_docs", "Carica nuovi documenti corretti per procedere con la verifica.")}</Typography>
          </Alert>
        )}
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip
            icon={<Iconify icon={docFront ? "mdi:check-circle" : "mdi:close-circle"} />}
            label={t("onboarding.document.front", "Fronte")}
            sx={{ bgcolor: alpha(docFront && !kycRejected ? VERDE : ROSSO, 0.1), color: docFront && !kycRejected ? VERDE : ROSSO, fontWeight: 600 }}
          />
          <Chip
            icon={<Iconify icon={docBack ? "mdi:check-circle" : "mdi:close-circle"} />}
            label={t("onboarding.document.back", "Retro")}
            sx={{ bgcolor: alpha(docBack && !kycRejected ? VERDE : ROSSO, 0.1), color: docBack && !kycRejected ? VERDE : ROSSO, fontWeight: 600 }}
          />
        </Stack>
        <Box sx={{ mt: 2 }}>
          <Button
            variant={kycRejected || (!docFront && !docBack) ? "contained" : "outlined"}
            startIcon={<Iconify icon="mdi:upload" />}
            onClick={openDocDialog}
            sx={kycRejected || (!docFront && !docBack)
              ? { bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }
              : { borderColor: ORO, color: ORO, "&:hover": { borderColor: "#A07E2F", bgcolor: alpha(ORO, 0.05) } }}
          >{kycRejected ? t("compliance.upload_new_docs", "Carica nuovi documenti") : (docFront || docBack ? t("compliance.replace_document", "Sostituisci documento") : t("compliance.upload_documents", "Carica documenti"))}</Button>
        </Box>
        <Typography sx={{ fontSize: "0.78rem", color: GRIGIO, mt: 1.5 }}>
          {t("compliance.assistance_hint", "Per casi particolari o assistenza:")} <b>info@myevea.com</b>
        </Typography>
      </SectionCard>

      {/* IBAN */}
      <SectionCard
        icon="mdi:bank-outline"
        title={t("compliance.iban_title", "IBAN per accredito compensi")}
        status={iban ? t("compliance.status_configured", "Configurato") : t("compliance.status_to_configure", "Da configurare")}
        statusColor={iban ? VERDE : ROSSO}
      >
        {iban ? (
          <Stack spacing={1.5}>
            <Box>
              <Typography sx={{ fontSize: "0.75rem", color: GRIGIO, textTransform: "uppercase", letterSpacing: 0.5 }}>IBAN</Typography>
              <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: ESPRESSO, fontFamily: "monospace" }}>{iban}</Typography>
            </Box>
            {!isItalianIban && bank?.bic_swift && (
              <Box>
                <Typography sx={{ fontSize: "0.75rem", color: GRIGIO, textTransform: "uppercase", letterSpacing: 0.5 }}>BIC / SWIFT</Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ESPRESSO, fontFamily: "monospace" }}>{bank.bic_swift}</Typography>
              </Box>
            )}
            {bank?.account_holder && (
              <Box>
                <Typography sx={{ fontSize: "0.75rem", color: GRIGIO, textTransform: "uppercase", letterSpacing: 0.5 }}>{t("compliance.account_holder", "Intestatario")}</Typography>
                <Typography sx={{ fontSize: "0.95rem", color: ESPRESSO }}>{bank.account_holder}</Typography>
              </Box>
            )}
            <Box>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="mdi:pencil" />}
                onClick={() => { setIbanForm({ iban: "", bic_swift: "", otp: "" }); setOtpSent(false); setIbanDialogOpen(true); }}
                sx={{ borderColor: ORO, color: ORO, "&:hover": { borderColor: "#A07E2F", bgcolor: alpha(ORO, 0.05) } }}
              >{t("compliance.edit_iban_with_code", "Modifica IBAN (con codice di verifica)")}</Button>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            <Typography sx={{ fontSize: "0.88rem", color: ROSSO }}>
              {t("compliance.iban_not_configured", "IBAN non configurato. Senza IBAN non e' possibile ricevere i compensi.")}
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mdi:plus" />}
                onClick={() => { setIbanForm({ iban: "", bic_swift: "", otp: "" }); setOtpSent(false); setIbanDialogOpen(true); }}
                sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
              >{t("compliance.set_iban", "Imposta IBAN")}</Button>
            </Box>
          </Stack>
        )}
      </SectionCard>

      {/* KYC */}
      <SectionCard
        icon="mdi:shield-check-outline"
        title={t("compliance.kyc_title", "Verifica KYC (Know Your Customer)")}
        status={kycApproved ? t("compliance.status_approved", "Approvato") : (kycPending ? t("compliance.status_under_review", "In revisione") : (kycRejected ? t("compliance.status_rejected", "Rifiutato") : t("compliance.status_not_started", "Non avviato")))}
        statusColor={kycApproved ? VERDE : (kycPending ? ORO : (kycRejected ? ROSSO : GRIGIO))}
      >
        {kycRejected ? (
          <Stack spacing={1}>
            <Typography sx={{ fontSize: "0.85rem", color: ROSSO, fontWeight: 600 }}>
              {t("compliance.kyc_rejected_hint", "La verifica e' stata rifiutata. Carica nuovi documenti corretti per riprovare.")}
            </Typography>
            {kycRejectReason && (
              <Typography sx={{ fontSize: "0.82rem", color: GRIGIO }}>
                <b>{t("compliance.reason_colon", "Motivo:")}</b> {kycRejectReason}
              </Typography>
            )}
          </Stack>
        ) : (
          <Typography sx={{ fontSize: "0.85rem", color: GRIGIO }}>
            {kycApproved
              ? t("compliance.kyc_approved_hint", "La tua identita e' stata verificata con successo.")
              : (kycPending
                  ? t("compliance.kyc_pending_hint", "I tuoi documenti sono in fase di verifica da parte del nostro team. Riceverai una notifica appena completato.")
                  : t("compliance.kyc_not_started_hint", "La verifica KYC e' necessaria per attivare i pagamenti dei compensi."))}
          </Typography>
        )}
      </SectionCard>

      {/* Dialog ri-caricamento documenti */}
      <Dialog open={docDialogOpen} onClose={() => !uploadingDoc && setDocDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: ESPRESSO, fontWeight: 700 }}>
          {kycRejected ? t("compliance.upload_new_docs", "Carica nuovi documenti") : t("compliance.upload_id_document", "Carica documento d'identita")}
          <IconButton onClick={() => !uploadingDoc && setDocDialogOpen(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <Iconify icon="mdi:close" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {kycRejected && kycRejectReason && (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                <b>{t("compliance.previous_rejection_reason", "Motivo del rifiuto precedente:")}</b> {kycRejectReason}
              </Alert>
            )}
            <TextField select fullWidth size="small" required label={t("onboarding.form.document_type", "Tipo documento *")} value={docForm.document_type} onChange={(e) => setDocForm({ ...docForm, document_type: e.target.value })}>
              <MenuItem value="carta_identita">{t("onboarding.document.id_card", "Carta di Identita")}</MenuItem>
              <MenuItem value="passaporto">{t("onboarding.document.passport", "Passaporto")}</MenuItem>
              <MenuItem value="patente">{t("onboarding.document.driver_license", "Patente di Guida")}</MenuItem>
            </TextField>
            <TextField fullWidth size="small" label={t("compliance.document_number_label", "Numero documento")} value={docForm.document_number} onChange={(e) => setDocForm({ ...docForm, document_number: e.target.value.toUpperCase() })} placeholder={t("onboarding.form.document_number_placeholder", "es. CA12345AB")} />
            <TextField fullWidth size="small" label={t("compliance.document_issuer_label", "Rilasciato da")} value={docForm.document_issuer} onChange={(e) => setDocForm({ ...docForm, document_issuer: e.target.value })} placeholder={t("onboarding.form.document_issuer_placeholder", "es. Comune di Roma / Questura di Verona")} />
            <Stack direction="row" spacing={2}>
              <TextField fullWidth size="small" type="date" label={t("compliance.issue_date_label", "Data rilascio")} InputLabelProps={{ shrink: true }} value={docForm.document_issued_at} onChange={(e) => setDocForm({ ...docForm, document_issued_at: e.target.value })} />
              <TextField fullWidth size="small" type="date" label={t("compliance.expiry_date_label", "Data scadenza")} InputLabelProps={{ shrink: true }} value={docForm.document_expires_at} onChange={(e) => setDocForm({ ...docForm, document_expires_at: e.target.value })} />
            </Stack>
            <Box>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: ESPRESSO, mb: 1 }}>{t("onboarding.document.front", "Fronte")}</Typography>
              <input ref={docFrontRef} type="file" accept="image/*,.heic,.heif,.pdf" style={{ display: "none" }} onChange={async (e) => {
                const f = e.target.files[0]; if (!f) return;
                try { setDocFrontFile(await convertHeicIfNeeded(f)); }
                catch { enqueueSnackbar(t("onboarding.document.photo_error", "Impossibile leggere la foto. Riprova o usa JPG/PDF."), { variant: "error" }); }
              }} />
              <Button variant="outlined" onClick={() => docFrontRef.current?.click()} startIcon={<Iconify icon="mdi:upload" />} sx={{ borderColor: alpha(ORO, 0.3), color: ORO }}>
                {docFrontFile ? docFrontFile.name : t("onboarding.document.upload_front", "Carica fronte")}
              </Button>
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: ESPRESSO, mb: 1 }}>{t("onboarding.document.back", "Retro")}</Typography>
              <input ref={docBackRef} type="file" accept="image/*,.heic,.heif,.pdf" style={{ display: "none" }} onChange={async (e) => {
                const f = e.target.files[0]; if (!f) return;
                try { setDocBackFile(await convertHeicIfNeeded(f)); }
                catch { enqueueSnackbar(t("onboarding.document.photo_error", "Impossibile leggere la foto. Riprova o usa JPG/PDF."), { variant: "error" }); }
              }} />
              <Button variant="outlined" onClick={() => docBackRef.current?.click()} startIcon={<Iconify icon="mdi:upload" />} sx={{ borderColor: alpha(ORO, 0.3), color: ORO }}>
                {docBackFile ? docBackFile.name : t("onboarding.document.upload_back", "Carica retro")}
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDocDialogOpen(false)} disabled={uploadingDoc} sx={{ color: GRIGIO }}>{t("compliance.cancel", "Annulla")}</Button>
          <Button
            variant="contained"
            onClick={uploadNewDocuments}
            disabled={uploadingDoc}
            startIcon={uploadingDoc ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <Iconify icon="mdi:upload" />}
            sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
          >{t("compliance.upload_and_submit", "Carica e invia per verifica")}</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog modifica IBAN */}
      <Dialog open={ibanDialogOpen} onClose={() => !savingIban && setIbanDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: ESPRESSO, fontWeight: 700 }}>
          {iban ? t("compliance.edit_iban", "Modifica IBAN") : t("compliance.set_iban", "Imposta IBAN")}
          <IconButton onClick={() => !savingIban && setIbanDialogOpen(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <Iconify icon="mdi:close" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              {t("compliance.iban_security_notice", "Per motivi di sicurezza la modifica dell'IBAN richiede un codice di verifica inviato alla tua email.")}
            </Alert>
            <TextField
              fullWidth
              label={t("compliance.new_iban_label", "Nuovo IBAN")}
              required
              value={ibanForm.iban}
              onChange={(e) => setIbanForm({ ...ibanForm, iban: e.target.value.toUpperCase().replace(/\s/g, "") })}
              placeholder="IT60X0542811101000000123456"
              helperText={t("compliance.sepa_helper", "Formato europeo SEPA")}
              disabled={otpSent}
            />
            {ibanForm.iban && !ibanForm.iban.startsWith("IT") && (
              <TextField
                fullWidth
                label={t("compliance.bic_swift_foreign_label", "BIC / SWIFT (obbligatorio per IBAN non italiano)")}
                required
                value={ibanForm.bic_swift}
                onChange={(e) => setIbanForm({ ...ibanForm, bic_swift: e.target.value.toUpperCase() })}
                placeholder="ABCDEFGH"
                disabled={otpSent}
              />
            )}

            {!otpSent ? (
              <Button
                variant="contained"
                fullWidth
                onClick={sendIbanOtp}
                disabled={otpSending}
                startIcon={otpSending ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <Iconify icon="mdi:email-fast" />}
                sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
              >{t("compliance.send_verification_code", "Invia codice di verifica")}</Button>
            ) : (
              <>
                <Divider />
                <Alert severity="info" sx={{ borderRadius: 2 }}>{t("compliance.check_email_15min", "Controlla la tua email — il codice scade tra 15 minuti.")}</Alert>
                <TextField
                  fullWidth
                  label={t("compliance.otp_6_digits_label", "Codice OTP (6 cifre)")}
                  required
                  value={ibanForm.otp}
                  onChange={(e) => setIbanForm({ ...ibanForm, otp: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  placeholder="123456"
                  inputProps={{ maxLength: 6, style: { fontFamily: "monospace", fontSize: "1.3rem", letterSpacing: "0.3rem", textAlign: "center" } }}
                />
                <Button
                  size="small"
                  onClick={() => { setOtpSent(false); setIbanForm({ ...ibanForm, otp: "" }); }}
                  sx={{ color: GRIGIO, alignSelf: "flex-start" }}
                >{t("compliance.resend_change_iban", "Reinvia codice / cambia IBAN")}</Button>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIbanDialogOpen(false)} disabled={savingIban} sx={{ color: GRIGIO }}>{t("compliance.cancel", "Annulla")}</Button>
          {otpSent && (
            <Button
              variant="contained"
              onClick={saveIban}
              disabled={savingIban || ibanForm.otp.length !== 6}
              startIcon={savingIban ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <Iconify icon="mdi:content-save" />}
              sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } }}
            >{t("compliance.confirm_change", "Conferma modifica")}</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentiCompliance;
