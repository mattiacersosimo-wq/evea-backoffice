import { Box, Card, Stack, Tab, Tabs, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import LoadingScreen from "src/components/LoadingScreen";

const IncomeReport = lazy(() => import("../income-report/index"));
const TeamReport = lazy(() => import("./team"));
const CustomerReport = lazy(() => import("./customers"));
const RankHistoryReport = lazy(() => import("./rank-history"));
const VolumeReport = lazy(() => import("./volume"));
const PayoutHistoryReport = lazy(() => import("./payout-history"));

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

const TAB_KEYS = [
  { labelKey: "evea.report_income", icon: "mdi:cash-multiple", key: "income" },
  { labelKey: "evea.report_team", icon: "mdi:account-group", key: "team" },
  { labelKey: "evea.report_customers", icon: "mdi:account-heart", key: "customers" },
  { labelKey: "evea.report_rank", icon: "mdi:trophy-outline", key: "rank" },
  { labelKey: "evea.report_volume", icon: "mdi:chart-bar", key: "volume" },
  { labelKey: "evea.report_payout", icon: "mdi:bank-transfer-out", key: "payout" },
];

const Reports = () => {
  const { t } = useTranslation();
  const TABS = TAB_KEYS.map((tk) => ({ ...tk, label: t(tk.labelKey) }));
  const [params, setParams] = useSearchParams();
  const tabKey = params.get("tab") || "income";
  const tabIndex = TABS.findIndex((tb) => tb.key === tabKey);
  const [tab, setTab] = useState(tabIndex >= 0 ? tabIndex : 0);

  const handleTab = (_, v) => {
    setTab(v);
    setParams({ tab: TABS[v].key });
  };

  return (
    <Page title="Reports">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4, mx: { xs: -2, md: -3 }, mt: -2, pt: 2, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        {/* Hero */}
        <Card sx={{ bgcolor: "#FAF6EF", color: ESPRESSO, borderRadius: 4, p: 3, mb: 3, border: `1px solid ${alpha(ORO, 0.2)}` }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:chart-timeline-variant-shimmer" width={28} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color={ESPRESSO}>{t("evea.report")}</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#7A6A5C" }}>{t("evea.report_subtitle")}</Typography>
            </Box>
          </Stack>
        </Card>

        {/* Tabs */}
        <Tabs value={tab} onChange={handleTab} variant="scrollable" scrollButtons="auto"
          sx={{
            mb: 2, bgcolor: "#fff", borderRadius: 2, border: "1px solid #f0ece6", px: 1,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.82rem", minHeight: 48, py: 1 },
            "& .Mui-selected": { color: ORO },
            "& .MuiTabs-indicator": { bgcolor: ORO, height: 3, borderRadius: 2 },
          }}>
          {TABS.map((t) => (
            <Tab key={t.key} label={
              <Stack direction="row" alignItems="center" spacing={0.8}>
                <Iconify icon={t.icon} width={18} />
                <span>{t.label}</span>
              </Stack>
            } />
          ))}
        </Tabs>

        {/* Content */}
        <Suspense fallback={<LoadingScreen />}>
          {tab === 0 && <IncomeReport />}
          {tab === 1 && <TeamReport />}
          {tab === 2 && <CustomerReport />}
          {tab === 3 && <RankHistoryReport />}
          {tab === 4 && <VolumeReport />}
          {tab === 5 && <PayoutHistoryReport />}
        </Suspense>
      </Box>
    </Page>
  );
};

export default Reports;
