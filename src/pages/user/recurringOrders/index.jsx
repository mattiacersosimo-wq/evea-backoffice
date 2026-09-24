import {
  Box, Button, Card, Chip, CircularProgress, Collapse, Dialog,
  DialogActions, DialogContent, DialogTitle, Divider, IconButton,
  Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import SmartshipActivateCard from "src/components/SmartshipActivateCard";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { WP_URL } from "src/config";
import axiosInstance from "src/utils/axios";
import useAuth from "src/hooks/useAuth";
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
  active: { labelKey: "subscriptions.status_active", labelFallback: "Attivo", color: MUSCHIO, bg: alpha(MUSCHIO, 0.1) },
  paused: { labelKey: "subscriptions.status_paused", labelFallback: "In pausa", color: WARNING, bg: alpha(WARNING, 0.1) },
  cancelled: { labelKey: "subscriptions.status_cancelled", labelFallback: "Cancellato", color: DANGER, bg: alpha(DANGER, 0.1) },
  expired: { labelKey: "subscriptions.status_expired", labelFallback: "Scaduto", color: "#999", bg: "#f5f5f5" },
};

const INTERVAL_KEYS = {
  day: { singular: "subscriptions.interval_day", singularFallback: "giorno", plural: "subscriptions.interval_day_plural", pluralFallback: "giorni" },
  week: { singular: "subscriptions.interval_week", singularFallback: "settimana", plural: "subscriptions.interval_week_plural", pluralFallback: "settimane" },
  month: { singular: "subscriptions.interval_month", singularFallback: "mese", plural: "subscriptions.interval_month_plural", pluralFallback: "mesi" },
  year: { singular: "subscriptions.interval_year", singularFallback: "anno", plural: "subscriptions.interval_year_plural", pluralFallback: "anni" },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "\u2014";
  try {
    return new Date(dateStr).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  } catch (e) { return dateStr; }
};

// ═══════════════════════════════════════
// ITEMS VIEWER MODAL (read-only + portal link)
// Seal API does not support item modification via API — user must use Seal's customer portal.
// ═══════════════════════════════════════
const ItemsManager = ({ open, onClose, sub }) => {
  const { t } = useTranslation();
  const items = sub?.items || [];
  const portalUrl = sub?.edit_url;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: ESPRESSO }}>{t("subscriptions.manage_subscription", "Gestisci abbonamento")}</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#7A6A5C", mb: 1 }}>{t("subscriptions.current_products", "Prodotti attuali")}</Typography>
        {items.length === 0 ? (
          <Typography sx={{ fontSize: "0.8rem", color: "#aaa", py: 1 }}>{t("subscriptions.no_products", "Nessun prodotto")}</Typography>
        ) : (
          <Stack spacing={1} sx={{ mb: 2 }}>
            {items.map((it, i) => (
              <Stack key={it.id || i} direction="row" alignItems="center" spacing={1} sx={{ p: 1.2, borderRadius: 2, border: `1px solid ${SABBIA}`, bgcolor: "#fff" }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: ESPRESSO }}>{it.title}</Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>{"\u20AC"}{Number(it.price).toFixed(2)} x {it.quantity}</Typography>
                </Box>
                <Chip label={`${"\u20AC"}${(Number(it.price) * it.quantity).toFixed(2)}`} size="small"
                  sx={{ bgcolor: alpha(ORO, 0.1), color: ORO, fontWeight: 700 }} />
              </Stack>
            ))}
          </Stack>
        )}

        <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(ORO, 0.06), border: `1px solid ${alpha(ORO, 0.2)}`, mt: 2 }}>
          <Stack direction="row" alignItems="flex-start" spacing={1.5}>
            <Iconify icon="mdi:information" width={22} sx={{ color: ORO, mt: 0.2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: ESPRESSO, mb: 0.5 }}>
                {t("subscriptions.how_to_modify_products", "Come modificare i prodotti")}
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: "#5A4A3C", mb: 1 }}>
                {t("subscriptions.portal_products_hint", "Dal portale cliente puoi aggiungere, rimuovere o modificare le quantita dei prodotti, l'indirizzo di spedizione e il metodo di pagamento.")}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#7A6A5C", mb: 1.5, fontStyle: "italic" }}>
                {t("subscriptions.portal_first_access_hint", "Al primo accesso Shopify potrebbe chiederti di confermare la tua email: riceverai un link via email per entrare. Dopo il primo login resterai sempre connesso automaticamente.")}
              </Typography>
              {portalUrl && (
                <Button variant="contained" size="small"
                  startIcon={<Iconify icon="mdi:open-in-new" />}
                  href={portalUrl} target="_blank" rel="noopener noreferrer"
                  sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
                  {t("subscriptions.open_customer_portal", "Apri portale clienti")}
                </Button>
              )}
            </Box>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#7A6A5C" }}>{t("subscriptions.close", "Chiudi")}</Button>
      </DialogActions>
    </Dialog>
  );
};

// ═══════════════════════════════════════
// SEAL SUBSCRIPTION CARD
// ═══════════════════════════════════════
const SealCard = ({ sub, onAction }) => {
  const { t } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [itemsOpen, setItemsOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const status = STATUS_MAP[sub.status] || STATUS_MAP.expired;
  const statusLabel = t(status.labelKey, status.labelFallback);
  const intervalDef = INTERVAL_KEYS[sub.interval];
  const intervalText = sub.interval_count > 1
    ? (intervalDef
        ? t("subscriptions.every_n_units", "ogni {{count}} {{unit}}", { count: sub.interval_count, unit: t(intervalDef.plural, intervalDef.pluralFallback) })
        : `ogni ${sub.interval_count} ${sub.interval}`)
    : (intervalDef
        ? t("subscriptions.every_unit", "ogni {{unit}}", { unit: t(intervalDef.singular, intervalDef.singularFallback) })
        : `ogni ${sub.interval}`);

  const loadHistory = async () => {
    if (history) { setShowHistory(!showHistory); return; }
    setHistoryLoading(true);
    try {
      const { data } = await axiosInstance.get(`api/wp/seal/subscription/${sub.id}/history`);
      setHistory(data?.data || []);
      setShowHistory(true);
    } catch (e) {
      enqueueSnackbar(t("subscriptions.history_load_error", "Errore nel caricamento storico"), { variant: "error" });
    }
    setHistoryLoading(false);
  };

  const handleAction = async (action, body = null) => {
    setActionLoading(true);
    try {
      await axiosInstance.put(`api/wp/seal/subscription/${sub.id}/${action}`, body);
      const actionLabels = {
        pause: t("subscriptions.action_paused", "messo in pausa"),
        resume: t("subscriptions.action_resumed", "ripreso"),
        cancel: t("subscriptions.action_cancelled", "cancellato"),
      };
      enqueueSnackbar(t("subscriptions.subscription_action_success", "Abbonamento {{action}}", { action: actionLabels[action] || action }), { variant: "success" });
      onAction();
    } catch (e) {
      enqueueSnackbar(e?.error || t("subscriptions.operation_error", "Errore nell'operazione"), { variant: "error" });
    }
    setActionLoading(false);
    setCancelOpen(false);
  };


  return (
    <Card sx={{ bgcolor: "#fff", border: `1px solid ${SABBIA}`, borderRadius: 3, overflow: "hidden", mb: 2 }}>
      <Box sx={{ p: 2.5 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, color: ESPRESSO }}>{sub.product_title}</Typography>
              <Chip label={statusLabel} size="small" sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: "0.7rem", height: 24 }} />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
              <Typography sx={{ fontSize: "0.78rem", color: "#7A6A5C" }}>
                <b style={{ color: ORO, fontSize: "1.1em" }}>{"\u20AC"}{Number(sub.price).toFixed(2)}</b> {intervalText}
              </Typography>
              {sub.next_billing_date && sub.status === "active" && (
                <Typography sx={{ fontSize: "0.78rem", color: "#7A6A5C" }}>
                  {t("subscriptions.next_renewal_colon", "Prossimo rinnovo:")} <b style={{ color: ESPRESSO }}>{formatDate(sub.next_billing_date)}</b>
                </Typography>
              )}
            </Stack>
            <Typography sx={{ fontSize: "0.65rem", color: "#aaa", mt: 0.3 }}>
              {t("subscriptions.active_from", "Attivo dal {{date}}", { date: formatDate(sub.created_at) })}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {sub.status === "active" && (
              <Button size="small" variant="contained" disabled={actionLoading}
                onClick={() => handleAction("pause")}
                sx={{ bgcolor: WARNING, "&:hover": { bgcolor: "#D98E1F" }, textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
                {t("subscriptions.pause", "Metti in pausa")}
              </Button>
            )}
            {sub.status === "paused" && (
              <Button size="small" variant="contained" disabled={actionLoading}
                onClick={() => handleAction("resume")}
                sx={{ bgcolor: MUSCHIO, "&:hover": { bgcolor: "#3A4C2A" }, textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
                {t("subscriptions.resume", "Riprendi")}
              </Button>
            )}
            {(sub.status === "active" || sub.status === "paused") && (
              <>
                <Button size="small" variant="outlined" disabled={actionLoading}
                  onClick={() => setItemsOpen(true)}
                  sx={{ borderColor: SABBIA, color: ESPRESSO, textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
                  {t("subscriptions.change_products_or_date", "Cambio prodotti / data")}
                </Button>
                <Button size="small" variant="outlined" disabled={actionLoading}
                  onClick={() => setCancelOpen(true)}
                  sx={{ borderColor: alpha(DANGER, 0.3), color: DANGER, textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
                  {t("subscriptions.cancel", "Cancella")}
                </Button>
              </>
            )}
            <IconButton size="small" onClick={loadHistory} sx={{ color: "#7A6A5C" }}>
              {historyLoading ? <CircularProgress size={18} /> : <Iconify icon="mdi:history" width={20} />}
            </IconButton>
          </Stack>
        </Stack>

      </Box>

      <Collapse in={showHistory}>
        <Divider />
        <Box sx={{ p: 2, bgcolor: AVORIO }}>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>{t("subscriptions.payment_history", "Storico pagamenti")}</Typography>
          {history && history.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C" }}>{t("subscriptions.col_date", "Data")}</TableCell>
                  <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C" }}>{t("subscriptions.col_amount", "Importo")}</TableCell>
                  <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C" }}>{t("subscriptions.col_status", "Stato")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.slice(0, 10).map((h, i) => {
                  const hs = h.status === "completed" ? { color: MUSCHIO, bg: alpha(MUSCHIO, 0.1), label: t("subscriptions.payment_completed", "Completato") }
                    : h.status === "failed" ? { color: DANGER, bg: alpha(DANGER, 0.1), label: t("subscriptions.payment_failed", "Fallito") }
                    : h.status === "info" ? { color: "#607D8B", bg: alpha("#607D8B", 0.1), label: t("subscriptions.payment_info", "Info") }
                    : { color: WARNING, bg: alpha(WARNING, 0.1), label: t("subscriptions.payment_scheduled", "Programmato") };
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
            <Typography sx={{ fontSize: "0.75rem", color: "#aaa" }}>{t("subscriptions.no_payments_registered", "Nessun pagamento registrato")}</Typography>
          )}
        </Box>
      </Collapse>

      <ItemsManager open={itemsOpen} onClose={() => setItemsOpen(false)} sub={sub} />

      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: ESPRESSO }}>{t("subscriptions.confirm_cancellation", "Conferma cancellazione")}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#7A6A5C" }}>
            <Trans
              i18nKey="subscriptions.confirm_cancellation_message"
              defaults="Sei sicuro di voler cancellare l'abbonamento per <b>{{product}}</b>? Perderai gli sconti del Percorso Fedeltà."
              values={{ product: sub.product_title }}
              components={{ b: <b /> }}
            />
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCancelOpen(false)} sx={{ textTransform: "none", color: "#7A6A5C" }}>{t("subscriptions.dialog_cancel", "Annulla")}</Button>
          <Button variant="contained" disabled={actionLoading}
            onClick={() => handleAction("cancel")}
            sx={{ bgcolor: DANGER, "&:hover": { bgcolor: "#C13B3A" }, textTransform: "none", fontWeight: 700 }}>
            {actionLoading ? <CircularProgress size={18} color="inherit" /> : t("subscriptions.cancel_subscription", "Cancella abbonamento")}
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
  const { t } = useTranslation();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("api/wp/seal/subscriptions");
      setSubs(data?.data || []);
    } catch (e) {
      // Silently fail — user may not have Seal subscriptions
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  if (loading) return <Box sx={{ textAlign: "center", py: 3 }}><CircularProgress sx={{ color: ORO }} size={28} /></Box>;
  if (!subs.length) {
    return (
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:refresh-circle" width={20} sx={{ color: ORO }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ESPRESSO }}>{t("subscriptions.smartship_label", "Smartship")}</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>{t("subscriptions.manage_your_subscriptions", "Gestisci i tuoi abbonamenti")}</Typography>
          </Box>
        </Stack>
        <Card sx={{ p: { xs: 4, md: 6 }, textAlign: "center", borderRadius: 3, border: `1px solid ${alpha(ORO, 0.25)}`, background: `linear-gradient(135deg, ${alpha(ORO, 0.04)} 0%, #fff 100%)` }}>
          <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
            <Iconify icon="mdi:refresh-circle" width={40} sx={{ color: ORO }} />
          </Box>
          <Typography variant="h6" sx={{ color: ESPRESSO, fontWeight: 700 }}>{t("subscriptions.no_active_subscriptions", "Non hai abbonamenti attivi")}</Typography>
          <Typography variant="body2" sx={{ color: "#7A6A5C", mt: 1, maxWidth: 520, mx: "auto" }}>
            <Trans
              i18nKey="subscriptions.activate_smartship_pitch"
              defaults="Attiva uno <s>smartship</s> e ottieni il <s>10% di sconto a vita</s> su tutti i prodotti, <s>un regalo che cresce con il tuo ordine ogni 3 mesi</s> e una sola spedizione mensile."
              components={{ s: <strong /> }}
            />
          </Typography>
          <Box sx={{ mt: 3 }}>
            <SmartshipActivateCard variant="inline" />
          </Box>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon="mdi:refresh-circle" width={20} sx={{ color: ORO }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ESPRESSO }}>{t("subscriptions.smartship_label", "Smartship")}</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>{t("subscriptions.manage_seal_subscriptions", "Gestisci i tuoi abbonamenti Seal")}</Typography>
        </Box>
      </Stack>
      {subs.map((sub) => <SealCard key={sub.id} sub={sub} onAction={fetchSubs} />)}

      <Card sx={{ p: 2, border: `1px solid ${SABBIA}`, borderRadius: 3, bgcolor: alpha(MUSCHIO, 0.03) }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Iconify icon="mdi:leaf" width={20} sx={{ color: MUSCHIO }} />
          <Typography sx={{ fontSize: "0.72rem", color: "#7A6A5C" }}>
            {t("subscriptions.keep_active_tip", "Mantieni il tuo abbonamento attivo per sbloccare -10% su ogni consegna e un regalo che cresce con il tuo ordine, ogni 3 mesi")}
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
  const { t } = useTranslation();
  const { user } = useAuth();
  const isPromoter = user?.is_promoter === 1;
  const { state: mySubState, fetchData: mySubFetch, ...mySubRest } = useMySubFetch();
  const { data: mySubData, ...mySubDataProps } = mySubState;

  return (
    <Page title={t("subscriptions.page_title", "I miei abbonamenti")}>
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
        {/* Hero */}
        <Card sx={{ bgcolor: "#FAF6EF", color: ESPRESSO, borderRadius: 4, p: 3, mb: 3, border: `1px solid ${alpha(ORO, 0.2)}` }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:refresh-circle" width={28} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color={ESPRESSO}>{t("subscriptions.page_title", "I miei abbonamenti")}</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#7A6A5C" }}>{t("subscriptions.hero_sub", "Percorso Fedeltà — gestisci i tuoi abbonamenti")}</Typography>
            </Box>
          </Stack>
        </Card>

        {/* Seal Subscriptions (Smartship) */}
        <SealSection />

        {/* Kit Distributore (My Subscriptions) — only for promoters */}
        {isPromoter && (<>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:badge-account-outline" width={20} sx={{ color: ORO }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ESPRESSO }}>{t("subscriptions.distributor_kit", "Kit Distributore")}</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>{t("subscriptions.promoter_subscription", "Il tuo abbonamento promoter")}</Typography>
          </Box>
        </Stack>
        <DataHandlerList dataProps={mySubDataProps}>
          <Map
            list={mySubData}
            render={(product) => {
              const name = product?.purchase_product?.name || "N/A";
              const status = (product?.active_status || "").toLowerCase();
              const st = status === "active" ? { label: t("subscriptions.status_active", "Attivo"), color: MUSCHIO, bg: alpha(MUSCHIO, 0.1) }
                : status === "expired" ? { label: t("subscriptions.status_expired", "Scaduto"), color: DANGER, bg: alpha(DANGER, 0.1) }
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
                          <Trans
                            i18nKey="subscriptions.active_from_bold"
                            defaults="Attivo dal <b>{{date}}</b>"
                            values={{ date: purchaseDate }}
                            components={{ b: <b style={{ color: ESPRESSO }} /> }}
                          />
                        </Typography>
                      )}
                      {expiryDate && (
                        <Typography sx={{ fontSize: "0.78rem", color: "#7A6A5C" }}>
                          <Trans
                            i18nKey="subscriptions.expires_on_bold"
                            defaults="Scade il <b>{{date}}</b>"
                            values={{ date: expiryDate }}
                            components={{ b: <b style={{ color: ESPRESSO }} /> }}
                          />
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
        </>)}

      </Box>
    </Page>
  );
};

export default RecurringOrder;
