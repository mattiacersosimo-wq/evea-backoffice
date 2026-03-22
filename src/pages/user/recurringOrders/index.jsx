import {
  Box, Button, Card, Chip, CircularProgress, Collapse, Dialog,
  DialogActions, DialogContent, DialogTitle, Divider, IconButton,
  Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import axiosInstance from "src/utils/axios";
// My Subscriptions (kit distributore)
import useMySubFetch from "src/pages/user/subscriptions/components/content/hooks/useFetchSubscription";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const SABBIA = "#E8DDCA";
const MUSCHIO = "#4A5C3A";
const WARNING = "#EF9F27";
const DANGER = "#E24B4A";
const AVORIO = "#FAF6EF";

const STATUS_MAP = {
  active: { label: "Attivo", color: MUSCHIO, bg: alpha(MUSCHIO, 0.1) },
  paused: { label: "In pausa", color: WARNING, bg: alpha(WARNING, 0.1) },
  cancelled: { label: "Cancellato", color: DANGER, bg: alpha(DANGER, 0.1) },
  expired: { label: "Scaduto", color: "#999", bg: "#f5f5f5" },
};

const INTERVAL_MAP = { day: "giorno", week: "settimana", month: "mese", year: "anno" };

const formatDate = (dateStr) => {
  if (!dateStr) return "\u2014";
  try {
    return new Date(dateStr).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  } catch { return dateStr; }
};

// ═══════════════════════════════════════
// SEAL SUBSCRIPTION CARD
// ═══════════════════════════════════════
const SealCard = ({ sub, onAction }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const status = STATUS_MAP[sub.status] || STATUS_MAP.expired;
  const interval = INTERVAL_MAP[sub.interval] || sub.interval;
  const intervalText = sub.interval_count > 1 ? `ogni ${sub.interval_count} ${interval}i` : `ogni ${interval}`;

  const loadHistory = async () => {
    if (history) { setShowHistory(!showHistory); return; }
    setHistoryLoading(true);
    try {
      const { data } = await axiosInstance.get(`api/wp/seal/subscription/${sub.id}/history`);
      setHistory(data?.data || []);
      setShowHistory(true);
    } catch {
      enqueueSnackbar("Errore nel caricamento storico", { variant: "error" });
    }
    setHistoryLoading(false);
  };

  const handleAction = async (action, body = null) => {
    setActionLoading(true);
    try {
      await axiosInstance.put(`api/wp/seal/subscription/${sub.id}/${action}`, body);
      const labels = { pause: "messo in pausa", resume: "ripreso", cancel: "cancellato" };
      enqueueSnackbar(`Abbonamento ${labels[action] || action}`, { variant: "success" });
      onAction();
    } catch (e) {
      enqueueSnackbar(e?.error || "Errore nell'operazione", { variant: "error" });
    }
    setActionLoading(false);
    setCancelOpen(false);
  };

  const handleReschedule = async () => {
    if (!newDate) return;
    setActionLoading(true);
    try {
      await axiosInstance.put(`api/wp/seal/subscription/${sub.id}/reschedule`, {
        date: newDate, time: "09:00", timezone: "+02:00",
      });
      enqueueSnackbar("Data rinnovo aggiornata", { variant: "success" });
      setShowReschedule(false);
      onAction();
    } catch (e) {
      enqueueSnackbar(e?.error || "Errore nel riprogrammare", { variant: "error" });
    }
    setActionLoading(false);
  };

  return (
    <Card sx={{ bgcolor: "#fff", border: `1px solid ${SABBIA}`, borderRadius: 3, overflow: "hidden", mb: 2 }}>
      <Box sx={{ p: 2.5 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, color: ESPRESSO }}>{sub.product_title}</Typography>
              <Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: "0.7rem", height: 24 }} />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
              <Typography sx={{ fontSize: "0.78rem", color: "#7A6A5C" }}>
                <b style={{ color: ORO, fontSize: "1.1em" }}>{"\u20AC"}{Number(sub.price).toFixed(2)}</b> {intervalText}
              </Typography>
              {sub.next_billing_date && sub.status === "active" && (
                <Typography sx={{ fontSize: "0.78rem", color: "#7A6A5C" }}>
                  Prossimo rinnovo: <b style={{ color: ESPRESSO }}>{formatDate(sub.next_billing_date)}</b>
                </Typography>
              )}
            </Stack>
            <Typography sx={{ fontSize: "0.65rem", color: "#aaa", mt: 0.3 }}>
              Attivo dal {formatDate(sub.created_at)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {sub.status === "active" && (
              <Button size="small" variant="contained" disabled={actionLoading}
                onClick={() => handleAction("pause")}
                sx={{ bgcolor: WARNING, "&:hover": { bgcolor: "#D98E1F" }, textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
                Metti in pausa
              </Button>
            )}
            {sub.status === "paused" && (
              <Button size="small" variant="contained" disabled={actionLoading}
                onClick={() => handleAction("resume")}
                sx={{ bgcolor: MUSCHIO, "&:hover": { bgcolor: "#3A4C2A" }, textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
                Riprendi
              </Button>
            )}
            {(sub.status === "active" || sub.status === "paused") && (
              <>
                <Button size="small" variant="outlined" disabled={actionLoading}
                  onClick={() => setShowReschedule(!showReschedule)}
                  sx={{ borderColor: SABBIA, color: ESPRESSO, textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
                  Cambia data
                </Button>
                <Button size="small" variant="outlined" disabled={actionLoading}
                  onClick={() => setCancelOpen(true)}
                  sx={{ borderColor: alpha(DANGER, 0.3), color: DANGER, textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
                  Cancella
                </Button>
              </>
            )}
            <IconButton size="small" onClick={loadHistory} sx={{ color: "#7A6A5C" }}>
              {historyLoading ? <CircularProgress size={18} /> : <Iconify icon="mdi:history" width={20} />}
            </IconButton>
          </Stack>
        </Stack>

        <Collapse in={showReschedule}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2, p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.15)}` }}>
            <Iconify icon="mdi:calendar-edit" width={20} sx={{ color: ORO }} />
            <TextField type="date" size="small" value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              inputProps={{ min: new Date().toISOString().split("T")[0] }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            <Button size="small" variant="contained" disabled={!newDate || actionLoading}
              onClick={handleReschedule}
              sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
              Conferma
            </Button>
          </Stack>
        </Collapse>
      </Box>

      <Collapse in={showHistory}>
        <Divider />
        <Box sx={{ p: 2, bgcolor: AVORIO }}>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>Storico pagamenti</Typography>
          {history && history.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C" }}>Data</TableCell>
                  <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C" }}>Importo</TableCell>
                  <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C" }}>Stato</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.slice(0, 10).map((h, i) => {
                  const hs = h.status === "completed" ? { color: MUSCHIO, bg: alpha(MUSCHIO, 0.1), label: "Completato" }
                    : h.status === "failed" ? { color: DANGER, bg: alpha(DANGER, 0.1), label: "Fallito" }
                    : h.status === "info" ? { color: "#607D8B", bg: alpha("#607D8B", 0.1), label: "Info" }
                    : { color: WARNING, bg: alpha(WARNING, 0.1), label: "Programmato" };
                  return (
                    <TableRow key={h.id || i}>
                      <TableCell sx={{ fontSize: "0.75rem" }}>{formatDate(h.date)}</TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                        {h.type === "log" ? <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>{h.note}</Typography> : `\u20AC${Number(h.amount).toFixed(2)}`}
                      </TableCell>
                      <TableCell><Chip label={hs.label} size="small" sx={{ bgcolor: hs.bg, color: hs.color, fontWeight: 600, fontSize: "0.65rem", height: 22 }} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Typography sx={{ fontSize: "0.75rem", color: "#aaa" }}>Nessun pagamento registrato</Typography>
          )}
        </Box>
      </Collapse>

      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: ESPRESSO }}>Conferma cancellazione</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#7A6A5C" }}>
            Sei sicuro di voler cancellare l'abbonamento per <b>{sub.product_title}</b>? Perderai gli sconti del Percorso Fedeltà.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCancelOpen(false)} sx={{ textTransform: "none", color: "#7A6A5C" }}>Annulla</Button>
          <Button variant="contained" disabled={actionLoading}
            onClick={() => handleAction("cancel")}
            sx={{ bgcolor: DANGER, "&:hover": { bgcolor: "#C13B3A" }, textTransform: "none", fontWeight: 700 }}>
            {actionLoading ? <CircularProgress size={18} color="inherit" /> : "Cancella abbonamento"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

// ═══════════════════════════════════════
// SEAL SECTION
// ═══════════════════════════════════════
const SealSection = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("api/wp/seal/subscriptions");
      setSubs(data?.data || []);
    } catch {
      // Silently fail — user may not have Seal subscriptions
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  if (loading) return <Box sx={{ textAlign: "center", py: 3 }}><CircularProgress sx={{ color: ORO }} size={28} /></Box>;
  if (!subs.length) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon="mdi:refresh-circle" width={20} sx={{ color: ORO }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ESPRESSO }}>Smartship</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>Gestisci i tuoi abbonamenti Seal</Typography>
        </Box>
      </Stack>
      {subs.map((sub) => <SealCard key={sub.id} sub={sub} onAction={fetchSubs} />)}

      <Card sx={{ p: 2, border: `1px solid ${SABBIA}`, borderRadius: 3, bgcolor: alpha(MUSCHIO, 0.03) }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Iconify icon="mdi:leaf" width={20} sx={{ color: MUSCHIO }} />
          <Typography sx={{ fontSize: "0.72rem", color: "#7A6A5C" }}>
            Mantieni il tuo abbonamento attivo per sbloccare -10% su ogni consegna e un coupon {"\u20AC"}30 ogni 3 mesi
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
};

// ═══════════════════════════════════════
// MAIN PAGE — Seal + Internal subscriptions
// ═══════════════════════════════════════
const RecurringOrder = () => {
  const { state: mySubState, fetchData: mySubFetch, ...mySubRest } = useMySubFetch();
  const { data: mySubData, ...mySubDataProps } = mySubState;

  return (
    <Page title="I miei abbonamenti">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
        {/* Hero */}
        <Card sx={{ bgcolor: "#FAF6EF", color: ESPRESSO, borderRadius: 4, p: 3, mb: 3, border: `1px solid ${alpha(ORO, 0.2)}` }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:refresh-circle" width={28} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color={ESPRESSO}>I miei abbonamenti</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#7A6A5C" }}>Percorso Fedeltà — gestisci i tuoi abbonamenti</Typography>
            </Box>
          </Stack>
        </Card>

        {/* Seal Subscriptions (Smartship) */}
        <SealSection />

        {/* Kit Distributore (My Subscriptions) */}
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:badge-account-outline" width={20} sx={{ color: ORO }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ESPRESSO }}>Kit Distributore</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>Il tuo abbonamento promoter</Typography>
          </Box>
        </Stack>
        <DataHandlerList dataProps={mySubDataProps}>
          <Map
            list={mySubData}
            render={(product) => {
              const name = product?.purchase_product?.name || "N/A";
              const status = (product?.active_status || "").toLowerCase();
              const st = status === "active" ? { label: "Attivo", color: MUSCHIO, bg: alpha(MUSCHIO, 0.1) }
                : status === "expired" ? { label: "Scaduto", color: DANGER, bg: alpha(DANGER, 0.1) }
                : { label: product?.active_status || status, color: WARNING, bg: alpha(WARNING, 0.1) };
              const purchaseDate = product?.created_at ? formatDate(product.created_at) : null;
              const expiryDate = product?.effective_until ? formatDate(product.effective_until) : null;
              return (
                <Card key={product?.id} sx={{ bgcolor: "#fff", border: `1px solid ${SABBIA}`, borderRadius: 3, overflow: "hidden", mb: 2 }}>
                  <Box sx={{ p: 2.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
                      <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, color: ESPRESSO, textTransform: "capitalize" }}>{name}</Typography>
                      <Chip label={st.label} size="small" sx={{ bgcolor: st.bg, color: st.color, fontWeight: 700, fontSize: "0.7rem", height: 24 }} />
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                      {purchaseDate && (
                        <Typography sx={{ fontSize: "0.78rem", color: "#7A6A5C" }}>
                          Attivo dal <b style={{ color: ESPRESSO }}>{purchaseDate}</b>
                        </Typography>
                      )}
                      {expiryDate && (
                        <Typography sx={{ fontSize: "0.78rem", color: "#7A6A5C" }}>
                          Scade il <b style={{ color: ESPRESSO }}>{expiryDate}</b>
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Card>
              );
            }}
          />
        </DataHandlerList>
        <PaginationButtons {...mySubRest} />

      </Box>
    </Page>
  );
};

export default RecurringOrder;
