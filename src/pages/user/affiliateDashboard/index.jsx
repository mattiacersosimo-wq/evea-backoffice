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
import FastStartBonus from "./components/widgets/FastStartBonus";
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
  const { t, i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const L = {
    currentRank: isIt ? "Rank Attuale" : "Current Rank",
    recognitionRank: isIt ? "Rank Riconosciuto" : "Recognition Rank",
    achievedRank: isIt ? "Rank Raggiunto" : "Achieved Rank",
  };
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
        background: `linear-gradient(135deg, #FAF6EF 0%, #F5EEDE 60%, #F0E7CF 100%)`,
        color: ESPRESSO,
        borderRadius: 3,
        p: { xs: 3, md: 4 },
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${alpha(ORO, 0.25)}`,
        boxShadow: `0 2px 16px ${alpha(ORO, 0.08)}`,
      }}
    >
      {/* Decorative orbs */}
      <Box sx={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ORO, 0.12)} 0%, transparent 70%)` }} />
      <Box sx={{ position: "absolute", top: -60, left: "30%", width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ORO, 0.08)} 0%, transparent 70%)`, pointerEvents: "none" }} />

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "center", md: "flex-start" }}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Avatar
          src={profile.profile_image}
          sx={{
            width: 80, height: 80,
            border: `3px solid ${alpha(ORO, 0.4)}`,
            boxShadow: `0 0 0 6px ${alpha(ORO, 0.08)}, 0 4px 12px ${alpha(ORO, 0.2)}`,
            bgcolor: "#fff",
            color: ORO, fontSize: 30, fontWeight: 800,
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
            <Box
              sx={{
                mt: 1.5,
                display: "grid",
                gap: 1,
                // Mobile: 2 timer in riga 1, 3 rank in riga 2
                // Desktop: tutto su una riga (max 5 colonne)
                gridTemplateColumns: {
                  xs: "repeat(6, 1fr)",
                  md: "repeat(10, 1fr)",
                },
              }}
            >
              {rankSummary.month_end && (
                <Box sx={{ gridColumn: { xs: showPkgTimer ? "span 3" : "span 6", md: "span 2" }, bgcolor: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)", borderRadius: 2, px: 1, py: 1.2, textAlign: "center", border: `1px solid ${alpha(ORO, 0.2)}`, minWidth: 0, transition: "transform .2s ease, box-shadow .2s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: `0 4px 12px ${alpha(ORO, 0.15)}`, borderColor: alpha(ORO, 0.4) } }}>
                  <Iconify icon="mdi:clock-outline" width={18} sx={{ color: ORO, mb: 0.3 }} />
                  <Typography sx={{ fontSize: "0.6rem", color: "#7A6A5C", mb: 0.2, lineHeight: 1.1 }}>
                    {t("affiliate_dashboard.current_period_ends_in")}
                  </Typography>
                  <Timer expiryDate={rankSummary.month_end} />
                </Box>
              )}
              {showPkgTimer && pkgPeriod.period_end && (
                <Box sx={{ gridColumn: { xs: "span 3", md: "span 2" }, bgcolor: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)", borderRadius: 2, px: 1, py: 1.2, textAlign: "center", border: `1px solid ${alpha(ORO, 0.2)}`, minWidth: 0, transition: "transform .2s ease, box-shadow .2s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: `0 4px 12px ${alpha(ORO, 0.15)}`, borderColor: alpha(ORO, 0.4) } }}>
                  <Iconify icon="mdi:timer-sand" width={18} sx={{ color: ORO, mb: 0.3 }} />
                  <Typography sx={{ fontSize: "0.6rem", color: "#7A6A5C", mb: 0.2, lineHeight: 1.1 }}>
                    {t("affiliate_dashboard.dsp_ends_in")}
                  </Typography>
                  <Timer expiryDate={pkgPeriod.period_end} />
                </Box>
              )}
              {rankSummary.current_rank && (
                <Box sx={{ gridColumn: { xs: "span 2", md: "span 2" }, bgcolor: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)", borderRadius: 2, px: 1, py: 1.2, textAlign: "center", border: `1px solid ${alpha(ORO, 0.2)}`, minWidth: 0, transition: "transform .2s ease, box-shadow .2s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: `0 4px 12px ${alpha(ORO, 0.15)}`, borderColor: alpha(ORO, 0.4) } }}>
                  <Iconify icon="mdi:shield-star" width={18} sx={{ color: ORO, mb: 0.3 }} />
                  <Typography sx={{ fontSize: "0.62rem", color: "#7A6A5C", mb: 0.2, lineHeight: 1.1, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>
                    {L.currentRank}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.78rem", color: ESPRESSO }}>{rankSummary.current_rank}</Typography>
                </Box>
              )}
              {rankSummary.paid_rank && (
                <Box sx={{ gridColumn: { xs: "span 2", md: "span 2" }, bgcolor: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)", borderRadius: 2, px: 1, py: 1.2, textAlign: "center", border: `1px solid ${alpha(ORO, 0.2)}`, minWidth: 0, transition: "transform .2s ease, box-shadow .2s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: `0 4px 12px ${alpha(ORO, 0.15)}`, borderColor: alpha(ORO, 0.4) } }}>
                  <Iconify icon="mdi:medal-outline" width={18} sx={{ color: ORO, mb: 0.3 }} />
                  <Typography sx={{ fontSize: "0.62rem", color: "#7A6A5C", mb: 0.2, lineHeight: 1.1, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>
                    {L.recognitionRank}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.78rem", color: ESPRESSO }}>{rankSummary.paid_rank}</Typography>
                </Box>
              )}
              {rankSummary.achieved_rank && (
                <Box sx={{ gridColumn: { xs: "span 2", md: "span 2" }, bgcolor: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)", borderRadius: 2, px: 1, py: 1.2, textAlign: "center", border: `1px solid ${alpha(ORO, 0.2)}`, minWidth: 0, transition: "transform .2s ease, box-shadow .2s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: `0 4px 12px ${alpha(ORO, 0.15)}`, borderColor: alpha(ORO, 0.4) } }}>
                  <Iconify icon="mdi:trophy-outline" width={18} sx={{ color: ORO, mb: 0.3 }} />
                  <Typography sx={{ fontSize: "0.62rem", color: "#7A6A5C", mb: 0.2, lineHeight: 1.1, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>
                    {L.achievedRank}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.78rem", color: ESPRESSO }}>{rankSummary.achieved_rank}</Typography>
                </Box>
              )}
            </Box>
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
  { key: "faststart", url: "affiliate-dashboard/faststart-Progressbar", label: "Fast Start", icon: "mdi:flash-outline", color: "#FF4081", pendingField: "pending_bonus_amount", freq: "weekly" },
  { key: "pmb", url: "affiliate-dashboard/pmb-Progressbar", label: "MVP Mentor", icon: "mdi:account-group-outline", color: "#9C27B0", pendingField: "pending_bonus_amount", freq: "weekly" },
  { key: "isb", url: "affiliate-dashboard/isb-Progressbar", label: "Indirect Sales", icon: "mdi:sitemap-outline", color: "#00BCD4", pendingField: "pending_commission", freq: "weekly" },
  { key: "rob", url: "affiliate-dashboard/rob-Progressbar", label: "Recurring Order", icon: "mdi:autorenew", color: "#8BC34A", pendingField: "pending_bonus_amount", freq: "monthly", isCoupon: true },
  { key: "threeff", url: "affiliate-dashboard/threeff-Progressbar", label: "3 For Free", icon: "mdi:gift-outline", color: "#E91E63", pendingField: "current_bonus_amount", freq: "monthly", isCoupon: true },
  { key: "residual", url: "affiliate-dashboard/residual-Progressbar", label: "Residual", icon: "mdi:chart-line", color: "#607D8B", pendingField: "pending_commission_total", freq: "monthly" },
  { key: "leadership", url: "affiliate-dashboard/leadership-Progressbar", label: "Leadership", icon: "mdi:crown-outline", color: ORO, pendingField: "pending_bonus_amount", freq: "monthly" },
  { key: "residualmatching", url: "affiliate-dashboard/residualmatching-Progressbar", label: "Residual Matching", icon: "mdi:swap-horizontal-circle-outline", color: "#795548", pendingField: "pending_bonus_amount", freq: "monthly" },
  { key: "rgomvp", url: "affiliate-dashboard/rgomvp-Progressbar", label: "Rock Solid Bonus", icon: "mdi:diamond-outline", color: "#455A64", pendingField: "pending_bonus_amount", freq: "monthly" },
  { key: "evolving", url: "affiliate-dashboard/eveolving-Progressbar", label: "Evolving Bonus", icon: "mdi:trending-up", color: "#FF5722", pendingField: "pending_bonus_amount", freq: "monthly" },
];

const BonusSummaryGrid = () => {
  const { t } = useTranslation();
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
              pendingCurrentWeek: src?.pending_current_week ?? d?.pending_current_week ?? null,
              pendingPreviousWeek: src?.pending_previous_week ?? d?.pending_previous_week ?? null,
              prevMonth: d?.[cfg.prevField] ?? src?.previous_month_pending_commission ?? d?.previous_month_pending_commission ?? 0,
              expired: Boolean(d?.is_expired),
              notEligible: d?.is_eligible === 0 || d?.go_mvp_approved === 0 || false,
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
  const weeklyTotal = weeklyBonuses.reduce((s, b) => s + Number(b.pendingCurrentWeek ?? b.pending ?? 0), 0);
  const weeklyPrevTotal = weeklyBonuses.reduce((s, b) => s + Number(b.pendingPreviousWeek ?? 0), 0);
  const monthlyTotal = monthlyBonuses.reduce((s, b) => s + Number(b.pending || 0), 0);
  const monthlyPrevTotal = monthlyBonuses.filter((b) => !b.isCoupon).reduce((s, b) => s + Number(b.prevMonth || 0), 0);

  const BonusCard = ({ b }) => (
    <Card
      sx={{
        p: 2, borderRadius: 3, bgcolor: "#fff",
        border: "1px solid #f0ece6",
        boxShadow: "0 1px 3px rgba(44, 26, 14, 0.04)",
        height: "100%", position: "relative", overflow: "hidden",
        transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
        cursor: "default",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 6px 16px ${alpha(b.color, 0.18)}`,
          borderColor: alpha(b.color, 0.35),
        },
      }}
    >
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${b.color} 0%, ${alpha(b.color, 0.5)} 100%)` }} />
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Box
          sx={{
            width: 34, height: 34, borderRadius: 1.8,
            background: `linear-gradient(135deg, ${alpha(b.color, 0.18)} 0%, ${alpha(b.color, 0.06)} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Iconify icon={b.icon} width={19} sx={{ color: b.color }} />
        </Box>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: ESPRESSO, lineHeight: 1.2 }}>
          {b.label}
        </Typography>
        {b.expired && (
          <Chip label="Expired" size="small" color="error" sx={{ height: 18, fontSize: "0.6rem", ml: "auto" }} />
        )}
      </Stack>
      {b.freq === "weekly" && b.pendingCurrentWeek !== null ? (
        <>
          <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: Number(b.pendingCurrentWeek) > 0 ? b.color : "#ccc", lineHeight: 1.2 }}>
            €{Number(b.pendingCurrentWeek || 0).toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: ESPRESSO, mt: 0.3 }}>{t("evea.current_week")}</Typography>
          <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid #f0ece6" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#7A6A5C" }}>{t("evea.awaiting_approval")}</Typography>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: Number(b.pendingPreviousWeek) > 0 ? ESPRESSO : "#ccc" }}>
                €{Number(b.pendingPreviousWeek || 0).toFixed(2)}
              </Typography>
            </Stack>
          </Box>
        </>
      ) : (
        <>
          <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: Number(b.pending) > 0 ? b.color : "#ccc", lineHeight: 1.2 }}>
            €{Number(b.pending || 0).toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: ESPRESSO, mt: 0.3 }}>
            {b.isCoupon ? t("evea.current_month") + " (coupon)" : t("evea.current_month")}
          </Typography>
          {!b.isCoupon && (
          <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid #f0ece6" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#7A6A5C" }}>{t("evea.awaiting_approval")}</Typography>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: Number(b.prevMonth) > 0 ? ESPRESSO : "#ccc" }}>
                €{Number(b.prevMonth || 0).toFixed(2)}
              </Typography>
            </Stack>
          </Box>
          )}
        </>
      )}
    </Card>
  );

  const TotalHeader = ({ icon, label, total, color, timer, prevTotal }) => (
    <Box sx={{
      mb: 2, p: 2.5, borderRadius: 3,
      background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.02)} 100%)`,
      border: `1px solid ${alpha(color, 0.18)}`,
      position: "relative",
      overflow: "hidden",
      "&::before": { content: '""', position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg, ${color} 0%, ${alpha(color, 0.3)} 100%)` },
    }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box sx={{
          width: 46, height: 46, borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.08)} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 2px 8px ${alpha(color, 0.15)}`,
        }}>
          <Iconify icon={icon} width={24} sx={{ color }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "0.88rem", fontWeight: 800, color: "#2C1A0E", letterSpacing: "-0.2px" }}>
            {label}
          </Typography>
          {timer && (
            <Typography sx={{ fontSize: "0.72rem", color: "#7A6A5C", mt: 0.3, fontWeight: 500 }}>{timer}</Typography>
          )}
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ fontSize: "1.9rem", fontWeight: 800, color: total > 0 ? color : "#c8c0b4", lineHeight: 1, letterSpacing: "-0.5px" }}>
            €{total.toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "#7A6A5C", mt: 0.4 }}>
            {t("evea.awaiting_approval")}: <b style={{ color: prevTotal > 0 ? "#2C1A0E" : "#c8c0b4" }}>€{(prevTotal || 0).toFixed(2)}</b>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={0}>
      {/* ── SETTIMANALI ── */}
      <Box sx={{ flex: 1 }}>
        <TotalHeader icon="mdi:calendar-week" label={t("evea.pending_weekly")} total={weeklyTotal} color="#4CAF50" prevTotal={weeklyPrevTotal}
          timer={(() => { const now = new Date(); const day = now.getDay(); const left = day === 0 ? 0 : 7 - day; return t("evea.weekly_period") + " — " + (left === 0 ? t("evea.week_restarts_tomorrow") : t("evea.week_ends_in") + " " + left + " " + (left === 1 ? t("evea.day") : t("evea.days"))); })()} />
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
        <TotalHeader icon="mdi:calendar-month" label={t("evea.pending_monthly")} total={monthlyTotal} color={ORO} prevTotal={monthlyPrevTotal}
          timer={(() => { const now = new Date(); const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59); const d = Math.max(0, Math.ceil((end - now) / 86400000)); return t("evea.monthly_period") + " — " + t("evea.month_ends_in") + " " + d + " " + t("evea.days"); })()} />
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
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4, mx: { xs: -2, md: -3 }, mt: -2, pt: 2, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
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
            {isPromoter && (
              <Grid item xs={12} md={6}><FastStartBonus /></Grid>
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
