import { useEffect, useState, useCallback } from "react";
import {
  Box, Card, Stack, Typography, Button, Chip, Tabs, Tab, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress, Alert, Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const VERDE = "#2C5F2D";
const ROSSO = "#B23A48";
const GRIGIO = "#7A6A5C";

const STATUS_LABEL = {
  in_attesa_fattura:   { label: "In attesa fattura", color: ORO },
  pronto_al_bonifico:  { label: "Pronto al bonifico", color: VERDE },
  approved:            { label: "Approvato (bonificato)", color: "#1976d2" },
  cancelled:           { label: "Annullato", color: ROSSO },
};

const fmtEuro = (n) => "€ " + Number(n || 0).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (s) => s ? new Date(s).toLocaleDateString("it-IT") : "—";
const giorniDa = (s) => {
  if (!s) return "—";
  const d = Math.floor((Date.now() - new Date(s).getTime()) / 86400000);
  return d + "gg";
};

const PayoutFatture = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = useState("in_attesa_fattura");
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(25);

  // Dialog "Registra fattura"
  const [confDlg, setConfDlg] = useState({ open: false, payout: null });
  const [confForm, setConfForm] = useState({ numero_fattura: "", data_fattura: "", note: "" });
  const [confSaving, setConfSaving] = useState(false);

  // Dialog "Annulla"
  const [annDlg, setAnnDlg] = useState({ open: false, payout: null });
  const [annMotivo, setAnnMotivo] = useState("");
  const [annSaving, setAnnSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axiosInstance.get("api/wp/admin/payout-requests", {
        params: { status, page, per_page: perPage },
      });
      setData(r.data.data || []);
      setMeta(r.data.meta || {});
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Errore caricamento", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [status, page, perPage, enqueueSnackbar]);

  useEffect(() => { load(); }, [load]);

  const openConferma = (p) => {
    setConfDlg({ open: true, payout: p });
    setConfForm({ numero_fattura: "", data_fattura: new Date().toISOString().slice(0, 10), note: "" });
  };

  const submitConferma = async () => {
    if (!confForm.numero_fattura.trim()) {
      enqueueSnackbar("Numero fattura obbligatorio", { variant: "warning" });
      return;
    }
    if (!confForm.data_fattura) {
      enqueueSnackbar("Data fattura obbligatoria", { variant: "warning" });
      return;
    }
    setConfSaving(true);
    try {
      const r = await axiosInstance.patch(
        `api/wp/admin/payout-requests/${confDlg.payout.id}/conferma-fattura`,
        confForm
      );
      enqueueSnackbar(r?.data?.message || "Fattura registrata", { variant: "success" });
      setConfDlg({ open: false, payout: null });
      await load();
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Errore", { variant: "error" });
    } finally {
      setConfSaving(false);
    }
  };

  const submitAnnulla = async () => {
    if (!annMotivo.trim()) {
      enqueueSnackbar("Motivo obbligatorio", { variant: "warning" });
      return;
    }
    setAnnSaving(true);
    try {
      const r = await axiosInstance.patch(
        `api/wp/admin/payout-requests/${annDlg.payout.id}/annulla`,
        { motivo: annMotivo }
      );
      enqueueSnackbar(r?.data?.message || "Annullato", { variant: "success" });
      setAnnDlg({ open: false, payout: null });
      setAnnMotivo("");
      await load();
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Errore", { variant: "error" });
    } finally {
      setAnnSaving(false);
    }
  };

  const kpi = meta.kpi || {};

  return (
    <Page title="Pagamenti IVD-Abituali">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
        <HeaderBreadcrumbs
          heading="Pagamenti IVD-Abituali"
          links={[
            { name: "Dashboard", href: "/admin/dashboard" },
            { name: "Finanziario" },
            { name: "Pagamenti IVD-Abituali" },
          ]}
        />

        {/* KPI */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Card sx={{ p: 2, flex: 1, borderRadius: 2 }}>
            <Typography sx={{ fontSize: "0.75rem", color: GRIGIO, textTransform: "uppercase" }}>Richieste</Typography>
            <Typography variant="h5" fontWeight={700} color={ESPRESSO}>{kpi.n || 0}</Typography>
          </Card>
          <Card sx={{ p: 2, flex: 1, borderRadius: 2 }}>
            <Typography sx={{ fontSize: "0.75rem", color: GRIGIO, textTransform: "uppercase" }}>Totale lordo</Typography>
            <Typography variant="h5" fontWeight={700} color={ESPRESSO}>{fmtEuro(kpi.totale_lordo)}</Typography>
          </Card>
          <Card sx={{ p: 2, flex: 1, borderRadius: 2 }}>
            <Typography sx={{ fontSize: "0.75rem", color: GRIGIO, textTransform: "uppercase" }}>Totale netto</Typography>
            <Typography variant="h5" fontWeight={700} color={ESPRESSO}>{fmtEuro(kpi.totale_netto)}</Typography>
          </Card>
        </Stack>

        {/* Tabs status */}
        <Card sx={{ mb: 2, borderRadius: 2 }}>
          <Tabs value={status} onChange={(_, v) => { setStatus(v); setPage(1); }} variant="scrollable" sx={{ "& .Mui-selected": { color: ORO + " !important" }, "& .MuiTabs-indicator": { backgroundColor: ORO } }}>
            <Tab value="in_attesa_fattura" label="In attesa fattura" />
            <Tab value="pronto_al_bonifico" label="Pronto al bonifico" />
            <Tab value="approved" label="Approvati" />
            <Tab value="cancelled" label="Annullati" />
          </Tabs>
        </Card>

        {status === "in_attesa_fattura" && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Promoter IVD-abituali (P.IVA) hanno richiesto un payout. Attendere ricezione fattura via SDI/PEC, poi cliccare "Registra fattura" per sbloccare il bonifico.
          </Alert>
        )}
        {status === "pronto_al_bonifico" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Fattura ricevuta e registrata. Esegui il bonifico dal home banking, poi marca come "approved" da centro controllo.
          </Alert>
        )}

        <Card sx={{ borderRadius: 2 }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress sx={{ color: ORO }} /></Box>
          ) : data.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center", color: GRIGIO }}>Nessun payout in stato "{STATUS_LABEL[status]?.label}".</Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }}>Promoter</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }}>P.IVA</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }} align="right">Lordo</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }} align="right">Imp.</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }} align="right">IVA</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }} align="right">Rit.</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }} align="right">Netto</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }}>Richiesta</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }}>Età</TableCell>
                  {status === "in_attesa_fattura" && (
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }} align="center">Azioni</TableCell>
                  )}
                  {(status === "pronto_al_bonifico" || status === "approved") && (
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem" }}>N. Fattura</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ fontSize: "0.78rem", fontWeight: 600 }}>#{p.id}</TableCell>
                    <TableCell sx={{ fontSize: "0.78rem" }}>
                      <Stack>
                        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600 }}>{p.first_name} {p.last_name}</Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: GRIGIO }}>@{p.username}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.78rem", fontFamily: "monospace" }}>{p.partita_iva || "—"}</TableCell>
                    <TableCell sx={{ fontSize: "0.78rem" }} align="right">{fmtEuro(p.amount)}</TableCell>
                    <TableCell sx={{ fontSize: "0.78rem" }} align="right">{fmtEuro(p.imponibile)}</TableCell>
                    <TableCell sx={{ fontSize: "0.78rem" }} align="right">{fmtEuro(p.iva)}</TableCell>
                    <TableCell sx={{ fontSize: "0.78rem" }} align="right">{fmtEuro(p.ritenuta)}</TableCell>
                    <TableCell sx={{ fontSize: "0.78rem", fontWeight: 700, color: VERDE }} align="right">{fmtEuro(p.netto)}</TableCell>
                    <TableCell sx={{ fontSize: "0.78rem" }}>{fmtDate(p.created_at)}</TableCell>
                    <TableCell sx={{ fontSize: "0.78rem" }}>
                      <Chip
                        label={giorniDa(p.created_at)}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                        color={(p.created_at && (Date.now() - new Date(p.created_at).getTime()) > 15 * 86400000) ? "warning" : "default"}
                      />
                    </TableCell>
                    {status === "in_attesa_fattura" && (
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Registra fattura ricevuta">
                            <IconButton size="small" onClick={() => openConferma(p)} sx={{ color: VERDE }}>
                              <Iconify icon="mdi:receipt-text-check" width={20} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Annulla richiesta (ricredita wallet)">
                            <IconButton size="small" onClick={() => setAnnDlg({ open: true, payout: p })} sx={{ color: ROSSO }}>
                              <Iconify icon="mdi:close-circle-outline" width={20} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    )}
                    {(status === "pronto_al_bonifico" || status === "approved") && (
                      <TableCell sx={{ fontSize: "0.78rem" }}>
                        <Stack>
                          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600 }}>{p.numero_fattura_promoter || "—"}</Typography>
                          <Typography sx={{ fontSize: "0.7rem", color: GRIGIO }}>{fmtDate(p.data_fattura_promoter)}</Typography>
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Dialog Registra fattura */}
        <Dialog open={confDlg.open} onClose={() => !confSaving && setConfDlg({ open: false, payout: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: ESPRESSO, fontWeight: 700 }}>
            Registra fattura ricevuta
            {confDlg.payout && <Typography sx={{ fontSize: "0.85rem", color: GRIGIO, fontWeight: 400 }}>Payout #{confDlg.payout.id} — {confDlg.payout.first_name} {confDlg.payout.last_name}</Typography>}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Inserisci gli estremi della fattura ricevuta dal promoter. Lo stato passerà a "pronto_al_bonifico". Esegui poi il bonifico dal home banking.
              </Alert>
              {confDlg.payout && (
                <Box sx={{ p: 1.5, bgcolor: "#fafafa", borderRadius: 2 }}>
                  <Typography sx={{ fontSize: "0.75rem", color: GRIGIO }}>Importo fattura atteso</Typography>
                  <Typography sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
                    {fmtEuro((Number(confDlg.payout.imponibile) || 0) + (Number(confDlg.payout.iva) || 0))}
                    <Typography component="span" sx={{ fontSize: "0.75rem", color: GRIGIO, ml: 1 }}>
                      ({fmtEuro(confDlg.payout.imponibile)} imp. + {fmtEuro(confDlg.payout.iva)} IVA)
                    </Typography>
                  </Typography>
                </Box>
              )}
              <TextField fullWidth size="small" required label="Numero fattura" value={confForm.numero_fattura} onChange={(e) => setConfForm({ ...confForm, numero_fattura: e.target.value })} />
              <TextField fullWidth size="small" required type="date" label="Data fattura" InputLabelProps={{ shrink: true }} value={confForm.data_fattura} onChange={(e) => setConfForm({ ...confForm, data_fattura: e.target.value })} />
              <TextField fullWidth size="small" label="Note (opzionali)" multiline rows={2} value={confForm.note} onChange={(e) => setConfForm({ ...confForm, note: e.target.value })} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setConfDlg({ open: false, payout: null })} disabled={confSaving} sx={{ color: GRIGIO }}>Annulla</Button>
            <Button variant="contained" onClick={submitConferma} disabled={confSaving} startIcon={confSaving ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <Iconify icon="mdi:check" />} sx={{ bgcolor: VERDE, "&:hover": { bgcolor: "#1F4D1F" } }}>
              Conferma e sblocca bonifico
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Annulla */}
        <Dialog open={annDlg.open} onClose={() => !annSaving && setAnnDlg({ open: false, payout: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: ROSSO, fontWeight: 700 }}>
            Annulla richiesta payout
            {annDlg.payout && <Typography sx={{ fontSize: "0.85rem", color: GRIGIO, fontWeight: 400 }}>Payout #{annDlg.payout.id} — {annDlg.payout.first_name} {annDlg.payout.last_name}</Typography>}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                L'annullamento <b>ricrediterà {fmtEuro(annDlg.payout?.amount)}</b> nel wallet del promoter. Operazione tracciata nei log.
              </Alert>
              <TextField fullWidth size="small" required label="Motivo annullamento" multiline rows={3} value={annMotivo} onChange={(e) => setAnnMotivo(e.target.value)} placeholder="Es. fattura non emessa entro i termini contrattuali" />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAnnDlg({ open: false, payout: null })} disabled={annSaving} sx={{ color: GRIGIO }}>Indietro</Button>
            <Button variant="contained" onClick={submitAnnulla} disabled={annSaving} startIcon={annSaving ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <Iconify icon="mdi:close-circle" />} sx={{ bgcolor: ROSSO, "&:hover": { bgcolor: "#8A2D38" } }}>
              Annulla e ricredita wallet
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Page>
  );
};

export default PayoutFatture;
