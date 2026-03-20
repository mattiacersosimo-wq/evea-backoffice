import {
  Avatar,
  Box,
  Card,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "src/components/Page";
import Iconify from "src/components/Iconify";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";
import fetchUser from "src/utils/fetchUser";
import Timer from "./rankSummary/timer";

// existing widget components — unchanged
import RankProgressBar from "./components/widgets/rankProgressBar/rankProgressBar";
import GoMVPBonus from "./components/widgets/goMPVBonus";
import RockSolidMVPBonus from "./components/widgets/RockSolidMVPBonus";
import DirectSalesBonus from "./components/widgets/DirectSalesBonus";
import ThreeFFBonusNew from "./components/widgets/ThreeFFBonusNew";
import RecurringOrderBonus from "./components/widgets/recurringOrderBonus";
import MVPMentorBonus from "./components/widgets/MPVMentorBonus";
import IndirectSalesBonus from "./components/widgets/IndirectSalesBonus";
import EvolvingBonus from "./components/widgets/evolvingBonus";
import ResidualBonus from "./components/widgets/ResidualBonus";
import LeadershipBonus from "./components/widgets/LeadershipBonus";
import ResidualBonusMatching from "./components/widgets/ResidualBonusMatching";
import RockSolidBonus from "./components/widgets/RockSolidBonus";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const WARM = "#6B5E54";

// ══════════════════════════════════════
// HERO — Rank + Timer
// ══════════════════════════════════════
const HeroSection = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [rankSummary, setRankSummary] = useState(null);
  const [pkgPeriod, setPkgPeriod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const [rankRes, pkgRes] = await Promise.allSettled([
          axiosInstance.get("api/user/affiliate-dashboard/rank-summery"),
          axiosInstance.get("api/user/affiliate-dashboard/dsb-current-package-period"),
        ]);
        if (!off) {
          if (rankRes.status === "fulfilled") setRankSummary(rankRes.value?.data?.data || null);
          if (pkgRes.status === "fulfilled") setPkgPeriod(pkgRes.value?.data?.data || null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => { off = true; };
  }, []);

  const profile = user?.user_profile || {};
  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    user?.username || "";

  const showPkgTimer = pkgPeriod && pkgPeriod.qualification_days !== 0;

  return (
    <Card
      sx={{
        bgcolor: "#FAF6EF",
        color: ESPRESSO,
        borderRadius: 4,
        p: { xs: 3, md: 4 },
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${alpha(ORO, 0.2)}`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: -30, right: -30,
          width: 120, height: 120,
          borderRadius: "50%",
          bgcolor: alpha(ORO, 0.06),
        }}
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "center", md: "flex-start" }}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Avatar
          src={profile.profile_image}
          sx={{
            width: 72, height: 72,
            border: `3px solid ${alpha(ORO, 0.3)}`,
            bgcolor: alpha(ORO, 0.1),
            color: ORO, fontSize: 28, fontWeight: 700,
          }}
        >
          {fullName.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1, width: "100%" }}>
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
            <Typography variant="h5" fontWeight={700} color={ESPRESSO}>
              {fullName}
            </Typography>
            {rankSummary?.current_rank && (
              <Chip
                label={rankSummary.current_rank}
                size="small"
                sx={{
                  bgcolor: alpha(ORO, 0.12),
                  color: ORO,
                  fontWeight: 700, fontSize: "0.72rem",
                  height: 26, borderRadius: "13px",
                  border: `1px solid ${alpha(ORO, 0.3)}`,
                }}
              />
            )}
          </Stack>

          {loading ? (
            <Skeleton height={70} sx={{ mt: 2, bgcolor: alpha(ORO, 0.06), borderRadius: 2 }} />
          ) : rankSummary ? (
            <Stack direction="row" spacing={1.5} sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}>
              {rankSummary.month_end && (
                <Box sx={{ bgcolor: alpha(ORO, 0.05), borderRadius: 2, px: 1.5, py: 1, textAlign: "center", border: `1px solid ${alpha(ORO, 0.25)}`, minWidth: 100, flex: "1 1 0" }}>
                  <Iconify icon="mdi:clock-outline" width={18} sx={{ color: ORO, mb: 0.3 }} />
                  <Typography sx={{ fontSize: "0.6rem", color: "#7A6A5C", mb: 0.2 }}>
                    {t("affiliate_dashboard.current_period_ends_in")}
                  </Typography>
                  <Timer expiryDate={rankSummary.month_end} />
                </Box>
              )}
              {rankSummary.current_rank && (
                <Box sx={{ bgcolor: alpha(ORO, 0.05), borderRadius: 2, px: 1.5, py: 1, textAlign: "center", border: `1px solid ${alpha(ORO, 0.25)}`, minWidth: 90, flex: "1 1 0" }}>
                  <Iconify icon="mdi:shield-star" width={18} sx={{ color: ORO, mb: 0.3 }} />
                  <Typography sx={{ fontSize: "0.6rem", color: "#7A6A5C", mb: 0.2 }}>
                    {t("affiliate_dashboard.current_rank")}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: ESPRESSO }}>{rankSummary.current_rank}</Typography>
                </Box>
              )}
              {rankSummary.paid_rank && (
                <Box sx={{ bgcolor: alpha(ORO, 0.05), borderRadius: 2, px: 1.5, py: 1, textAlign: "center", border: `1px solid ${alpha(ORO, 0.25)}`, minWidth: 90, flex: "1 1 0" }}>
                  <Iconify icon="mdi:medal-outline" width={18} sx={{ color: ORO, mb: 0.3 }} />
                  <Typography sx={{ fontSize: "0.6rem", color: "#7A6A5C", mb: 0.2 }}>
                    {t("affiliate_dashboard.recognition_rank")}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: ESPRESSO }}>{rankSummary.paid_rank}</Typography>
                </Box>
              )}
              {rankSummary.achieved_rank && (
                <Box sx={{ bgcolor: alpha(ORO, 0.05), borderRadius: 2, px: 1.5, py: 1, textAlign: "center", border: `1px solid ${alpha(ORO, 0.25)}`, minWidth: 90, flex: "1 1 0" }}>
                  <Iconify icon="mdi:trophy-outline" width={18} sx={{ color: ORO, mb: 0.3 }} />
                  <Typography sx={{ fontSize: "0.6rem", color: "#7A6A5C", mb: 0.2 }}>
                    {t("affiliate_dashboard.achieved_rank")}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: ESPRESSO }}>{rankSummary.achieved_rank}</Typography>
                </Box>
              )}
              {showPkgTimer && pkgPeriod.period_end && (
                <Box sx={{ bgcolor: alpha(ORO, 0.05), borderRadius: 2, px: 1.5, py: 1, textAlign: "center", border: `1px solid ${alpha(ORO, 0.25)}`, minWidth: 100, flex: "1 1 0" }}>
                  <Iconify icon="mdi:timer-sand" width={18} sx={{ color: ORO, mb: 0.3 }} />
                  <Typography sx={{ fontSize: "0.6rem", color: "#7A6A5C", mb: 0.2 }}>
                    {t("affiliate_dashboard.dsp_ends_in")}
                  </Typography>
                  <Timer expiryDate={pkgPeriod.period_end} />
                </Box>
              )}
            </Stack>
          ) : null}
        </Box>
      </Stack>
    </Card>
  );
};

// ══════════════════════════════════════
// BONUS SUMMARY — quick overview cards
// ══════════════════════════════════════
const BONUS_CONFIG = [
  { key: "gomvp", url: "affiliate-dashboard/gomvp-Progressbar", label: "Go MVP", icon: "mdi:rocket-launch-outline", color: "#4CAF50", pendingField: "pending_bonus_amount", freq: "weekly" },
  { key: "rsp", url: "affiliate-dashboard/rsp-Progressbar", label: "Rock Solid MVP", icon: "mdi:shield-star-outline", color: "#2196F3", pendingField: "pending_bonus_amount", prevField: "previous_month_pending_commission_additional", freq: "weekly" },
  { key: "dsb", url: "affiliate-dashboard/dsb-Progressbar", label: "Direct Sales", icon: "mdi:account-cash-outline", color: "#FF9800", pendingField: "pending_amount", nestedKey: "direct_sales_bonus", freq: "weekly" },
  { key: "pmb", url: "affiliate-dashboard/pmb-Progressbar", label: "MVP Mentor", icon: "mdi:account-group-outline", color: "#9C27B0", pendingField: "pending_bonus_amount", freq: "weekly" },
  { key: "isb", url: "affiliate-dashboard/isb-Progressbar", label: "Indirect Sales", icon: "mdi:sitemap-outline", color: "#00BCD4", pendingField: "pending_commission", freq: "weekly" },
  { key: "rob", url: "affiliate-dashboard/rob-Progressbar", label: "Recurring Order", icon: "mdi:refresh-circle", color: "#8BC34A", pendingField: "pending_bonus_amount", freq: "monthly" },
  { key: "threeff", url: "affiliate-dashboard/threeff-Progressbar", label: "3 For Free", icon: "mdi:gift-outline", color: "#E91E63", pendingField: "current_bonus_amount", freq: "monthly" },
  { key: "residual", url: "affiliate-dashboard/residual-Progressbar", label: "Residual", icon: "mdi:chart-timeline-variant", color: "#607D8B", pendingField: "pending_commission_total", freq: "monthly" },
  { key: "leadership", url: "affiliate-dashboard/leadership-Progressbar", label: "Leadership", icon: "mdi:crown-outline", color: ORO, pendingField: "pending_bonus_amount", freq: "monthly" },
  { key: "residualmatching", url: "affiliate-dashboard/residualmatching-Progressbar", label: "Residual Matching", icon: "mdi:swap-horizontal", color: "#795548", pendingField: "pending_bonus_amount", freq: "monthly" },
  { key: "rgomvp", url: "affiliate-dashboard/rgomvp-Progressbar", label: "Rock Solid Bonus", icon: "mdi:diamond-stone", color: "#455A64", pendingField: "pending_bonus_amount", freq: "monthly" },
  { key: "evolving", url: "affiliate-dashboard/eveolving-Progressbar", label: "Evolving Bonus", icon: "mdi:trending-up", color: "#FF5722", pendingField: "pending_bonus_amount", freq: "monthly" },
];

const BonusSummaryGrid = () => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let off = false;
    (async () => {
      const results = await Promise.allSettled(
        BONUS_CONFIG.map(async (cfg) => {
          try {
            const { data } = await fetchUser(cfg.url);
            const d = Array.isArray(data?.data) ? data.data[0] : data?.data;
            const src = cfg.nestedKey ? d?.[cfg.nestedKey] : d;
            return {
              ...cfg,
              pending: src?.[cfg.pendingField] ?? 0,
              prevMonth: d?.[cfg.prevField] ?? src?.previous_month_pending_commission ?? d?.previous_month_pending_commission ?? 0,
              expired: d?.is_expired ?? false,
            };
          } catch {
            return { ...cfg, pending: 0, prevMonth: 0, expired: false };
          }
        })
      );
      if (!off) {
        setBonuses(results.map((r) => r.status === "fulfilled" ? r.value : { ...BONUS_CONFIG[0], pending: 0 }));
        setLoading(false);
      }
    })();
    return () => { off = true; };
  }, []);

  if (loading) {
    return (
      <Grid container spacing={2}>
        {[0, 1, 2, 3].map((i) => (
          <Grid item xs={6} md={3} key={i}>
            <Skeleton variant="rounded" height={100} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  const weeklyBonuses = bonuses.filter((b) => b.freq === "weekly");
  const monthlyBonuses = bonuses.filter((b) => b.freq === "monthly");
  const weeklyTotal = weeklyBonuses.reduce((s, b) => s + Number(b.pending || 0), 0);
  const monthlyTotal = monthlyBonuses.reduce((s, b) => s + Number(b.pending || 0), 0);

  const BonusCard = ({ b }) => (
    <Card
      sx={{
        p: 2, borderRadius: 3, bgcolor: "#fff",
        border: "1px solid #f0ece6",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        height: "100%", position: "relative", overflow: "hidden",
      }}
    >
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, bgcolor: b.color }} />
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Box
          sx={{
            width: 32, height: 32, borderRadius: 1.5,
            bgcolor: alpha(b.color, 0.1),
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Iconify icon={b.icon} width={18} sx={{ color: b.color }} />
        </Box>
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: ESPRESSO, lineHeight: 1.2 }}>
          {b.label}
        </Typography>
        {b.expired && (
          <Chip label="Expired" size="small" color="error" sx={{ height: 18, fontSize: "0.6rem", ml: "auto" }} />
        )}
      </Stack>
      <Typography variant="h5" fontWeight={700} sx={{ color: Number(b.pending) > 0 ? b.color : "#ccc" }}>
        €{Number(b.pending || 0).toFixed(2)}
      </Typography>
      <Typography sx={{ fontSize: "0.65rem", color: WARM }}>Pending</Typography>
      {Number(b.prevMonth) > 0 && (
        <Typography sx={{ fontSize: "0.6rem", color: "#aaa", mt: 0.3 }}>
          Mese prec.: €{Number(b.prevMonth).toFixed(2)}
        </Typography>
      )}
    </Card>
  );

  const TotalHeader = ({ icon, label, total, color }) => (
    <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: alpha(color, 0.05), border: `1px solid ${alpha(color, 0.15)}` }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(color, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon={icon} width={20} sx={{ color }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#7A6A5C", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {label}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: total > 0 ? color : "#ccc", lineHeight: 1 }}>
          €{total.toFixed(2)}
        </Typography>
      </Stack>
    </Box>
  );

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={0}>
      {/* ── SETTIMANALI ── */}
      <Box sx={{ flex: 1 }}>
        <TotalHeader icon="mdi:calendar-week" label="Pending Settimanali" total={weeklyTotal} color="#4CAF50" />
        <Grid container spacing={1.5}>
          {weeklyBonuses.map((b) => (
            <Grid item xs={6} key={b.key}>
              <BonusCard b={b} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── DIVIDER ── */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: "1px", mx: 2.5, alignSelf: "stretch",
          bgcolor: alpha(ORO, 0.2),
        }}
      />
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          height: "1px", my: 3,
          bgcolor: alpha(ORO, 0.2),
        }}
      />

      {/* ── MENSILI ── */}
      <Box sx={{ flex: 1 }}>
        <TotalHeader icon="mdi:calendar-month" label="Pending Mensili" total={monthlyTotal} color={ORO} />
        <Grid container spacing={1.5}>
          {monthlyBonuses.map((b) => (
            <Grid item xs={6} key={b.key}>
              <BonusCard b={b} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
};

// ══════════════════════════════════════
// SECTION TITLE — just a label, no wrapper
// ══════════════════════════════════════
const SectionTitle = ({ icon, children }) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1, mb: 0.5 }}>
    <Box
      sx={{
        width: 32, height: 32, borderRadius: 1.5,
        bgcolor: alpha(ORO, 0.1),
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <Iconify icon={icon} width={18} sx={{ color: ORO }} />
    </Box>
    <Typography variant="subtitle1" fontWeight={700} color={ESPRESSO}>
      {children}
    </Typography>
  </Stack>
);

// ══════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════
const AffiliateDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isPromoter = user?.is_promoter === 1;

  return (
    <Page title={t("global.affiliate_dashboard")}>
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
        <Stack spacing={2}>

          {/* HERO */}
          {isPromoter && <HeroSection />}

          {/* PANORAMICA BONUS */}
          {isPromoter && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Iconify icon="mdi:chart-box-outline" width={22} sx={{ color: ORO }} />
                <Typography variant="h6" fontWeight={700} color={ESPRESSO}>
                  Panoramica Bonus
                </Typography>
              </Stack>
              <BonusSummaryGrid />
            </Box>
          )}

          {/* ALL BONUS WIDGETS — 2 per row */}
          <Grid container spacing={1.5}>
            {isPromoter && (
              <Grid item xs={12} md={6}><RankProgressBar /></Grid>
            )}
            {isPromoter && (
              <Grid item xs={12} md={6}><GoMVPBonus /></Grid>
            )}
            {isPromoter && (
              <Grid item xs={12} md={6}><RockSolidMVPBonus /></Grid>
            )}
            {isPromoter && (
              <Grid item xs={12} md={6}><DirectSalesBonus /></Grid>
            )}
            <Grid item xs={12} md={6}><RecurringOrderBonus /></Grid>
            <Grid item xs={12} md={6}><ThreeFFBonusNew /></Grid>
            {isPromoter && (
              <Grid item xs={12} md={6}><MVPMentorBonus /></Grid>
            )}
            {isPromoter && (
              <Grid item xs={12} md={6}><IndirectSalesBonus /></Grid>
            )}
            {isPromoter && (
              <Grid item xs={12} md={6}><EvolvingBonus /></Grid>
            )}
            {isPromoter && (
              <Grid item xs={12} md={6}><ResidualBonus /></Grid>
            )}
            {isPromoter && (
              <Grid item xs={12} md={6}><LeadershipBonus /></Grid>
            )}
            {isPromoter && (
              <Grid item xs={12} md={6}><ResidualBonusMatching /></Grid>
            )}
            {isPromoter && (
              <Grid item xs={12} md={6}><RockSolidBonus /></Grid>
            )}
          </Grid>
        </Stack>
      </Box>
    </Page>
  );
};

export default AffiliateDashboard;
