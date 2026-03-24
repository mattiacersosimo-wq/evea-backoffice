import { Alert, Box, Card, LinearProgress, Stack, Tab, Tabs, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

// Existing components — reused directly
import EwalletPage from "../ewallet/index";
import PendingCommissionsPage from "../pendingCommissions/index";
import RequestPayoutPage from "../requestPayout/index";
import AutofatturePage from "../autofatture/index";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

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

const TABS = [
  { label: "Movimenti", icon: "mdi:swap-horizontal", value: 0 },
  { label: "In Arrivo", icon: "mdi:clock-outline", value: 1 },
  { label: "Preleva", icon: "mdi:cash-fast", value: 2 },
  { label: "Autofatture", icon: "mdi:file-document-outline", value: 3 },
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
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              textTransform: "none", fontWeight: 600, fontSize: "0.85rem",
              minHeight: 44, py: 1,
            },
            "& .Mui-selected": { color: ORO },
            "& .MuiTabs-indicator": { bgcolor: ORO, height: 3, borderRadius: 2 },
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
      </Box>
    </Page>
  );
};

export default WalletPage;
