import { Alert, Box, Button, Card, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";
import fetchUser from "src/utils/fetchUser";
import { useSnackbar } from "notistack";

// Existing components — reused directly
import EwalletPage from "../ewallet/index";
import PendingCommissionsPage from "../pendingCommissions/index";
import RequestPayoutPage from "../requestPayout/index";
import AutofatturePage from "../autofatture/index";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const SUCCESS = "#4A5C3A";
const MUTED = "#7A6A5C";

const KycGate = ({ children }) => {
  const [kyc, setKyc] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("api/wp/compliance/kyc-status");
        setKyc(data?.data);
      } catch { setKyc({ can_withdraw: true, checks: {} }); }
    })();
  }, []);

  if (!kyc) return <Box sx={{ p: 3, textAlign: "center" }}><Typography color="#aaa">Verifica KYC...</Typography></Box>;
  if (kyc.can_withdraw) return children;

  const labels = {
    has_name: "Nome e Cognome",
    has_codice_fiscale: "Codice Fiscale",
    has_address: "Indirizzo completo",
    has_bank: "Dati bancari (IBAN)",
    has_document: "Documento di identità",
  };

  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
        Per prelevare devi completare la verifica del profilo. Compila i dati mancanti nel tuo profilo.
      </Alert>
      <Card sx={{ p: 2.5, borderRadius: 2, border: "1px solid #f0ece6" }}>
        <Typography sx={{ fontWeight: 700, color: ESPRESSO, mb: 1.5 }}>Stato verifica ({kyc.complete_pct}%)</Typography>
        <LinearProgress variant="determinate" value={kyc.complete_pct} sx={{ height: 6, borderRadius: 3, mb: 2, bgcolor: "#eee", "& .MuiLinearProgress-bar": { bgcolor: kyc.complete_pct >= 60 ? ORO : "#E24B4A" } }} />
        {Object.entries(kyc.checks).map(([k, v]) => (
          <Stack key={k} direction="row" alignItems="center" spacing={1} sx={{ py: 0.5 }}>
            <Iconify icon={v ? "mdi:check-circle" : "mdi:close-circle"} width={18} sx={{ color: v ? "#4CAF50" : "#E24B4A" }} />
            <Typography sx={{ fontSize: "0.8rem", color: v ? "#4CAF50" : ESPRESSO, fontWeight: v ? 400 : 600 }}>{labels[k] || k}</Typography>
          </Stack>
        ))}
      </Card>
    </Box>
  );
};

const GiftCardTab = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const balRes = await fetchUser.get("payout-request");
      setBalance(balRes.data?.data?.available_balance ?? null);
    } catch { /* silent */ }
    try {
      const histRes = await fetchUser.get("gift-cards");
      const items = histRes.data?.data?.data || histRes.data?.data || [];
      setHistory(Array.isArray(items) ? items : []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleConvert = async () => {
    setConfirmOpen(false);
    setLoading(true);
    setResult(null);
    try {
      const { data } = await fetchUser.post("gift-card", { amount: parseFloat(amount) });
      if (data.status) {
        setResult(data.data);
        enqueueSnackbar("Gift card creata!", { variant: "success" });
        setAmount("");
        fetchData();
      } else {
        enqueueSnackbar(data.message || "Errore", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Errore nella creazione", { variant: "error" });
    }
    setLoading(false);
  };

  const presets = [50, 100, 200, 500];

  return (
    <Box>
      <Card sx={{ p: 3, borderRadius: 3, border: "1px solid #f0ece6", mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:gift-outline" width={24} sx={{ color: ORO }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: ESPRESSO }}>Converti in Gift Card</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>Usa il tuo saldo per acquistare prodotti su myevea.com</Typography>
          </Box>
        </Stack>

        {balance !== null && (
          <Box sx={{ p: 1.5, bgcolor: alpha(ORO, 0.05), borderRadius: 2, mb: 2, border: `1px solid ${alpha(ORO, 0.12)}` }}>
            <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Saldo disponibile</Typography>
            <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: ESPRESSO }}>€{Number(balance).toLocaleString("it", { minimumFractionDigits: 2 })}</Typography>
          </Box>
        )}

        <Typography sx={{ fontSize: "0.75rem", color: MUTED, mb: 1 }}>Importo da convertire</Typography>
        <Stack direction="row" spacing={1} mb={1.5} flexWrap="wrap">
          {presets.map((p) => (
            <Chip key={p} label={`€${p}`} onClick={() => setAmount(String(p))}
              sx={{ fontWeight: 700, fontSize: "0.8rem", bgcolor: String(p) === amount ? ORO : alpha(ORO, 0.08), color: String(p) === amount ? "#fff" : ESPRESSO, cursor: "pointer", "&:hover": { bgcolor: alpha(ORO, 0.2) } }} />
          ))}
        </Stack>
        <TextField fullWidth size="small" type="number" placeholder="Oppure inserisci importo..."
          value={amount} onChange={(e) => setAmount(e.target.value)}
          InputProps={{ startAdornment: <Typography sx={{ mr: 0.5, color: MUTED, fontWeight: 600 }}>€</Typography> }}
          sx={{ mb: 2, "& input": { fontSize: "1rem", fontWeight: 700 } }} />

        <Button fullWidth variant="contained" size="large" disabled={loading || !amount || parseFloat(amount) < 10}
          onClick={() => setConfirmOpen(true)}
          sx={{ bgcolor: ORO, color: "#fff", fontWeight: 700, fontSize: "0.9rem", borderRadius: 2, py: 1.2, textTransform: "none", "&:hover": { bgcolor: "#9A7B2F" }, "&.Mui-disabled": { bgcolor: "#ddd" } }}>
          {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : `Genera Gift Card · €${amount || "0"}`}
        </Button>

        {parseFloat(amount) > 0 && parseFloat(amount) < 10 && (
          <Typography sx={{ fontSize: "0.7rem", color: "#E24B4A", mt: 0.5 }}>Importo minimo: €10</Typography>
        )}
      </Card>

      {/* Result */}
      {result && (
        <Card sx={{ p: 3, borderRadius: 3, border: `2px solid ${SUCCESS}`, bgcolor: alpha(SUCCESS, 0.03), mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
            <Iconify icon="mdi:check-circle" width={24} sx={{ color: SUCCESS }} />
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: SUCCESS }}>Gift Card creata!</Typography>
          </Stack>
          <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, border: "1px solid #eee", textAlign: "center", mb: 1.5 }}>
            <Typography sx={{ fontSize: "0.7rem", color: MUTED, mb: 0.5 }}>Il tuo codice gift card</Typography>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: ESPRESSO, letterSpacing: 2, fontFamily: "monospace" }}>{result.code}</Typography>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ORO, mt: 0.5 }}>Valore: €{Number(result.initial_value).toLocaleString("it", { minimumFractionDigits: 2 })}</Typography>
          </Box>
          <Typography sx={{ fontSize: "0.72rem", color: MUTED, textAlign: "center" }}>
            Usa questo codice al checkout su myevea.com nella sezione "Gift Card / Codice sconto"
          </Typography>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card sx={{ p: 3, borderRadius: 3, border: "1px solid #f0ece6" }}>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 1.5 }}>Storico Gift Card</Typography>
          <Stack spacing={0.8}>
            {history.map((h) => {
              const isCancelled = h.payment_status === "cancelled" || (h.note || "").includes("CANCELLATA");
              const canCancel = h.is_cancellable === true;
              const currentBalance = typeof h.current_balance === "number" ? h.current_balance : null;
              const initial = Number(h.total_amount);
              const partial = currentBalance !== null && currentBalance < initial;
              const handleCancel = async () => {
                const refundText = currentBalance !== null
                  ? `Verranno rimborsati €${currentBalance.toFixed(2)}${partial ? ` (di €${initial.toFixed(2)} iniziali; il resto era gia stato usato)` : ""}.`
                  : `Il saldo verra' ripristinato nel wallet.`;
                if (!window.confirm(`Cancellare questa gift card? ${refundText}`)) return;
                try {
                  const { data } = await fetchUser.post(`gift-card/cancel/${h.id}`);
                  if (data.status) {
                    enqueueSnackbar(data.message || "Gift card cancellata", { variant: "success" });
                    fetchData();
                  } else {
                    enqueueSnackbar(data.message || "Errore", { variant: "error" });
                  }
                } catch (err) {
                  enqueueSnackbar(err?.response?.data?.message || "Errore nella cancellazione", { variant: "error" });
                }
              };
              return (
                <Stack key={h.id} direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 0.8, borderBottom: "1px solid #f5f0ea" }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: isCancelled ? MUTED : ESPRESSO, textDecoration: isCancelled ? "line-through" : "none" }}>{h.note}</Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>
                      {new Date(h.created_at).toLocaleDateString("it", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </Typography>
                  </Box>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Box sx={{ textAlign: "right", mr: 0.5 }}>
                      {!isCancelled && currentBalance !== null ? (
                        <>
                          <Typography sx={{ fontSize: "0.9rem", fontWeight: 800, color: currentBalance > 0 ? SUCCESS : "#E24B4A", lineHeight: 1.1 }}>
                            €{currentBalance.toFixed(2)}
                          </Typography>
                          <Typography sx={{ fontSize: "0.62rem", color: MUTED, lineHeight: 1.1 }}>
                            su €{initial.toLocaleString("it", { minimumFractionDigits: 2 })}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: isCancelled ? MUTED : ORO, textDecoration: isCancelled ? "line-through" : "none" }}>
                          €{initial.toLocaleString("it", { minimumFractionDigits: 2 })}
                        </Typography>
                      )}
                    </Box>
                    {!isCancelled && canCancel && (
                      <IconButton size="small" onClick={handleCancel} title={partial ? `Cancella e rimborsa €${currentBalance.toFixed(2)} rimanenti` : "Cancella gift card e ripristina saldo"}
                        sx={{ color: "#E24B4A", "&:hover": { bgcolor: alpha("#E24B4A", 0.1) } }}>
                        <Iconify icon="mdi:close" width={16} />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Card>
      )}

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: ESPRESSO }}>Conferma conversione</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO }}>
            Stai per convertire <b>€{parseFloat(amount || 0).toLocaleString("it", { minimumFractionDigits: 2 })}</b> dal tuo wallet in una Gift Card Shopify.
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: MUTED, mt: 1 }}>
            Il codice gift card potra' essere utilizzato per acquistare prodotti su myevea.com. Questa operazione non e' reversibile.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: MUTED, textTransform: "none" }}>Annulla</Button>
          <Button onClick={handleConvert} variant="contained" sx={{ bgcolor: ORO, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#9A7B2F" } }}>Conferma</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const TABS = [
  { label: "Movimenti", icon: "mdi:swap-horizontal", value: 0 },
  { label: "In Arrivo", icon: "mdi:clock-outline", value: 1 },
  { label: "Preleva", icon: "mdi:cash-fast", value: 2 },
  { label: "Note di Compenso", icon: "mdi:file-document-outline", value: 3 },
  { label: "Gift Card", icon: "mdi:gift-outline", value: 4 },
];

const WalletPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Page title="Il mio Wallet">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
        {/* Hero */}
        <Card sx={{ bgcolor: "#FAF6EF", color: ESPRESSO, borderRadius: 4, p: 3, mb: 3, border: `1px solid ${alpha(ORO, 0.2)}` }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:wallet-outline" width={28} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color={ESPRESSO}>Il mio Wallet</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#7A6A5C" }}>Gestisci i tuoi guadagni, commissioni e prelievi</Typography>
            </Box>
          </Stack>
        </Card>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              textTransform: "none", fontWeight: 600, fontSize: "0.85rem",
              minHeight: 44, py: 1, minWidth: "auto", px: 1.5,
            },
            "& .Mui-selected": { color: ORO },
            "& .MuiTabs-indicator": { bgcolor: ORO, height: 3, borderRadius: 2 },
            "& .MuiTabs-scrollButtons.Mui-disabled": { opacity: 0.3 },
          }}
        >
          {TABS.map((t) => (
            <Tab
              key={t.value}
              label={
                <Stack direction="row" alignItems="center" spacing={0.8}>
                  <Iconify icon={t.icon} width={18} />
                  <span>{t.label}</span>
                </Stack>
              }
            />
          ))}
        </Tabs>

        {/* Tab content — render existing pages as-is */}
        <Box sx={{ display: tab === 0 ? "block" : "none" }}>
          <EwalletPage />
        </Box>
        <Box sx={{ display: tab === 1 ? "block" : "none" }}>
          <PendingCommissionsPage />
        </Box>
        <Box sx={{ display: tab === 2 ? "block" : "none" }}>
          <KycGate><RequestPayoutPage /></KycGate>
        </Box>
        <Box sx={{ display: tab === 3 ? "block" : "none" }}>
          <AutofatturePage />
        </Box>
        <Box sx={{ display: tab === 4 ? "block" : "none" }}>
          <GiftCardTab />
        </Box>
      </Box>
    </Page>
  );
};

export default WalletPage;
