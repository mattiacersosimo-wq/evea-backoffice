import {
  Avatar, Box, Button, Card, Chip, Dialog, DialogContent, DialogTitle,
  Divider, Grid, IconButton, LinearProgress, MenuItem, Skeleton,
  Stack, TextField, Tooltip, Typography,
} from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";
import fetchUser from "src/utils/fetchUser";
import { WP_URL } from "src/config";
import CommunityBanner from "src/components/CommunityBanner";
import FounderCountdown from "src/components/FounderCountdown";
import FounderBadge from "src/components/FounderBadge";
import useFounderStatus from "src/hooks/useFounderStatus";
import useOnboardingStatus from "src/hooks/useOnboardingStatus";

// ═══════════════════════════════════════
// PALETTE EVEA
// ═══════════════════════════════════════
const ORO = "#B8963B";
const AVORIO = "#FAF6EF";
const SABBIA = "#E8DDCA";
const ESPRESSO = "#2C1A0E";
const TEXT = "#3D3229";
const MUTED = "#7A6A5C";

const cardSx = {
  bgcolor: "#fff", borderRadius: 3,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
  border: "1px solid #f0ece6",
};

// ═══════════════════════════════════════
// DATA HOOKS
// ═══════════════════════════════════════
const useFetch = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let off = false;
    setLoading(true);
    (async () => {
      try { const r = await fetcher(); if (!off) setData(r); }
      catch (e) { /* silent */ }
      if (!off) setLoading(false);
    })();
    return () => { off = true; };
  }, deps);
  return { data, loading };
};

const useRankSummary = () => useFetch(async () => {
  const { data } = await axiosInstance.get("api/user/affiliate-dashboard/rank-summery");
  return data?.data;
});
const useThreeFF = () => useFetch(async () => {
  const { data } = await fetchUser("affiliate-dashboard/threeff-Progressbar");
  return Array.isArray(data?.data) ? data.data[0] : data?.data;
});
const useROB = () => useFetch(async () => {
  const { data } = await fetchUser("affiliate-dashboard/rob-Progressbar");
  return Array.isArray(data?.data) ? data.data[0] : data?.data;
});
const useTicker = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const load = async () => {
      try { const { data: r } = await axiosInstance.get("api/wp/dashboard/ticker"); setData(r?.data); }
      catch { /* silent */ }
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);
  return data;
};
const useTopPerformers = (sortBy = "gv", scope = "team") => useFetch(async () => {
  const { data } = await axiosInstance.get(`api/wp/dashboard/top-performers?sort_by=${sortBy}&scope=${scope}`);
  return data?.data;
}, [sortBy, scope]);
const useStats = () => useFetch(async () => {
  const { data } = await axiosInstance.get("api/wp/dashboard/stats");
  return data?.data;
});
const useQvHistory = () => useFetch(async () => {
  const { data } = await axiosInstance.get("api/wp/dashboard/qv-history");
  return data?.data;
});
const useBonusPending = () => useFetch(async () => {
  const weeklyUrls = [
    { url: "affiliate-dashboard/gomvp-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/rsp-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/dsb-Progressbar", field: "pending_amount", nested: "direct_sales_bonus" },
    { url: "affiliate-dashboard/faststart-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/pmb-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/isb-Progressbar", field: "pending_commission" },
  ];
  const monthlyUrls = [
    { url: "affiliate-dashboard/residual-Progressbar", field: "pending_commission_total" },
    { url: "affiliate-dashboard/leadership-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/residualmatching-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/rgomvp-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/eveolving-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/rob-Progressbar", field: "pending_bonus_amount", isCoupon: true },
    { url: "affiliate-dashboard/threeff-Progressbar", field: "current_bonus_amount", isCoupon: true },
  ];
  const grab = async (list, isWeekly) => {
    const results = await Promise.allSettled(list.map(async (c) => {
      try {
        const { data } = await fetchUser(c.url);
        const d = Array.isArray(data?.data) ? data.data[0] : data?.data;
        const src = c.nested ? d?.[c.nested] : d;
        return {
          total: Number(src?.[c.field]) || 0,
          currentWeek: Number(src?.pending_current_week ?? d?.pending_current_week) || 0,
          previousWeek: Number(src?.pending_previous_week ?? d?.pending_previous_week) || 0,
          prevMonth: c.isCoupon ? 0 : (Number(d?.previous_month_pending_commission ?? src?.previous_month_pending_commission) || 0),
        };
      } catch { return { total: 0, currentWeek: 0, previousWeek: 0, prevMonth: 0 }; }
    }));
    const vals = results.map((r) => r.status === "fulfilled" ? r.value : { total: 0, currentWeek: 0, previousWeek: 0, prevMonth: 0 });
    return {
      total: vals.reduce((s, v) => s + v.total, 0),
      currentWeek: vals.reduce((s, v) => s + v.currentWeek, 0),
      previousWeek: vals.reduce((s, v) => s + v.previousWeek, 0),
      prevMonth: vals.reduce((s, v) => s + v.prevMonth, 0),
    };
  };
  const [w, m] = await Promise.all([grab(weeklyUrls, true), grab(monthlyUrls, false)]);
  return { weekly: w, monthly: m };
});

// ═══════════════════════════════════════
// COUNTDOWN TIMER
// ═══════════════════════════════════════
const CountdownTimer = ({ expiryDate, label }) => {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    if (!expiryDate) return;
    const tick = () => {
      const diff = Math.max(0, new Date(expiryDate) - new Date());
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [expiryDate]);
  const pad = (n) => String(n).padStart(2, "0");
  if (!expiryDate) return null;
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C", mb: 0.4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</Typography>
      <Typography sx={{
        fontSize: "0.88rem", fontWeight: 800, color: ESPRESSO,
        background: `linear-gradient(135deg, ${alpha(ORO, 0.15)} 0%, ${alpha(ORO, 0.06)} 100%)`,
        borderRadius: 1.5, px: 1.2, py: 0.5,
        border: `1px solid ${alpha(ORO, 0.25)}`,
        whiteSpace: "nowrap",
        letterSpacing: "-0.2px",
        fontVariantNumeric: "tabular-nums",
      }}>
        {pad(time.d)}d {pad(time.h)}h {pad(time.m)}m {pad(time.s)}s
      </Typography>
    </Box>
  );
};

// ═══════════════════════════════════════
// 1. HERO CARD
// ═══════════════════════════════════════
const useHero = () => useFetch(async () => {
  const { data } = await axiosInstance.get("api/wp/dashboard/hero");
  return data?.data;
});

const useCoupons = () => useFetch(async () => {
  const { data } = await fetchUser("coupon-purchase?page=1");
  return data?.data?.data?.slice(0, 4) || [];
});

const OnboardingBanner = () => {
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/wp/onboarding/status");
        setStatus(r?.data);
      } catch { /* silent */ }
    })();
  }, []);
  if (!status) return null;

  // Lettera not signed yet — highest priority banner
  if (!status.onboarding_done && status.pct >= 83) {
    return (
      <Card onClick={() => navigate("/user/onboarding")} sx={{ p: 2.5, borderRadius: 3, border: "2px solid #E24B4A", bgcolor: "#fff8f8", cursor: "pointer", "&:hover": { bgcolor: "#ffefef" } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#fde8e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Iconify icon="mdi:file-sign" width={24} sx={{ color: "#E24B4A" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#E24B4A" }}>Firma la Lettera di Incarico per attivare il tuo account</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#7A6A5C", mt: 0.3 }}>
              Accetta la Lettera di Incarico per abilitare commissioni, link referral e genealogia.
            </Typography>
          </Box>
          <Iconify icon="mdi:chevron-right" width={24} sx={{ color: "#E24B4A" }} />
        </Stack>
      </Card>
    );
  }

  // Onboarding in progress
  if (!status.onboarding_done && status.pct < 83) {
    return (
      <Card onClick={() => navigate("/user/onboarding")} sx={{ p: 2, borderRadius: 3, border: `1px solid ${alpha(ORO, 0.3)}`, bgcolor: alpha(ORO, 0.04), cursor: "pointer", "&:hover": { bgcolor: alpha(ORO, 0.08) } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:clipboard-check-outline" width={22} sx={{ color: ORO }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO }}>Completa il tuo profilo Promotore</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>{status.completed}/{status.total} step completati — clicca per continuare</Typography>
            <LinearProgress variant="determinate" value={status.pct} sx={{ mt: 0.5, height: 5, borderRadius: 3, bgcolor: "#eee", "& .MuiLinearProgress-bar": { bgcolor: ORO, borderRadius: 3 } }} />
          </Box>
          <Iconify icon="mdi:chevron-right" width={24} sx={{ color: ORO }} />
        </Stack>
      </Card>
    );
  }

  return null;
};

const HeroCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: rank, loading: rankLoading } = useRankSummary();
  const { data: hero, loading: heroLoading } = useHero();
  const loading = rankLoading || heroLoading;

  const fullName = [hero?.first_name, hero?.last_name].filter(Boolean).join(" ") || user?.username || "";
  const { is_founder: isFounder, founder_number: founderNumber } = useFounderStatus();

  return (
    <Card sx={{
      background: `linear-gradient(135deg, #FAF6EF 0%, #F5EEDE 60%, #F0E7CF 100%)`,
      color: ESPRESSO, borderRadius: 3, p: { xs: 2.5, md: 3.5 },
      position: "relative", overflow: "hidden",
      border: `1px solid ${alpha(ORO, 0.25)}`,
      boxShadow: `0 2px 16px ${alpha(ORO, 0.08)}`,
    }}>
      <Box sx={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ORO, 0.12)} 0%, transparent 70%)` }} />
      <Box sx={{ position: "absolute", top: -60, left: "30%", width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ORO, 0.08)} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ xs: "center", md: "flex-start" }} sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, width: "100%" }}>
          <Avatar sx={{
            width: 72, height: 72,
            bgcolor: "#fff",
            color: ORO, fontSize: 28, fontWeight: 800,
            border: `3px solid ${alpha(ORO, 0.4)}`,
            boxShadow: `0 0 0 6px ${alpha(ORO, 0.08)}, 0 4px 12px ${alpha(ORO, 0.2)}`,
          }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ mb: 0.3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: "-0.2px" }}>
                {(() => {
                  const h = new Date().getHours();
                  const firstName = hero?.first_name || fullName.split(" ")[0] || "";
                  if (h >= 6 && h < 12) return `🌅 Buongiorno${firstName ? ", " + firstName : ""}`;
                  if (h >= 12 && h < 18) return `☀️ Buon pomeriggio${firstName ? ", " + firstName : ""}`;
                  if (h >= 18 && h < 24) return `🌙 Buonasera${firstName ? ", " + firstName : ""}`;
                  return `🌙 Buonanotte${firstName ? ", " + firstName : ""}`;
                })()}
              </Typography>
              {rank?.current_rank && <Chip label={rank.current_rank} size="small" sx={{ bgcolor: alpha(ORO, 0.15), color: ORO, fontWeight: 700, fontSize: "0.8rem", height: 24, border: `1px solid ${alpha(ORO, 0.3)}` }} />}
            </Stack>
            <Typography sx={{ fontSize: "0.82rem", color: "#7A6A5C", mb: 0.5 }}>
              <b style={{ color: ESPRESSO }}>{fullName}</b>
            </Typography>
            <Stack spacing={0.2}>
              <Typography sx={{ fontSize: "0.72rem", color: "#7A6A5C" }}>
                ID: {hero?.unique_id || user?.unique_id || user?.id}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#7A6A5C" }}>
                User: {hero?.username || user?.username}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#7A6A5C" }}>
                Sponsor: {hero?.sponsor || "—"}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        {!rankLoading && rank && (
          <Stack direction="row" spacing={1.5} alignItems="center" flexShrink={0}>
            <CountdownTimer expiryDate={rank.month_end} label={t("evea.monthly_period")} />
            {rank.dsp_end && <CountdownTimer expiryDate={rank.dsp_end} label={t("evea.dsb_boost_expires")} />}
          </Stack>
        )}
        {isFounder && (
          <Box sx={{ flexShrink: 0 }}>
            <FounderBadge number={founderNumber} size={72} />
          </Box>
        )}
      </Stack>

      {loading ? <Skeleton height={50} sx={{ mt: 2, bgcolor: alpha(ORO, 0.04), borderRadius: 2 }} /> : (
        <Stack direction="row" spacing={1} sx={{ mt: 2.5, flexWrap: "wrap", gap: 1 }}>
          {[
            { icon: "mdi:wallet-outline", label: t("evea.wallet"), value: `€${Number(hero?.wallet || 0).toFixed(2)}` },
            { icon: "mdi:chart-bar", label: "PQV", value: hero?.pqv_mese || hero?.qv_mese || 0 },
            { icon: "mdi:account-group-outline", label: t("evea.clients"), value: hero?.clienti_diretti || 0 },
            { icon: "mdi:account-tie-outline", label: t("evea.team"), value: hero?.team_promoter || 0 },
          ].map((m) => (
            <Box key={m.label} sx={{
              flex: "1 1 0", minWidth: 80,
              bgcolor: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)",
              borderRadius: 2, p: 1.2, textAlign: "center",
              border: `1px solid ${alpha(ORO, 0.18)}`,
              transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${alpha(ORO, 0.15)}`,
                borderColor: alpha(ORO, 0.4),
              },
            }}>
              <Iconify icon={m.icon} width={18} sx={{ color: ORO, mb: 0.3 }} />
              <Typography sx={{ fontSize: "1rem", fontWeight: 800 }}>{m.value}</Typography>
              <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>{m.label}</Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Card>
  );
};

// ═══════════════════════════════════════
// 2. TICKER
// ═══════════════════════════════════════
const scroll = keyframes`0% { transform: translateX(0); } 100% { transform: translateX(-50%); }`;
const TickerBar = () => {
  const { t } = useTranslation();
  const ticker = useTicker();
  if (!ticker) return null;
  const items = [...(ticker.sales || []), ...(ticker.new_members || []), ...(ticker.ranks || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  if (!items.length) return null;
  return (
    <Box sx={{
      bgcolor: "#fff", overflow: "hidden", borderRadius: 2,
      border: `1px solid ${alpha(ORO, 0.15)}`,
      boxShadow: `0 1px 3px ${alpha(ESPRESSO, 0.04)}`,
    }}>
      <Box sx={{ px: 2, py: 0.9, borderBottom: `1px solid ${alpha(ORO, 0.12)}`, display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{
          width: 8, height: 8, borderRadius: "50%", bgcolor: "#ff3b30",
          boxShadow: "0 0 0 3px rgba(255,59,48,0.2)",
          animation: "pulse 2s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { boxShadow: "0 0 0 3px rgba(255,59,48,0.2)" },
            "50%": { boxShadow: "0 0 0 6px rgba(255,59,48,0.08)" },
          },
        }} />
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: ORO, letterSpacing: 2 }}>EVEA LIVE</Typography>
      </Box>
      <Box sx={{ py: 1.2, overflow: "hidden" }}>
        <Box sx={{ display: "flex", animation: `${scroll} ${Math.max(items.length * 5, 20)}s linear infinite`, width: "max-content" }}>
          {[...items, ...items].map((it, i) => (
            <Stack key={i} direction="row" alignItems="center" spacing={0.8} sx={{ px: 2.5, flexShrink: 0 }}>
              <Chip label={it.type === "sale" ? t("evea.sale") : it.type === "rank" ? t("evea.qualification") : it.is_promoter ? t("evea.new_promoter") : t("evea.new_customer")} size="small" sx={{ height: 22, fontSize: "0.72rem", fontWeight: 700, bgcolor: it.type === "sale" ? alpha("#4CAF50", 0.1) : it.type === "rank" ? alpha(ORO, 0.1) : alpha("#2196F3", 0.1), color: it.type === "sale" ? "#4CAF50" : it.type === "rank" ? ORO : "#2196F3" }} />
              <Typography sx={{ fontSize: "0.88rem", color: ESPRESSO, fontWeight: 600 }}>{it.username}</Typography>
              {it.product && <Typography sx={{ fontSize: "0.82rem", color: MUTED }}>{it.product}</Typography>}
              {it.rank && <Typography sx={{ fontSize: "0.82rem", color: ORO, fontWeight: 700 }}>{it.rank}</Typography>}
              {it.amount && <Typography sx={{ fontSize: "0.88rem", color: ORO, fontWeight: 700 }}>€{it.amount}</Typography>}
            </Stack>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// ═══════════════════════════════════════
// 3. ALERT URGENZA
// ═══════════════════════════════════════
const UrgencyAlert = () => {
  const { data: rank } = useRankSummary();
  if (!rank?.month_end) return null;
  const daysLeft = Math.max(0, Math.ceil((new Date(rank.month_end) - new Date()) / 86400000));
  if (daysLeft > 5) return null;
  const qvMissing = Math.max(0, Number(rank?.next_rank_pqv || 0) - Number(rank?.current_pqv || 0));
  return (
    <Box sx={{
      background: `linear-gradient(135deg, ${alpha("#FF9800", 0.14)} 0%, ${alpha("#FF9800", 0.04)} 100%)`,
      border: `1px solid ${alpha("#FF9800", 0.3)}`,
      borderRadius: 2, p: 2,
      display: "flex", alignItems: "center", gap: 1.5,
      position: "relative", overflow: "hidden",
      "&::before": { content: '""', position: "absolute", left: 0, top: 0, bottom: 0, width: 4, bgcolor: "#FF9800" },
    }}>
      <Box sx={{
        width: 36, height: 36, borderRadius: "50%",
        bgcolor: alpha("#FF9800", 0.18),
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Iconify icon="mdi:alert-circle-outline" width={22} sx={{ color: "#FF9800" }} />
      </Box>
      <Typography sx={{ fontSize: "0.9rem", color: TEXT, fontWeight: 600 }}>
        Mancano <b style={{ color: "#FF9800" }}>{daysLeft} giorni</b> alla fine del periodo
        {qvMissing > 0 && <> — ti servono ancora <b style={{ color: "#FF9800" }}>{qvMissing} QV</b></>}
      </Typography>
    </Box>
  );
};

// ═══════════════════════════════════════
// 4. BANNER 3FF CELEBRAZIONE
// ═══════════════════════════════════════
const CelebrationBanner = () => {
  const { data: ff } = useThreeFF();
  if (!ff) return null;
  if (Number(ff?.current_qualified_customer_count) < Number(ff?.required_customers || 3)) return null;
  if (Number(ff?.current_bonus_amount || 0) <= 0) return null;
  return (
    <Box sx={{
      background: `linear-gradient(135deg, ${alpha("#4CAF50", 0.14)} 0%, ${alpha("#4CAF50", 0.04)} 100%)`,
      border: `1px solid ${alpha("#4CAF50", 0.3)}`,
      borderRadius: 2, p: 2,
      display: "flex", alignItems: "center", gap: 1.5,
      position: "relative", overflow: "hidden",
      "&::before": { content: '""', position: "absolute", left: 0, top: 0, bottom: 0, width: 4, bgcolor: "#4CAF50" },
    }}>
      <Box sx={{
        width: 36, height: 36, borderRadius: "50%",
        bgcolor: alpha("#4CAF50", 0.18),
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Iconify icon="mdi:party-popper" width={22} sx={{ color: "#4CAF50" }} />
      </Box>
      <Typography sx={{ fontSize: "0.9rem", color: TEXT, fontWeight: 600 }}>
        3 For Free completato! Hai guadagnato <b style={{ color: ORO }}>€{ff?.current_bonus_amount || 0}</b>
      </Typography>
    </Box>
  );
};

// ═══════════════════════════════════════
// 5. GUADAGNI
// ═══════════════════════════════════════
const EarningsSection = () => {
  const { t, i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const L = {
    currentRank: isIt ? "Rank Attuale" : "Current Rank",
    recognitionRank: isIt ? "Rank Riconosciuto" : "Recognition Rank",
    achievedRank: isIt ? "Rank Raggiunto" : "Achieved Rank",
  };
  const { data: bonus, loading: bLoad } = useBonusPending();
  const { data: rank, loading: rLoad } = useRankSummary();

  const PendingCard = ({ label, icon, color, current, previous, isWeekly }) => (
    <Card sx={{
      ...cardSx, p: 2.5, height: "100%", position: "relative", overflow: "hidden",
      transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
      "&:hover": { transform: "translateY(-2px)", boxShadow: `0 6px 16px ${alpha(color, 0.15)}`, borderColor: alpha(color, 0.3) },
      "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.5)} 100%)` },
    }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
        <Box sx={{
          width: 42, height: 42, borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(color, 0.18)} 0%, ${alpha(color, 0.06)} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Iconify icon={icon} width={22} sx={{ color }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</Typography>
        </Box>
      </Stack>
      {bLoad ? <Skeleton width={80} height={30} /> : (
        <>
          <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: current > 0 ? color : "#c8c0b4", lineHeight: 1.1, letterSpacing: "-0.3px" }}>€{current.toFixed(2)}</Typography>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: ESPRESSO, mt: 0.4 }}>{isWeekly ? t("evea.current_week") : t("evea.current_month")}</Typography>
          <Box sx={{ mt: 1.2, pt: 1, borderTop: "1px solid #f5f0e8" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#7A6A5C" }}>{t("evea.awaiting_approval")}</Typography>
              <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: previous > 0 ? ESPRESSO : "#c8c0b4" }}>€{previous.toFixed(2)}</Typography>
            </Stack>
          </Box>
        </>
      )}
    </Card>
  );

  const wCurrent = bonus?.weekly?.currentWeek || 0;
  const wPrev = bonus?.weekly?.previousWeek || 0;
  const mCurrent = bonus?.monthly?.total || 0;
  const mPrev = bonus?.monthly?.prevMonth || 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}><PendingCard label={t("evea.pending_weekly")} icon="mdi:calendar-week" color="#4CAF50" current={wCurrent} previous={wPrev} isWeekly={true} /></Grid>
      <Grid item xs={12} md={4}><PendingCard label={t("evea.pending_monthly")} icon="mdi:calendar-month" color={ORO} current={mCurrent} previous={mPrev} isWeekly={false} /></Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{
          ...cardSx, p: 2.5, height: "100%", position: "relative", overflow: "hidden",
          transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
          "&:hover": { transform: "translateY(-2px)", boxShadow: `0 6px 16px ${alpha(ORO, 0.15)}`, borderColor: alpha(ORO, 0.3) },
          "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ORO} 0%, ${alpha(ORO, 0.5)} 100%)` },
        }}>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
            <Box sx={{
              width: 42, height: 42, borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(ORO, 0.18)} 0%, ${alpha(ORO, 0.06)} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Iconify icon="mdi:trophy-outline" width={22} sx={{ color: ORO }} />
            </Box>
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.6 }}>Rank</Typography>
          </Stack>
          {rLoad ? <Skeleton height={60} /> : (
            <Stack spacing={1}>
              {[
                { label: L.currentRank, value: rank?.current_rank || "—" },
                { label: L.achievedRank, value: rank?.achieved_rank || "—" },
                { label: L.recognitionRank, value: rank?.paid_rank || "—" },
              ].map((r) => (
                <Stack key={r.label} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.2 }}>
                  <Typography sx={{ fontSize: "0.75rem", color: MUTED, fontWeight: 500 }}>{r.label}</Typography>
                  <Chip label={r.value} size="small" sx={{ height: 22, fontWeight: 700, fontSize: "0.72rem", bgcolor: alpha(ORO, 0.1), color: ORO, border: `1px solid ${alpha(ORO, 0.2)}` }} />
                </Stack>
              ))}
            </Stack>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

// ═══════════════════════════════════════
// 6. KIT UPGRADE
// ═══════════════════════════════════════
// Kit levels: Bronze=1, Silver=2, Gold=3
// packageId is local DB id: Bronze=9, Silver=8, Gold=7
const PACKAGE_ID_TO_LEVEL = { 9: 1, 8: 2, 7: 3 };

const BASE_KITS = [
  { name: "Bronze", price: 229, bv: 160, qv: 240, products: 8, color: "#CD7F32", url: `${WP_URL.replace(/\/$/, "")}/products/bronze-pack` },
  { name: "Silver", price: 446, bv: 320, qv: 480, products: 16, color: "#A0A0A0", url: `${WP_URL.replace(/\/$/, "")}/products/silver-pack` },
  { name: "Gold", price: 893, bv: 640, qv: 960, products: 33, color: ORO, recommended: true, url: `${WP_URL.replace(/\/$/, "")}/products/gold-pack-1` },
];

const UPGRADES_BY_LEVEL = {
  1: [
    { name: "Upgrade a Silver", price: 230, bv: 160, qv: 240, products: 8, color: "#A0A0A0", url: `${WP_URL.replace(/\/$/, "")}/products/upgrade-bronzo-silver` },
    { name: "Upgrade a Gold", price: 708, bv: 480, qv: 720, products: 25, color: ORO, recommended: true, url: `${WP_URL.replace(/\/$/, "")}/products/upgrade-bronzo-gold` },
  ],
  2: [
    { name: "Upgrade a Gold", price: 485, bv: 320, qv: 480, products: 17, color: ORO, recommended: true, url: `${WP_URL.replace(/\/$/, "")}/products/upgrade-silver-gold` },
  ],
  3: [], // Gold = max
};

const KitUpgrade = ({ packageId = 0, upgradeDaysRemaining = null, packagePurchasedAt = null }) => {
  const { t } = useTranslation();
  const currentLevel = PACKAGE_ID_TO_LEVEL[packageId] || 0;
  const isUpgrade = currentLevel > 0;
  const upgrades = UPGRADES_BY_LEVEL[currentLevel] || [];
  const kits = isUpgrade ? upgrades : BASE_KITS;

  // If user has Gold (level 3) or is past 60 days window with a kit, show nothing
  if (isUpgrade && (currentLevel === 3 || (upgradeDaysRemaining !== null && upgradeDaysRemaining <= 0))) {
    return null;
  }

  return (
    <>
      {isUpgrade && upgradeDaysRemaining !== null && (
        <Box sx={{
          mb: 2, p: 1.5, borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(ORO, 0.14)} 0%, ${alpha(ORO, 0.04)} 100%)`,
          border: `1px solid ${alpha(ORO, 0.3)}`,
          display: "flex", alignItems: "center", gap: 1.2,
          position: "relative", overflow: "hidden",
          "&::before": { content: '""', position: "absolute", left: 0, top: 0, bottom: 0, width: 3, bgcolor: ORO },
        }}>
          <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: alpha(ORO, 0.15), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Iconify icon="mdi:clock-outline" width={20} sx={{ color: ORO }} />
          </Box>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: TEXT }}>
            Hai <b style={{ color: ORO }}>{upgradeDaysRemaining} giorni</b> per fare l'upgrade al kit superiore
          </Typography>
        </Box>
      )}
      <Grid container spacing={2}>
        {kits.map((k) => (
          <Grid item xs={12} md={isUpgrade && kits.length === 1 ? 12 : isUpgrade ? 6 : 4} key={k.name}>
            <Card sx={{
              ...cardSx, p: 2.5, height: "100%",
              position: "relative", overflow: "hidden",
              border: k.recommended ? `2px solid ${ORO}` : cardSx.border,
              transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
              "&:hover": { transform: "translateY(-3px)", boxShadow: `0 8px 20px ${alpha(k.color, 0.22)}`, borderColor: k.color },
              ...(k.recommended && {
                background: `linear-gradient(135deg, #fff 60%, ${alpha(ORO, 0.06)} 100%)`,
              }),
            }}>
              {k.recommended && <Chip label={t("evea.recommended")} size="small" sx={{ position: "absolute", top: 10, right: 10, height: 22, fontSize: "0.68rem", fontWeight: 800, bgcolor: ORO, color: "#fff", letterSpacing: 0.3, boxShadow: `0 2px 6px ${alpha(ORO, 0.35)}` }} />}
              <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                <Box sx={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${alpha(k.color, 0.2)} 0%, ${alpha(k.color, 0.06)} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 2px 8px ${alpha(k.color, 0.2)}`,
                }}>
                  <Iconify icon={isUpgrade ? "mdi:arrow-up-bold-circle-outline" : "mdi:package-variant-closed"} width={22} sx={{ color: k.color }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: TEXT }}>{k.name}</Typography>
                  <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: k.color, letterSpacing: "-0.3px" }}>€{k.price}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.5} mb={2}>
                <Typography sx={{ fontSize: "0.72rem", color: MUTED, fontWeight: 500 }}>BV <b style={{ color: TEXT, fontWeight: 700 }}>{k.bv}</b></Typography>
                <Typography sx={{ fontSize: "0.72rem", color: MUTED, fontWeight: 500 }}>QV <b style={{ color: TEXT, fontWeight: 700 }}>{k.qv}</b></Typography>
                <Typography sx={{ fontSize: "0.72rem", color: MUTED, fontWeight: 500 }}>{k.products} buste</Typography>
              </Stack>
              <Button fullWidth size="small" variant={k.recommended ? "contained" : "outlined"} href={k.url} target="_blank"
                sx={{ ...(k.recommended ? { bgcolor: ORO, boxShadow: `0 2px 8px ${alpha(ORO, 0.25)}`, "&:hover": { bgcolor: "#A07E2F" } } : { borderColor: alpha(ORO, 0.4), color: ORO, "&:hover": { borderColor: ORO, bgcolor: alpha(ORO, 0.05) } }), fontWeight: 700, textTransform: "none", borderRadius: 2, py: 1 }}>
                {isUpgrade ? "Upgrade ora" : t("evea.buy")}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

// ═══════════════════════════════════════
// SMART ALERTS (Network agent for promoter)
// ═══════════════════════════════════════
const SmartAlerts = () => {
  const { t, i18n } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const isIt = i18n.language?.startsWith("it");
  useEffect(() => {
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/wp/health/promoter-alerts");
        setAlerts(r?.data || []);
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);
  if (loading || alerts.length === 0) return null;
  const LIMIT = 4;
  const visibleAlerts = expanded ? alerts : alerts.slice(0, LIMIT);
  const hiddenCount = alerts.length - LIMIT;
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.2 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha("#EF9F27", 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon="mdi:bell-ring-outline" width={19} sx={{ color: "#EF9F27" }} />
        </Box>
        <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: ESPRESSO }}>
          {isIt ? "Notifiche Smart" : "Smart Alerts"}
        </Typography>
        <Chip label={alerts.length} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: alpha("#EF9F27", 0.12), color: "#EF9F27", border: `1px solid ${alpha("#EF9F27", 0.25)}` }} />
      </Stack>
      <Stack spacing={1}>
        {visibleAlerts.map((a, i) => {
          const clr = a.color || "#EF9F27";
          return (
            <Card key={i} sx={{
              p: 1.5, borderRadius: 2,
              border: `1px solid ${alpha(clr, 0.22)}`,
              background: `linear-gradient(90deg, ${alpha(clr, 0.06)} 0%, ${alpha(clr, 0.015)} 100%)`,
              position: "relative", overflow: "hidden",
              transition: "transform .2s ease, border-color .2s ease",
              "&:hover": { transform: "translateX(2px)", borderColor: alpha(clr, 0.4) },
              "&::before": { content: '""', position: "absolute", left: 0, top: 0, bottom: 0, width: 3, bgcolor: clr },
            }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha(clr, 0.12), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Iconify icon={a.icon || "mdi:alert-outline"} width={18} sx={{ color: clr }} />
                </Box>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: ESPRESSO, flex: 1 }}>
                  {a.title}
                </Typography>
              </Stack>
            </Card>
          );
        })}
        {hiddenCount > 0 && (
          <Button size="small" onClick={() => setExpanded(!expanded)}
            startIcon={<Iconify icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"} />}
            sx={{ color: "#7A6A5C", textTransform: "none", fontWeight: 600, fontSize: "0.78rem", alignSelf: "flex-start" }}>
            {expanded ? (isIt ? "Mostra meno" : "Show less") : (isIt ? `Vedi altre ${hiddenCount} notifiche` : `Show ${hiddenCount} more`)}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

// ═══════════════════════════════════════
// 7. ACCESSO RAPIDO
// ═══════════════════════════════════════
const QuickAccess = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isActive } = useOnboardingStatus();
  const referralLink = user?.username ? `${WP_URL}?ref=${user.username}` : "";
  const shortcuts = [
    { icon: "mdi:storefront-outline", label: t("evea.shop"), action: () => window.open("https://www.myevea.com/collections/all", "_blank") },
    {
      icon: "mdi:link-variant",
      label: t("evea.referral_link"),
      disabled: !isActive,
      disabledTooltip: "Firma la Lettera di Incarico per attivare il tuo link promotore",
      action: async () => {
        if (!isActive) { enqueueSnackbar("Firma la Lettera di Incarico per attivare il tuo link promotore", { variant: "warning" }); navigate("/user/onboarding"); return; }
        if (referralLink) { await navigator.clipboard.writeText(referralLink); enqueueSnackbar(t("evea.link_copied")); }
      }
    },
    { icon: "mdi:wallet-outline", label: t("evea.wallet"), action: () => navigate("/user/financial/wallet") },
    { icon: "mdi:package-variant-closed", label: t("evea.orders"), action: () => navigate("/user/online-store/my-orders") },
    { icon: "mdi:ticket-percent-outline", label: t("evea.coupons"), action: () => navigate("/user/coupons") },
    { icon: "mdi:autorenew", label: t("evea.smartship"), action: () => navigate("/user/recurring-orders") },
  ];
  return (
    <Grid container spacing={1.5}>
      {shortcuts.map((s) => (
        <Grid item xs={4} md={2} key={s.label}>
          <Tooltip title={s.disabled ? s.disabledTooltip : ""} arrow>
            <Card onClick={s.action} sx={{
              ...cardSx, p: 1.5, textAlign: "center",
              cursor: s.disabled ? "not-allowed" : "pointer",
              transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
              opacity: s.disabled ? 0.45 : 1,
              filter: s.disabled ? "grayscale(0.5)" : "none",
              position: "relative", overflow: "hidden",
              "&:hover": s.disabled ? {} : {
                transform: "translateY(-3px)",
                boxShadow: `0 6px 16px ${alpha(ORO, 0.18)}`,
                borderColor: alpha(ORO, 0.4),
                "& .qa-icon-box": {
                  background: `linear-gradient(135deg, ${alpha(ORO, 0.22)} 0%, ${alpha(ORO, 0.08)} 100%)`,
                },
              },
            }}>
              <Box className="qa-icon-box" sx={{
                width: 40, height: 40, borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(ORO, 0.14)} 0%, ${alpha(ORO, 0.04)} 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                mx: "auto", mb: 0.8,
                transition: "background .2s ease",
              }}>
                <Iconify icon={s.icon} width={20} sx={{ color: ORO }} />
              </Box>
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: TEXT }}>{s.label}</Typography>
              {s.disabled && <Typography sx={{ fontSize: "0.6rem", color: "#E24B4A", mt: 0.2 }}>🔒 Non attivo</Typography>}
            </Card>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};

// ═══════════════════════════════════════
// 8. TOP PERFORMER
// ═══════════════════════════════════════
const MEDAL_COLORS = [ORO, "#A0A0A0", "#CD7F32"];
const TopPerformers = () => {
  const [sortBy, setSortBy] = useState("gv");
  const [scope, setScope] = useState("team");
  const { data: top, loading } = useTopPerformers(sortBy, scope);
  const labels = { gv: "GV", pqv: "PQV", commissions: "EUR" };
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%", position: "relative", overflow: "hidden",
      "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ORO} 0%, ${alpha(ORO, 0.5)} 100%)` },
    }}>
      <Stack spacing={1.2} mb={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: `linear-gradient(135deg, ${alpha(ORO, 0.18)} 0%, ${alpha(ORO, 0.06)} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:podium-gold" width={19} sx={{ color: ORO }} />
            </Box>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: TEXT }}>Top Performer del Mese</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            {["team", "global"].map((s) => (
              <Chip key={s} label={s === "team" ? "Il mio Team" : "Globale"} size="small"
                onClick={() => setScope(s)}
                sx={{ height: 22, fontSize: "0.62rem", fontWeight: 700, cursor: "pointer", transition: "all .2s ease",
                  bgcolor: scope === s ? alpha(ORO, 0.15) : "transparent",
                  color: scope === s ? ORO : MUTED,
                  border: `1px solid ${scope === s ? ORO : "#e0e0e0"}`,
                  "&:hover": { bgcolor: alpha(ORO, 0.08) },
                }} />
            ))}
          </Stack>
        </Stack>
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          {["gv", "pqv", "commissions"].map((s) => (
            <Chip key={s} label={s === "commissions" ? "Commissioni" : s.toUpperCase()} size="small"
              onClick={() => setSortBy(s)}
              sx={{ height: 20, fontSize: "0.58rem", fontWeight: 700, cursor: "pointer", transition: "all .2s ease",
                bgcolor: sortBy === s ? alpha("#607D8B", 0.12) : "transparent",
                color: sortBy === s ? "#607D8B" : "#bbb",
                border: `1px solid ${sortBy === s ? "#607D8B" : "#eee"}`,
                "&:hover": { bgcolor: alpha("#607D8B", 0.06) },
              }} />
          ))}
        </Stack>
      </Stack>
      {loading ? <Skeleton height={100} /> : (
        <Stack spacing={1}>
          {(top || []).map((p, i) => {
            const medalColor = MEDAL_COLORS[Math.min(i, 2)];
            const isTop3 = i < 3;
            return (
              <Stack key={p.user_id} direction="row" alignItems="center" spacing={1.5} sx={{
                py: 1, px: 1, borderRadius: 1.5,
                bgcolor: isTop3 ? alpha(medalColor, 0.04) : "transparent",
                borderLeft: isTop3 ? `3px solid ${medalColor}` : "3px solid transparent",
                transition: "background .2s ease, transform .2s ease",
                "&:hover": { bgcolor: alpha(ORO, 0.04), transform: "translateX(2px)" },
              }}>
                <Box sx={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: isTop3 ? `linear-gradient(135deg, ${medalColor} 0%, ${alpha(medalColor, 0.7)} 100%)` : "#f0ece6",
                  color: isTop3 ? "#fff" : MUTED,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  boxShadow: isTop3 ? `0 2px 6px ${alpha(medalColor, 0.35)}` : "none",
                }}>
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 800 }}>{i + 1}</Typography>
                </Box>
                <Avatar sx={{ width: 34, height: 34, bgcolor: alpha(ORO, 0.12), color: ORO, fontSize: 13, fontWeight: 700, border: `1px solid ${alpha(ORO, 0.2)}` }}>
                  {(p.first_name || p.username || "?").charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: TEXT }} noWrap>{[p.first_name, p.last_name].filter(Boolean).join(" ") || p.username}</Typography>
                  <Typography sx={{ fontSize: "0.62rem", color: MUTED }}>{p.rank || "Associate"}</Typography>
                </Box>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: isTop3 ? medalColor : ORO, letterSpacing: "-0.2px" }}>
                  {sortBy === "commissions" ? "€" : ""}{Number(p.sort_value || p.total_qv || 0).toFixed(0)} <span style={{ fontSize: "0.65rem", color: MUTED, fontWeight: 600 }}>{labels[sortBy]}</span>
                </Typography>
              </Stack>
            );
          })}
          {(!top || !top.length) && <Typography sx={{ fontSize: "0.85rem", color: MUTED, textAlign: "center", py: 2 }}>Nessun dato</Typography>}
        </Stack>
      )}
    </Card>
  );
};

// ═══════════════════════════════════════
// 9. ANDAMENTO QV + STATISTICHE
// ═══════════════════════════════════════
const MESI = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
const TeamSection = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("month");
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: stats, loading: sLoad } = useStats();

  useEffect(() => {
    let off = false;
    setLoading(true);
    (async () => {
      try {
        const { data } = await axiosInstance.get(`api/wp/dashboard/team-details?period=${period}`);
        if (!off) setTeam(data?.data);
      } catch { /* silent */ }
      if (!off) setLoading(false);
    })();
    return () => { off = true; };
  }, [period]);

  const Delta = ({ cur, prev, suffix = "" }) => {
    if (!prev) return null;
    const d = cur - prev;
    return <Typography component="span" sx={{ fontSize: "0.6rem", color: d >= 0 ? "#4CAF50" : "#E24B4A", ml: 0.5 }}>{d >= 0 ? "↑" : "↓"}{Math.abs(d)}{suffix}</Typography>;
  };

  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: `linear-gradient(135deg, ${alpha(ORO, 0.18)} 0%, ${alpha(ORO, 0.06)} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:account-group-outline" width={19} sx={{ color: ORO }} />
          </Box>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: TEXT }}>{t("evea.your_team")}</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          {[{ k: "week", l: "Sett" }, { k: "month", l: "Mese" }, { k: "quarter", l: "Trim" }, { k: "year", l: "Anno" }].map((p) => (
            <Chip key={p.k} label={p.l} size="small" onClick={() => setPeriod(p.k)}
              sx={{ height: 24, fontSize: "0.62rem", fontWeight: 700, cursor: "pointer", transition: "all .2s ease",
                bgcolor: period === p.k ? ORO : alpha(ORO, 0.08), color: period === p.k ? "#fff" : TEXT,
                boxShadow: period === p.k ? `0 2px 6px ${alpha(ORO, 0.3)}` : "none",
                "&:hover": { bgcolor: period === p.k ? ORO : alpha(ORO, 0.15) },
              }} />
          ))}
        </Stack>
      </Stack>

      {loading ? <Skeleton height={200} /> : team ? (
        <Stack spacing={2}>
          {/* KPI cards */}
          <Grid container spacing={1}>
            {[
              { label: "QV Team", value: team.qv_team, prev: team.qv_team_prev, color: ORO, icon: "mdi:chart-bar" },
              { label: t("evea.revenue_team"), value: `€${team.revenue_team}`, prev: team.revenue_team_prev, color: "#4CAF50", icon: "mdi:cash", rawVal: team.revenue_team },
              { label: "Nuovi Clienti", value: team.new_clients_period, prev: team.new_clients_prev, color: "#2196F3", icon: "mdi:account-plus" },
              { label: "Nuovi Promoter", value: team.new_promoters_period, prev: team.new_promoters_prev, color: "#9C27B0", icon: "mdi:account-star" },
            ].map((m) => (
              <Grid item xs={6} key={m.label}>
                <Box sx={{
                  p: 1.4, borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(m.color, 0.08)} 0%, ${alpha(m.color, 0.02)} 100%)`,
                  border: `1px solid ${alpha(m.color, 0.18)}`,
                  transition: "transform .2s ease, border-color .2s ease",
                  "&:hover": { transform: "translateY(-1px)", borderColor: alpha(m.color, 0.35) },
                }}>
                  <Stack direction="row" alignItems="center" spacing={0.6}>
                    <Iconify icon={m.icon} width={16} sx={{ color: m.color }} />
                    <Typography sx={{ fontSize: "0.62rem", color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>{m.label}</Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: m.color, mt: 0.4, letterSpacing: "-0.2px" }}>
                    {m.value}<Delta cur={m.rawVal ?? m.value} prev={m.prev} />
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Team totale / Diretti / Attivi / Inattivi */}
          <Box sx={{ p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-around">
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: TEXT }}>{team.total_team ?? team.total_direct}</Typography>
                <Typography sx={{ fontSize: "0.58rem", color: MUTED }}>Team</Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: TEXT }}>{team.total_direct}</Typography>
                <Typography sx={{ fontSize: "0.58rem", color: MUTED }}>Diretti</Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#4CAF50" }}>{team.active_count}</Typography>
                <Typography sx={{ fontSize: "0.58rem", color: MUTED }}>Attivi</Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: team.inactive_count > 0 ? "#E24B4A" : MUTED }}>{team.inactive_count}</Typography>
                <Typography sx={{ fontSize: "0.58rem", color: MUTED }}>Inattivi</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Alert inattivi */}
          {team.inactive_count > 0 && (
            <Box sx={{ p: 1.5, bgcolor: alpha("#E24B4A", 0.04), borderRadius: 2, border: `1px solid ${alpha("#E24B4A", 0.12)}` }}>
              <Stack direction="row" alignItems="center" spacing={0.8} mb={1}>
                <Iconify icon="mdi:alert-circle" width={16} sx={{ color: "#E24B4A" }} />
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#E24B4A" }}>Membri inattivi ({team.inactive_count})</Typography>
              </Stack>
              <Stack spacing={0.6}>
                {(team.inactive || []).slice(0, 5).map((m) => (
                  <Stack key={m.user_id} direction="row" alignItems="center" spacing={0.8}>
                    <Avatar sx={{ width: 22, height: 22, bgcolor: alpha("#E24B4A", 0.1), color: "#E24B4A", fontSize: 10 }}>
                      {(m.name || m.username || "?").charAt(0)}
                    </Avatar>
                    <Typography sx={{ fontSize: "0.7rem", color: TEXT, flex: 1 }} noWrap>{m.name || m.username}</Typography>
                    <Chip label={m.is_promoter ? "Promoter" : "Cliente"} size="small" sx={{ height: 16, fontSize: "0.5rem", bgcolor: m.is_promoter ? alpha(ORO, 0.1) : alpha("#2196F3", 0.1), color: m.is_promoter ? ORO : "#2196F3" }} />
                    <Typography sx={{ fontSize: "0.6rem", color: "#E24B4A", fontWeight: 600 }}>
                      {m.days_inactive != null ? `${m.days_inactive}gg` : "Mai ordinato"}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}

          {/* Top referral */}
          {(team.top_referrals || []).length > 0 && (
            <>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: TEXT }}>Top referral del periodo</Typography>
              <Stack spacing={0.6}>
                {team.top_referrals.map((r, i) => (
                  <Stack key={r.user_id} direction="row" alignItems="center" spacing={0.8}>
                    <Avatar sx={{ width: 22, height: 22, bgcolor: alpha(ORO, 0.1), color: ORO, fontSize: 10, fontWeight: 700 }}>{i + 1}</Avatar>
                    <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600, flex: 1 }} noWrap>{r.name || r.username}</Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: ORO, fontWeight: 700 }}>{r.qv} QV</Typography>
                    <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>€{r.revenue}</Typography>
                  </Stack>
                ))}
              </Stack>
            </>
          )}

          {/* Stats barre */}
          {!sLoad && stats && (
            <Stack spacing={1}>
              {[
                { label: t("evea.reorder_rate"), value: stats.tasso_riordine || 0, color: "#4CAF50", icon: "mdi:refresh" },
                { label: t("evea.smartship_clients"), value: stats.clienti_smartship || 0, color: "#2196F3", icon: "mdi:calendar-check" },
                { label: t("evea.active_promoters"), value: stats.promoter_attivi || 0, color: ORO, icon: "mdi:account-check" },
              ].map((s) => (
                <Box key={s.label}>
                  <Stack direction="row" alignItems="center" spacing={0.5} mb={0.3}>
                    <Iconify icon={s.icon} width={14} sx={{ color: s.color }} />
                    <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600, flex: 1 }}>{s.label}</Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: s.color, fontWeight: 700 }}>{s.value}%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={Math.min(s.value, 100)} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(s.color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: s.color, borderRadius: 2 } }} />
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      ) : null}
    </Card>
  );
};

// ═══════════════════════════════════════
// 10. 3FF + ROB (full customer-style)
// ═══════════════════════════════════════
const ThreeFFCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: ff, loading } = useThreeFF();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { isActive } = useOnboardingStatus();
  const referralLink = user?.username ? `${WP_URL}?ref=${user.username}` : "";
  const copy = async () => {
    if (!isActive) {
      enqueueSnackbar("Firma la Lettera di Incarico per attivare il tuo link promotore", { variant: "warning" });
      navigate("/user/onboarding");
      return;
    }
    if (referralLink) { await navigator.clipboard.writeText(referralLink); enqueueSnackbar(t("evea.link_copied")); }
  };
  const required = ff?.required_customers || 3;
  const current = ff?.current_qualified_customer_count || 0;
  const bonus = ff?.current_bonus_amount || 0;
  const customers = ff?.current_customers_largest_orders || [];
  const slots = Array.from({ length: required }, (_, i) => customers[i] || null);
  return (
    <Card sx={{ ...cardSx, p: 3, position: "relative", overflow: "hidden",
      "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ORO} 0%, ${alpha(ORO, 0.4)} 100%)` },
    }}>
      <Stack direction="row" alignItems="center" spacing={1.2} mb={2.5}>
        <Box sx={{ width: 38, height: 38, borderRadius: 2, background: `linear-gradient(135deg, ${alpha(ORO, 0.18)} 0%, ${alpha(ORO, 0.06)} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon="mdi:gift-outline" width={20} sx={{ color: ORO }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} color={ESPRESSO}>Invita 3 amici</Typography>
          <Typography variant="caption" sx={{ color: MUTED, lineHeight: 1 }}>Bonus 3 For Free</Typography>
        </Box>
      </Stack>
      {loading ? <Skeleton height={56} variant="rounded" /> : (
        <>
          <Stack direction="row" spacing={2.5} justifyContent="center" mb={2}>
            {slots.map((c, i) => {
              const isNext = !c && slots.slice(0, i).every(Boolean);
              return (
                <Stack key={i} alignItems="center" spacing={0.5}>
                  <Avatar sx={{
                    width: 54, height: 54,
                    cursor: "pointer",
                    transition: "transform .2s ease, box-shadow .2s ease",
                    "&:hover": { transform: "translateY(-3px) scale(1.08)", boxShadow: `0 6px 14px ${alpha(ORO, 0.4)}` },
                    background: c ? `linear-gradient(135deg, ${alpha(ORO, 0.2)} 0%, ${alpha(ORO, 0.08)} 100%)` : "#f5f5f5",
                    color: c ? ORO : "#ccc",
                    border: c ? `2px solid ${ORO}` : isNext ? `2px solid ${alpha(ORO, 0.6)}` : "2px dashed #ddd",
                    boxShadow: c ? `0 2px 8px ${alpha(ORO, 0.2)}` : "none",
                    ...(isNext && {
                      animation: "ffPulse 2s ease-in-out infinite",
                      "@keyframes ffPulse": {
                        "0%, 100%": { boxShadow: `0 0 0 4px ${alpha(ORO, 0.15)}` },
                        "50%": { boxShadow: `0 0 0 8px ${alpha(ORO, 0.05)}` },
                      },
                    }),
                  }}>
                    {c ? <Iconify icon="mdi:check-bold" width={24} /> : <Iconify icon="mdi:account-plus-outline" width={24} />}
                  </Avatar>
                  <Typography variant="caption" sx={{ color: c ? ESPRESSO : "#aaa", maxWidth: 70, fontWeight: c ? 700 : 400, fontSize: "0.72rem" }} noWrap>{c?.customer_name || `${t("evea.friend")} ${i + 1}`}</Typography>
                </Stack>
              );
            })}
          </Stack>
          <Box sx={{
            textAlign: "center",
            background: `linear-gradient(135deg, ${alpha(ORO, 0.06)} 0%, ${alpha(ORO, 0.02)} 100%)`,
            borderRadius: 2, py: 1.5, mb: 2,
            border: `1px solid ${alpha(ORO, 0.12)}`,
          }}>
            <Typography variant="body2" sx={{ color: MUTED }}>
              <b style={{ color: ESPRESSO }}>{current}/{required}</b> {t("evea.friends_invited")}
              <Divider component="span" orientation="vertical" sx={{ mx: 1.5, height: 14, display: "inline-block", borderColor: "#ddd" }} />
              {t("evea.reward")}: <b style={{ color: ORO, fontSize: "1.15em", letterSpacing: "-0.2px" }}>€{bonus}</b>
            </Typography>
          </Box>
        </>
      )}
      <Tooltip title={!isActive ? "Firma la Lettera di Incarico per attivare il tuo link promotore" : ""} arrow>
        <span>
          <Button fullWidth variant="contained" startIcon={<Iconify icon={isActive ? "mdi:content-copy" : "mdi:lock-outline"} />} onClick={copy}
            sx={{ bgcolor: isActive ? ORO : "#999", color: "#fff", "&:hover": { bgcolor: isActive ? "#A07E2F" : "#888" }, fontWeight: 700, borderRadius: 2, py: 1.2, textTransform: "none", fontSize: "0.875rem", boxShadow: `0 4px 12px ${alpha(isActive ? ORO : "#999", 0.3)}` }}>
            {isActive ? t("evea.copy_invite") : "Attiva link — Firma la Lettera"}
          </Button>
        </span>
      </Tooltip>
    </Card>
  );
};

const CYCLE_LEN = 12;
const PAGE_SIZE = 8;
const COUPON_MONTHS = [3, 6, 9];

const ROBCard = () => {
  const { t } = useTranslation();
  const { data: rob, loading } = useROB();
  const [page, setPage] = useState(0);
  const totalConsec = rob?.current_consecutive_months || 0;
  const cycleNum = Math.floor(totalConsec / CYCLE_LEN) + 1;
  const posInCycle = totalConsec % CYCLE_LEN;
  const allMilestones = Array.from({ length: CYCLE_LEN }, (_, i) => {
    const isCoupon = COUPON_MONTHS.includes(i);
    const isFirstEver = cycleNum === 1 && i === 0;
    return { month: i + 1, completed: i < posInCycle, isCurrent: i === posInCycle, label: isFirstEver ? "1ª consegna" : isCoupon ? "-10% + €30" : "-10%", isCoupon };
  });
  const totalPages = Math.ceil(CYCLE_LEN / PAGE_SIZE);
  const visible = allMilestones.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const completedOnPage = visible.filter((m) => m.completed).length;
  const connectorPct = visible.length > 1 ? Math.round((completedOnPage / (visible.length - 1)) * 100) : 0;

  return (
    <Card sx={{ ...cardSx, p: 3, position: "relative", overflow: "hidden",
      "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ORO} 0%, ${alpha(ORO, 0.4)} 100%)` },
    }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <Box sx={{ width: 38, height: 38, borderRadius: 2, background: `linear-gradient(135deg, ${alpha(ORO, 0.18)} 0%, ${alpha(ORO, 0.06)} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:calendar-heart" width={20} sx={{ color: ORO }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color={ESPRESSO}>{t("evea.loyalty_path")}</Typography>
            <Typography variant="caption" sx={{ color: MUTED, lineHeight: 1 }}>{t("evea.loyalty_sub")}</Typography>
          </Box>
        </Stack>
        {!loading && totalConsec > 0 && <Chip label={`${t("evea.cycle")} ${cycleNum} · ${posInCycle}/${CYCLE_LEN}`} size="small" sx={{ bgcolor: alpha(ORO, 0.12), color: ORO, fontWeight: 700, fontSize: "0.7rem", height: 24, border: `1px solid ${alpha(ORO, 0.25)}` }} />}
      </Stack>
      {loading ? <Skeleton height={100} variant="rounded" /> : (
        <>
          <Stack direction="row" alignItems="center" spacing={0.5} mb={2}>
            <IconButton size="small" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} sx={{ width: 28, height: 28, color: page === 0 ? "#ddd" : ORO }}>
              <Iconify icon="mdi:chevron-left" width={20} />
            </IconButton>
            <Box sx={{ flex: 1, position: "relative", px: 0.5 }}>
              <Box sx={{ position: "absolute", top: 18, left: 20, right: 20, height: 2, background: `linear-gradient(90deg, ${ORO} ${connectorPct}%, #eee ${connectorPct}%)`, zIndex: 0 }} />
              <Stack direction="row" justifyContent="space-between" sx={{ position: "relative", zIndex: 1 }}>
                {visible.map((m) => (
                  <Stack key={m.month} alignItems="center" sx={{ flex: 1 }}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "0.75rem",
                      cursor: "pointer",
                      transition: "transform .2s ease, box-shadow .2s ease",
                      "&:hover": { transform: "translateY(-3px) scale(1.08)", boxShadow: `0 6px 14px ${alpha(ORO, 0.45)}` },
                      ...(m.completed
                        ? { background: `linear-gradient(135deg, ${ORO} 0%, ${alpha(ORO, 0.75)} 100%)`, color: "#fff", boxShadow: `0 2px 8px ${alpha(ORO, 0.35)}` }
                        : m.isCurrent
                          ? {
                              bgcolor: "#fff", color: ORO, border: `2px solid ${ORO}`,
                              boxShadow: `0 0 0 4px ${alpha(ORO, 0.12)}`,
                              animation: "robPulse 2s ease-in-out infinite",
                              "@keyframes robPulse": {
                                "0%, 100%": { boxShadow: `0 0 0 4px ${alpha(ORO, 0.12)}` },
                                "50%": { boxShadow: `0 0 0 8px ${alpha(ORO, 0.05)}` },
                              },
                            }
                          : { bgcolor: "#f5f5f5", color: "#bbb" }),
                    }}>
                      {m.completed ? <Iconify icon="mdi:check" width={18} /> : m.month}
                    </Box>
                    <Typography sx={{ mt: 0.5, fontSize: "0.62rem", fontWeight: m.isCoupon ? 700 : 500, color: m.isCoupon && m.completed ? ORO : m.completed ? ORO : m.isCurrent ? ESPRESSO : "#bbb", textAlign: "center", lineHeight: 1.2 }}>{m.label}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
            <IconButton size="small" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} sx={{ width: 28, height: 28, color: page >= totalPages - 1 ? "#ddd" : ORO }}>
              <Iconify icon="mdi:chevron-right" width={20} />
            </IconButton>
          </Stack>
          <Stack direction="row" justifyContent="center" spacing={0.5} mb={2}>
            {Array.from({ length: totalPages }, (_, i) => (
              <Box key={i} onClick={() => setPage(i)} sx={{ width: i === page ? 16 : 6, height: 6, borderRadius: 3, bgcolor: i === page ? ORO : "#ddd", transition: "all 0.3s", cursor: "pointer" }} />
            ))}
          </Stack>

          {/* Risparmio */}
          {(() => {
            const discountMonths = cycleNum === 1 ? Math.max(0, posInCycle - 1) : 11 + (cycleNum - 2) * 12 + posInCycle;
            const couponsEarned = (cycleNum - 1) * 3 + COUPON_MONTHS.filter((i) => i < posInCycle).length;
            const couponValue = couponsEarned * 30;
            const realTotal = Number(rob?.total_saved_eur ?? 0);
            const realDiscount = Number(rob?.discount_saved_eur ?? 0);
            const realCoupons = Number(rob?.coupons_saved_eur ?? 0);
            const hasAnything = realTotal > 0 || totalConsec > 0 || couponValue > 0;
            if (!hasAnything) return (
              <Box sx={{ bgcolor: alpha(ORO, 0.06), borderRadius: 2, p: 1.5, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.8rem", color: MUTED }}>Inizia il tuo abbonamento per risparmiare ogni mese!</Typography>
              </Box>
            );
            const useReal = realTotal > 0;
            const totalSaved = useReal ? realTotal : (discountMonths * 6 + couponValue);
            return (
              <Box sx={{ bgcolor: alpha(ORO, 0.06), borderRadius: 2, p: 2, textAlign: "center" }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} mb={0.5}>
                  <Iconify icon="mdi:piggy-bank-outline" width={18} sx={{ color: ORO }} />
                  <Typography sx={{ fontSize: "0.8rem", color: MUTED, fontWeight: 600 }}>{t("evea.your_savings")}</Typography>
                </Stack>
                <Stack alignItems="center">
                  <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: ORO, lineHeight: 1.1, letterSpacing: "-0.3px", fontVariantNumeric: "tabular-nums" }}>
                    €{Math.round(totalSaved)}
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: MUTED, mt: 0.2 }}>
                    {(useReal ? realDiscount : discountMonths) > 0 && (
                      useReal
                        ? <>€{realDiscount.toFixed(0)} di sconti (-10%)</>
                        : <>{discountMonths} {discountMonths === 1 ? "consegna" : "consegne"} -10%</>
                    )}
                    {((useReal ? realDiscount : discountMonths) > 0) && ((useReal ? realCoupons : couponValue) > 0) && " · "}
                    {(useReal ? realCoupons : couponValue) > 0 && (
                      <>€{useReal ? realCoupons.toFixed(0) : couponValue} in coupon</>
                    )}
                  </Typography>
                </Stack>
              </Box>
            );
          })()}
        </>
      )}

      <Box sx={{ mt: "auto", pt: 1 }}>
        <Button fullWidth variant="outlined" startIcon={<Iconify icon="mdi:cog-outline" />}
          href="/user/recurring-orders"
          sx={{ borderColor: "#e0e0e0", color: ESPRESSO, "&:hover": { borderColor: ORO, bgcolor: alpha(ORO, 0.04) }, fontWeight: 600, borderRadius: 2, py: 1, textTransform: "none" }}>
          {t("evea.manage_subscription")}
        </Button>
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════
// 11. PRODOTTI PIÙ VENDUTI
// ═══════════════════════════════════════
const PROD_COLORS = [ESPRESSO, ORO, "#D4B86A", "#4A5C3A", "#EF9F27", "#378ADD"];

const TopProducts = () => {
  const { t } = useTranslation();
  const { data, loading } = useFetch(async () => {
    const { data: r } = await axiosInstance.get("api/wp/dashboard/my-top-products?period=month");
    return r?.data;
  });
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={150} /></Card>;
  if (!data || !data.length) return null;
  const top = data.slice(0, 5);
  const maxRev = Math.max(...top.map((p) => p.revenue), 1);

  return (
    <Card sx={{ ...cardSx, p: 3, position: "relative", overflow: "hidden",
      "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ORO} 0%, ${alpha(ORO, 0.5)} 100%)` },
    }}>
      <Stack direction="row" alignItems="center" spacing={1.2} mb={2}>
        <Box sx={{ width: 38, height: 38, borderRadius: 2, background: `linear-gradient(135deg, ${alpha(ORO, 0.18)} 0%, ${alpha(ORO, 0.06)} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon="mdi:package-variant-closed" width={20} sx={{ color: ORO }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} color={ESPRESSO}>{t("evea.best_selling")}</Typography>
          <Typography variant="caption" sx={{ color: MUTED, lineHeight: 1 }}>{t("evea.this_month")}</Typography>
        </Box>
      </Stack>
      <Stack spacing={1.4}>
        {top.map((p, i) => {
          const color = PROD_COLORS[i % PROD_COLORS.length];
          return (
            <Stack key={i} direction="row" alignItems="center" spacing={1.2} sx={{ py: 0.3 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color, flexShrink: 0, boxShadow: `0 0 0 3px ${alpha(color, 0.15)}` }} />
              <Typography sx={{ fontSize: "0.82rem", color: TEXT, fontWeight: 600, flex: 1 }} noWrap>{p.product || "N/A"}</Typography>
              <Typography sx={{ fontSize: "0.7rem", color: MUTED, fontWeight: 600 }}>{p.orders}x</Typography>
              <Box sx={{ width: 60 }}>
                <LinearProgress variant="determinate" value={(p.revenue / maxRev) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: alpha(color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 } }} />
              </Box>
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, color: ORO, minWidth: 40, textAlign: "right" }}>€{p.revenue}</Typography>
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
};

// ═══════════════════════════════════════
// SECTION TITLE
// ═══════════════════════════════════════
// ═══════════════════════════════════════
// GOAL SETTER
// ═══════════════════════════════════════
const useGoals = () => useFetch(async () => {
  const { data } = await fetchUser.get("goals");
  return data?.data;
});

const GoalSetter = () => {
  const { data, loading } = useGoals();
  const { enqueueSnackbar } = useSnackbar();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ target_sales: "", target_clients: "", target_pqv: "", target_rank_id: "" });

  useEffect(() => {
    if (data?.goal) {
      setForm({
        target_sales: data.goal.target_sales || "",
        target_clients: data.goal.target_clients || "",
        target_pqv: data.goal.target_pqv || "",
        target_rank_id: data.goal.target_rank_id || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const reqData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) reqData.append(k, v); });
      await fetchUser.post("goals", reqData);
      enqueueSnackbar("Obiettivo salvato!", { variant: "success" });
      setEditing(false);
      window.location.reload();
    } catch { enqueueSnackbar("Errore nel salvataggio", { variant: "error" }); }
    setSaving(false);
  };

  if (loading) return <Skeleton height={160} variant="rounded" sx={{ borderRadius: 3 }} />;

  const goal = data?.goal;
  const progress = data?.progress || {};
  const hasGoal = goal && (goal.target_sales > 0 || goal.target_clients > 0 || goal.target_pqv > 0 || goal.target_rank_id);
  const daysLeft = data?.days_left ?? 0;
  const currentRank = data?.current_rank;
  const targetRank = data?.target_rank;
  const allRanks = data?.all_ranks || [];

  const months = ["", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  const monthLabel = months[data?.month || 0] + " " + (data?.year || "");

  const pct = (current, target) => {
    if (!target || target <= 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  };

  const ProgressRow = ({ icon, label, current, target, unit = "", color = ORO }) => {
    const p = pct(current, target);
    const done = p >= 100;
    return (
      <Box sx={{ mb: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon={icon} width={16} sx={{ color: done ? "#4CAF50" : color }} />
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: TEXT }}>{label}</Typography>
          </Stack>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: done ? "#4CAF50" : ESPRESSO }}>
            {done ? "✅ " : ""}{unit}{current}{target > 0 ? ` / ${unit}${target}` : ""}
            {target > 0 && <Typography component="span" sx={{ fontSize: "0.7rem", color: MUTED, ml: 0.5 }}>({p}%)</Typography>}
          </Typography>
        </Stack>
        {target > 0 && (
          <LinearProgress variant="determinate" value={p}
            sx={{ height: 6, borderRadius: 3, bgcolor: alpha(color, 0.1),
              "& .MuiLinearProgress-bar": { bgcolor: done ? "#4CAF50" : color, borderRadius: 3 } }} />
        )}
      </Box>
    );
  };

  return (
    <>
      <Card sx={{ ...cardSx, p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={hasGoal ? 2 : 1}>
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Box sx={{ width: 38, height: 38, borderRadius: 2, background: `linear-gradient(135deg, ${alpha(ORO, 0.18)} 0%, ${alpha(ORO, 0.06)} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:target" width={20} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>Obiettivo {monthLabel}</Typography>
              {daysLeft <= 5 && daysLeft > 0 && (
                <Typography sx={{ fontSize: "0.68rem", color: "#E24B4A", fontWeight: 600 }}>
                  ⏳ {daysLeft === 1 ? "Ultimo giorno!" : `Mancano ${daysLeft} giorni`}
                </Typography>
              )}
            </Box>
          </Stack>
          <Button size="small" onClick={() => setEditing(true)}
            sx={{ textTransform: "none", color: ORO, fontWeight: 600, fontSize: "0.75rem" }}>
            {hasGoal ? "Modifica" : "Imposta obiettivo"}
          </Button>
        </Stack>

        {hasGoal ? (
          <>
            {goal.target_sales > 0 && (
              <ProgressRow icon="mdi:cash-register" label="Vendite Team" current={progress.sales} target={parseFloat(goal.target_sales)} unit="€" />
            )}
            {goal.target_clients > 0 && (
              <ProgressRow icon="mdi:account-plus" label="Nuovi Clienti" current={progress.clients} target={parseInt(goal.target_clients)} color="#4CAF50" />
            )}
            {goal.target_pqv > 0 && (
              <ProgressRow icon="mdi:chart-areaspline" label="PQV" current={progress.pqv} target={parseFloat(goal.target_pqv)} color="#2196F3" />
            )}
            {targetRank && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1, p: 1.5, bgcolor: alpha(ORO, 0.06), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.15)}` }}>
                <Iconify icon="mdi:crown-outline" width={18} sx={{ color: ORO }} />
                <Typography sx={{ fontSize: "0.78rem", color: TEXT }}>
                  <strong>{currentRank?.name || "—"}</strong> → <strong style={{ color: ORO }}>{targetRank.name}</strong>
                  {goal.target_pqv > 0 && progress.pqv < parseFloat(goal.target_pqv) && (
                    <Typography component="span" sx={{ fontSize: "0.72rem", color: MUTED, ml: 1 }}>
                      (mancano {Math.max(0, parseFloat(goal.target_pqv) - progress.pqv).toFixed(0)} PQV)
                    </Typography>
                  )}
                </Typography>
              </Stack>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Iconify icon="mdi:flag-checkered" width={40} sx={{ color: "#ddd", mb: 1 }} />
            <Typography sx={{ fontSize: "0.82rem", color: MUTED }}>
              Imposta i tuoi obiettivi per questo mese
            </Typography>
          </Box>
        )}
      </Card>

      <Dialog open={editing} onClose={() => setEditing(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Obiettivo {monthLabel}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Vendite Team (€)" type="number" size="small" value={form.target_sales}
              onChange={(e) => setForm({ ...form, target_sales: e.target.value })} />
            <TextField label="Nuovi Clienti" type="number" size="small" value={form.target_clients}
              onChange={(e) => setForm({ ...form, target_clients: e.target.value })} />
            <TextField label="PQV Obiettivo" type="number" size="small" value={form.target_pqv}
              onChange={(e) => setForm({ ...form, target_pqv: e.target.value })} />
            <TextField label="Rank Obiettivo" select size="small" value={form.target_rank_id}
              onChange={(e) => setForm({ ...form, target_rank_id: e.target.value })}>
              <MenuItem value="">Nessuno</MenuItem>
              {allRanks.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
            </TextField>
            <Button variant="contained" onClick={handleSave} disabled={saving}
              sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none" }}>
              {saving ? "Salvataggio..." : "Salva obiettivo"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ═══════════════════════════════════════
// COUPONS
// ═══════════════════════════════════════
const CouponsSection = ({ coupons, loading }) => {
  if (loading) return (
    <Grid container spacing={2}>
      {[0, 1].map((i) => (
        <Grid item xs={12} sm={6} key={i}>
          <Skeleton variant="rounded" height={100} sx={{ borderRadius: 3 }} />
        </Grid>
      ))}
    </Grid>
  );

  if (!coupons?.length) return (
    <Box sx={{ textAlign: "center", py: 4, bgcolor: "#fafafa", borderRadius: 3 }}>
      <Iconify icon="mdi:ticket-outline" width={36} sx={{ color: "#ddd", mb: 1 }} />
      <Typography variant="body2" color="text.secondary">Nessun coupon disponibile</Typography>
    </Box>
  );

  return (
    <Grid container spacing={2}>
      {coupons.map((coupon, i) => {
        const amount = parseFloat(coupon.discount || coupon.amount || coupon.total_amount || 0);
        const code = coupon.code || "";
        const rawDate = coupon.end_date || coupon.expiry_date || coupon.expire_date;
        const expiryLabel = rawDate ? new Date(rawDate).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" }) : "Nessuna scadenza";
        const isUsed = coupon.uses_count > 0 || coupon.used === 1;
        const typeName = (coupon.type || coupon.coupon_type || "").replace(/_/g, " ").replace("programe", "").trim().toUpperCase() || "COUPON";

        return (
          <Grid item xs={12} sm={6} md={4} key={coupon.id || i}>
            <Card sx={{
              borderRadius: 3, overflow: "hidden", height: "100%",
              border: `1px solid ${isUsed ? "#e0e0e0" : alpha(ORO, 0.3)}`,
              opacity: isUsed ? 0.55 : 1,
              bgcolor: "#fff",
              position: "relative",
              transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
              "&:hover": isUsed ? {} : { transform: "translateY(-2px)", boxShadow: `0 6px 16px ${alpha(ORO, 0.18)}`, borderColor: alpha(ORO, 0.5) },
            }}>
              <Box sx={{ display: "flex", height: "100%" }}>
                <Box sx={{ width: 6, background: isUsed ? "#ccc" : `linear-gradient(180deg, ${ORO} 0%, ${alpha(ORO, 0.6)} 100%)`, flexShrink: 0 }} />
                <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography sx={{ fontSize: "0.72rem", color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, mb: 0.3 }}>{typeName}</Typography>
                      <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: isUsed ? "#aaa" : ORO, lineHeight: 1, letterSpacing: "-0.5px" }}>€{amount.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: isUsed ? alpha("#ccc", 0.12) : `linear-gradient(135deg, ${alpha(ORO, 0.15)} 0%, ${alpha(ORO, 0.05)} 100%)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Iconify icon={isUsed ? "mdi:check-circle-outline" : "mdi:ticket-percent-outline"} width={24} sx={{ color: isUsed ? "#aaa" : ORO }} />
                    </Box>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
                    {code && <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: ESPRESSO, bgcolor: alpha(ORO, 0.06), px: 1.2, py: 0.3, borderRadius: 1.5, fontFamily: "monospace", letterSpacing: "0.1em" }}>{code}</Typography>}
                    <Typography sx={{ fontSize: "0.65rem", color: "#aaa" }}>{isUsed ? "Utilizzato" : `Scade il ${expiryLabel}`}</Typography>
                  </Stack>
                </Box>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

const Section = ({ icon, children }) => (
  <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mt: 1.5, mb: 0.3 }}>
    <Box sx={{ width: 4, height: 20, borderRadius: 2, background: `linear-gradient(180deg, ${ORO} 0%, ${alpha(ORO, 0.4)} 100%)` }} />
    {icon && <Iconify icon={icon} width={20} sx={{ color: ORO }} />}
    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: TEXT, letterSpacing: "-0.2px" }}>{children}</Typography>
  </Stack>
);

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
const PromoterDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: heroData } = useHero();
  const { data: couponsData, loading: couponsLoading } = useCoupons();
  return (
    <Page title="Dashboard">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4, mx: { xs: -2, md: -3 }, mt: -2, pt: 2, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Stack spacing={2}>
          <HeroCard />
          <FounderCountdown />
          <CommunityBanner />
          <OnboardingBanner />
          <TickerBar />

          <Grid container spacing={2}>
            {/* Left column — all alerts stacked */}
            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                {/* Loyalty Discount Banner */}
                {(() => {
                  const hasDiscount = user?.has_smartship_discount === 1 || user?.is_smartship_customer === 1;
                  return hasDiscount ? (
                    <Box sx={{ bgcolor: "#EAF3DE", border: "1px solid #4A5C3A", borderRadius: 3, p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Iconify icon="mdi:check-circle" width={24} sx={{ color: "#4A5C3A" }} />
                      <Box>
                        <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#27500A" }}>{t("evea.loyalty_active")}</Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: "#4A5C3A" }}>{t("evea.loyalty_active_sub")}</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ bgcolor: "#FAF6EF", border: `1px solid ${alpha(ORO, 0.2)}`, borderRadius: 3, p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Iconify icon="mdi:tag-heart-outline" width={24} sx={{ color: ORO }} />
                        <Box>
                          <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: ESPRESSO }}>{t("evea.loyalty_inactive")}</Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>{t("evea.loyalty_inactive_sub")}</Typography>
                        </Box>
                      </Stack>
                      <Button size="small" variant="contained" href={`${WP_URL}/collections/all`} target="_blank"
                        sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
                        {t("evea.activate_now")}
                      </Button>
                    </Box>
                  );
                })()}
                <UrgencyAlert />
                <CelebrationBanner />
              </Stack>
            </Grid>
            {/* Right column — goal setter */}
            <Grid item xs={12} md={6}>
              <GoalSetter />
            </Grid>
          </Grid>

          <Section icon="mdi:cash-multiple">{t("evea.earnings")}</Section>
          <EarningsSection />

          {user?.is_promoter === 1 && heroData && (() => {
            const pkgLevel = PACKAGE_ID_TO_LEVEL[heroData.package_id] || 0;
            const daysRemaining = heroData.upgrade_days_remaining;
            const hasKit = !!heroData.has_starter_kit || pkgLevel > 0;
            const isGold = pkgLevel === 3;
            const canUpgrade = hasKit && !isGold && daysRemaining !== null && daysRemaining > 0;
            const needsKit = !hasKit;
            if (!needsKit && !canUpgrade) return null;
            return (
              <>
                <Section icon="mdi:package-variant-closed">
                  {needsKit ? "Kit Starter" : "Upgrade disponibili"}
                </Section>
                <KitUpgrade
                  packageId={heroData.package_id}
                  upgradeDaysRemaining={daysRemaining}
                  packagePurchasedAt={heroData.package_purchased_at}
                />
              </>
            );
          })()}

          <SmartAlerts />

          <Section icon="mdi:lightning-bolt">{t("evea.quick_access")}</Section>
          <QuickAccess />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Section icon="mdi:podium-gold">Top Performer</Section>
              <Box sx={{ mt: 1 }}><TopPerformers /></Box>
              <Box sx={{ mt: 2 }}><TopProducts /></Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Section icon="mdi:chart-bar">{t("evea.your_team")}</Section>
              <Box sx={{ mt: 1 }}><TeamSection /></Box>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><ThreeFFCard /></Grid>
            <Grid item xs={12} md={6}><ROBCard /></Grid>
          </Grid>

          <Section icon="mdi:ticket-percent">I Tuoi Coupon Premio</Section>
          <Box sx={{ mt: 1 }}><CouponsSection coupons={couponsData} loading={couponsLoading} /></Box>
        </Stack>
      </Box>
    </Page>
  );
};

export default PromoterDashboard;
