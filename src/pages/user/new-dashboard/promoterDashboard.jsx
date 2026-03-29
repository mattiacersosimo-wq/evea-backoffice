import {
  Avatar, Box, Button, Card, Chip, Divider, Grid, IconButton,
  LinearProgress, Skeleton, Stack, Tooltip, Typography,
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
const useFetch = (fetcher) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let off = false;
    (async () => {
      try { const r = await fetcher(); if (!off) setData(r); }
      catch { /* silent */ }
      if (!off) setLoading(false);
    })();
    return () => { off = true; };
  }, []);
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
const useTopPerformers = () => useFetch(async () => {
  const { data } = await axiosInstance.get("api/wp/dashboard/top-performers");
  return data?.data;
});
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
    { url: "affiliate-dashboard/pmb-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/isb-Progressbar", field: "pending_commission" },
  ];
  const monthlyUrls = [
    { url: "affiliate-dashboard/residual-Progressbar", field: "pending_commission_total" },
    { url: "affiliate-dashboard/leadership-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/residualmatching-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/rgomvp-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/eveolving-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/rob-Progressbar", field: "pending_bonus_amount" },
    { url: "affiliate-dashboard/threeff-Progressbar", field: "current_bonus_amount" },
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
          prevMonth: Number(d?.previous_month_pending_commission ?? src?.previous_month_pending_commission) || 0,
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
      <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C", mb: 0.3 }}>{label}</Typography>
      <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: ESPRESSO, bgcolor: alpha(ORO, 0.08), borderRadius: 1, px: 1, py: 0.3, border: `1px solid ${alpha(ORO, 0.2)}` }}>
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
  if (!status || status.pct >= 100 || status.onboarding_done) return null;
  return (
    <Card onClick={() => navigate("/user/onboarding")} sx={{ p: 2, borderRadius: 3, border: `1px solid ${alpha(ORO, 0.3)}`, bgcolor: alpha(ORO, 0.04), cursor: "pointer", "&:hover": { bgcolor: alpha(ORO, 0.08) } }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon="mdi:clipboard-check-outline" width={22} sx={{ color: ORO }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO }}>Completa il tuo profilo</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>{status.completed}/{status.total} completati — clicca per continuare</Typography>
          <LinearProgress variant="determinate" value={status.pct} sx={{ mt: 0.5, height: 5, borderRadius: 3, bgcolor: "#eee", "& .MuiLinearProgress-bar": { bgcolor: ORO, borderRadius: 3 } }} />
        </Box>
        <Iconify icon="mdi:chevron-right" width={24} sx={{ color: ORO }} />
      </Stack>
    </Card>
  );
};

const HeroCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: rank, loading: rankLoading } = useRankSummary();
  const { data: hero, loading: heroLoading } = useHero();
  const loading = rankLoading || heroLoading;

  const fullName = [hero?.first_name, hero?.last_name].filter(Boolean).join(" ") || user?.username || "";

  return (
    <Card sx={{ bgcolor: "#FAF6EF", color: ESPRESSO, borderRadius: 4, p: { xs: 2.5, md: 3.5 }, position: "relative", overflow: "hidden", border: `1px solid ${alpha(ORO, 0.2)}` }}>
      <Box sx={{ position: "absolute", bottom: -40, right: -40, width: 140, height: 140, borderRadius: "50%", bgcolor: alpha(ORO, 0.06) }} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ xs: "center", md: "flex-start" }} sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, width: "100%" }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: alpha(ORO, 0.2), color: ORO, fontSize: 24, fontWeight: 700, border: `2px solid ${alpha(ORO, 0.4)}` }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
              <Typography variant="h6" fontWeight={700}>{fullName}</Typography>
              {rank?.current_rank && <Chip label={rank.current_rank} size="small" sx={{ bgcolor: alpha(ORO, 0.15), color: ORO, fontWeight: 700, fontSize: "0.8rem", height: 24, border: `1px solid ${alpha(ORO, 0.3)}` }} />}
            </Stack>
            <Stack spacing={0.2} sx={{ mt: 0.5 }}>
              <Typography sx={{ fontSize: "0.75rem", color: "#7A6A5C" }}>
                ID: {hero?.unique_id || user?.unique_id || user?.id}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#7A6A5C" }}>
                User: {hero?.username || user?.username}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#7A6A5C" }}>
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
      </Stack>

      {loading ? <Skeleton height={50} sx={{ mt: 2, bgcolor: alpha(ORO, 0.04), borderRadius: 2 }} /> : (
        <Stack direction="row" spacing={1} sx={{ mt: 2.5, flexWrap: "wrap", gap: 1 }}>
          {[
            { icon: "mdi:wallet-outline", label: t("evea.wallet"), value: `€${Number(hero?.wallet || 0).toFixed(2)}` },
            { icon: "mdi:chart-bar", label: "PQV", value: hero?.pqv_mese || hero?.qv_mese || 0 },
            { icon: "mdi:account-group", label: t("evea.clients"), value: hero?.clienti_diretti || 0 },
            { icon: "mdi:account-tie", label: t("evea.team"), value: hero?.team_promoter || 0 },
          ].map((m) => (
            <Box key={m.label} sx={{ flex: "1 1 0", minWidth: 80, bgcolor: alpha(ORO, 0.05), borderRadius: 2, p: 1, textAlign: "center", border: `1px solid ${alpha(ORO, 0.1)}` }}>
              <Iconify icon={m.icon} width={18} sx={{ color: ORO, mb: 0.3 }} />
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>{m.value}</Typography>
              <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C" }}>{m.label}</Typography>
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
    <Box sx={{ bgcolor: "#fff", overflow: "hidden", borderTop: `1px solid ${alpha(ORO, 0.1)}`, borderBottom: `1px solid ${alpha(ORO, 0.1)}`, width: "100vw", position: "relative", left: "50%", transform: "translateX(-50%)" }}>
      <Box sx={{ px: 2, py: 0.8, borderBottom: `1px solid ${alpha(ORO, 0.08)}` }}>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: ORO, letterSpacing: 1.5 }}>EVEA LIVE</Typography>
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
    <Box sx={{ bgcolor: alpha("#FF9800", 0.08), border: `1px solid ${alpha("#FF9800", 0.2)}`, borderRadius: 2, p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
      <Iconify icon="mdi:alert-circle" width={24} sx={{ color: "#FF9800", flexShrink: 0 }} />
      <Typography sx={{ fontSize: "0.92rem", color: TEXT, fontWeight: 600 }}>
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
    <Box sx={{ bgcolor: alpha("#4CAF50", 0.08), border: `1px solid ${alpha("#4CAF50", 0.2)}`, borderRadius: 2, p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
      <Iconify icon="mdi:party-popper" width={24} sx={{ color: "#4CAF50" }} />
      <Typography sx={{ fontSize: "0.92rem", color: TEXT, fontWeight: 600 }}>
        3 For Free completato! Hai guadagnato <b style={{ color: ORO }}>€{ff?.current_bonus_amount || 0}</b>
      </Typography>
    </Box>
  );
};

// ═══════════════════════════════════════
// 5. GUADAGNI
// ═══════════════════════════════════════
const EarningsSection = () => {
  const { t } = useTranslation();
  const { data: bonus, loading: bLoad } = useBonusPending();
  const { data: rank, loading: rLoad } = useRankSummary();

  const PendingCard = ({ label, icon, color, current, previous, isWeekly }) => (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(color, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon={icon} width={22} sx={{ color }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</Typography>
        </Box>
      </Stack>
      {bLoad ? <Skeleton width={80} height={30} /> : (
        <>
          <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: current > 0 ? color : "#ccc" }}>€{current.toFixed(2)}</Typography>
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: ESPRESSO, mt: 0.3 }}>{isWeekly ? t("evea.current_week") : t("evea.current_month")}</Typography>
          <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid #f0ece6" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#7A6A5C" }}>{t("evea.awaiting_approval")}</Typography>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: previous > 0 ? ESPRESSO : "#ccc" }}>€{previous.toFixed(2)}</Typography>
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
        <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", mb: 1.5 }}>Rank</Typography>
          {rLoad ? <Skeleton height={60} /> : (
            <Stack spacing={1.5}>
              {[
                { label: "Current Rank", value: rank?.current_rank || "—" },
                { label: "Achievement Rank", value: rank?.achieved_rank || "—" },
                { label: "Recognition Rank", value: rank?.paid_rank || "—" },
              ].map((r) => (
                <Stack key={r.label} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>{r.label}</Typography>
                  <Chip label={r.value} size="small" sx={{ height: 22, fontWeight: 700, fontSize: "0.72rem", bgcolor: alpha(ORO, 0.1), color: ORO }} />
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
const KitUpgrade = () => {
  const { t } = useTranslation();
  const kits = [
    { name: "Bronze", price: 199, bv: 160, qv: 240, products: 4, color: "#CD7F32", url: `${WP_URL}/collections/starter-kit` },
    { name: "Silver", price: 389, bv: 320, qv: 480, products: 8, color: "#A0A0A0", url: `${WP_URL}/collections/starter-kit` },
    { name: "Gold", price: 789, bv: 640, qv: 960, products: 16, color: ORO, recommended: true, url: `${WP_URL}/collections/starter-kit` },
  ];
  return (
    <Grid container spacing={2}>
      {kits.map((k) => (
        <Grid item xs={12} md={4} key={k.name}>
          <Card sx={{ ...cardSx, p: 2.5, height: "100%", position: "relative", overflow: "hidden", border: k.recommended ? `2px solid ${ORO}` : cardSx.border }}>
            {k.recommended && <Chip label={t("evea.recommended")} size="small" sx={{ position: "absolute", top: 10, right: 10, height: 20, fontSize: "0.7rem", fontWeight: 700, bgcolor: ORO, color: "#fff" }} />}
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
              <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: alpha(k.color, 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Iconify icon="mdi:package-variant-closed" width={20} sx={{ color: k.color }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: TEXT }}>{k.name}</Typography>
                <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: k.color }}>€{k.price}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5} mb={2}>
              <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>BV <b style={{ color: TEXT }}>{k.bv}</b></Typography>
              <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>QV <b style={{ color: TEXT }}>{k.qv}</b></Typography>
              <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>{k.products} prodotti</Typography>
            </Stack>
            <Button fullWidth size="small" variant={k.recommended ? "contained" : "outlined"} href={k.url} target="_blank"
              sx={{ ...(k.recommended ? { bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } } : { borderColor: alpha(ORO, 0.3), color: ORO }), fontWeight: 700, textTransform: "none", borderRadius: 2 }}>{t("evea.buy")}</Button>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// ═══════════════════════════════════════
// SMART ALERTS (Network agent for promoter)
// ═══════════════════════════════════════
const SmartAlerts = () => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
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
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Iconify icon="mdi:bell-alert-outline" width={20} sx={{ color: "#EF9F27" }} />
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>
          {t("evea.smart_alerts") || "Notifiche Smart"}
        </Typography>
        <Chip label={alerts.length} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: alpha("#EF9F27", 0.1), color: "#EF9F27" }} />
      </Stack>
      <Stack spacing={1}>
        {alerts.map((a, i) => (
          <Card key={i} sx={{ p: 1.5, borderRadius: 2, border: `1px solid ${alpha(a.color || "#EF9F27", 0.2)}`, bgcolor: alpha(a.color || "#EF9F27", 0.03) }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha(a.color || "#EF9F27", 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Iconify icon={a.icon || "mdi:alert"} width={18} sx={{ color: a.color || "#EF9F27" }} />
              </Box>
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: ESPRESSO, flex: 1 }}>
                {a.title}
              </Typography>
            </Stack>
          </Card>
        ))}
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
  const referralLink = user?.username ? `${WP_URL}?ref=${user.username}` : "";
  const shortcuts = [
    { icon: "mdi:shopping-outline", label: t("evea.shop"), action: () => window.open("https://www.myevea.com/collections/all", "_blank") },
    { icon: "mdi:link-variant", label: t("evea.referral_link"), action: async () => { if (referralLink) { await navigator.clipboard.writeText(referralLink); enqueueSnackbar(t("evea.link_copied")); } } },
    { icon: "mdi:cash-multiple", label: t("evea.wallet"), action: () => navigate("/user/financial/wallet") },
    { icon: "mdi:package-variant", label: t("evea.orders"), action: () => navigate("/user/online-store/my-orders") },
    { icon: "mdi:ticket-percent-outline", label: t("evea.coupons"), action: () => navigate("/user/coupons") },
    { icon: "mdi:refresh-circle", label: t("evea.smartship"), action: () => navigate("/user/recurring-orders") },
  ];
  return (
    <Grid container spacing={1.5}>
      {shortcuts.map((s) => (
        <Grid item xs={4} md={2} key={s.label}>
          <Card onClick={s.action} sx={{ ...cardSx, p: 1.5, textAlign: "center", cursor: "pointer", transition: "all 0.2s", "&:hover": { transform: "translateY(-2px)", boxShadow: `0 4px 12px ${alpha(ORO, 0.15)}`, borderColor: alpha(ORO, 0.3) } }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.08), display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 0.5 }}>
              <Iconify icon={s.icon} width={20} sx={{ color: ORO }} />
            </Box>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: TEXT }}>{s.label}</Typography>
          </Card>
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
  const { data: top, loading } = useTopPerformers();
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: TEXT, mb: 2 }}>Top Performer del Mese</Typography>
      {loading ? <Skeleton height={100} /> : (
        <Stack spacing={1.5}>
          {(top || []).map((p, i) => (
            <Stack key={p.user_id} direction="row" alignItems="center" spacing={1.5} sx={{ py: 1, borderBottom: i < 2 ? "1px solid #f5f0e8" : "none" }}>
              <Box sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: alpha(MEDAL_COLORS[i], 0.12), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Iconify icon="mdi:medal" width={16} sx={{ color: MEDAL_COLORS[i] }} />
              </Box>
              <Avatar sx={{ width: 34, height: 34, bgcolor: alpha(ORO, 0.1), color: ORO, fontSize: 13, fontWeight: 700 }}>
                {(p.first_name || p.username || "?").charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: TEXT }} noWrap>{[p.first_name, p.last_name].filter(Boolean).join(" ") || p.username}</Typography>
                <Typography sx={{ fontSize: "0.58rem", color: MUTED }}>ID: {p.user_id} &middot; @{p.username} &middot; IT</Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ORO }}>{p.total_qv} QV</Typography>
                <Chip label={p.type} size="small" sx={{ height: 16, fontSize: "0.6rem", bgcolor: p.type === "promoter" ? alpha(ORO, 0.1) : alpha("#4CAF50", 0.1), color: p.type === "promoter" ? ORO : "#4CAF50" }} />
              </Box>
            </Stack>
          ))}
          {(!top || !top.length) && <Typography sx={{ fontSize: "0.85rem", color: MUTED, textAlign: "center" }}>Nessun dato</Typography>}
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
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: TEXT }}>{t("evea.your_team")}</Typography>
        <Stack direction="row" spacing={0.5}>
          {[{ k: "week", l: "Sett" }, { k: "month", l: "Mese" }, { k: "quarter", l: "Trim" }, { k: "year", l: "Anno" }].map((p) => (
            <Chip key={p.k} label={p.l} size="small" onClick={() => setPeriod(p.k)}
              sx={{ height: 22, fontSize: "0.6rem", fontWeight: 600, cursor: "pointer", bgcolor: period === p.k ? ORO : alpha(ORO, 0.08), color: period === p.k ? "#fff" : TEXT }} />
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
                <Box sx={{ p: 1.2, bgcolor: alpha(m.color, 0.04), borderRadius: 2, border: `1px solid ${alpha(m.color, 0.1)}` }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Iconify icon={m.icon} width={16} sx={{ color: m.color }} />
                    <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>{m.label}</Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: m.color, mt: 0.3 }}>
                    {m.value}<Delta cur={m.rawVal ?? m.value} prev={m.prev} />
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Attivi vs Inattivi */}
          <Box sx={{ p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-around">
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: TEXT }}>{team.total_direct}</Typography>
                <Typography sx={{ fontSize: "0.58rem", color: MUTED }}>Totali</Typography>
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
  const referralLink = user?.username ? `${WP_URL}?ref=${user.username}` : "";
  const copy = async () => { if (referralLink) { await navigator.clipboard.writeText(referralLink); enqueueSnackbar(t("evea.link_copied")); } };
  const required = ff?.required_customers || 3;
  const current = ff?.current_qualified_customer_count || 0;
  const bonus = ff?.current_bonus_amount || 0;
  const customers = ff?.current_customers_largest_orders || [];
  const slots = Array.from({ length: required }, (_, i) => customers[i] || null);
  return (
    <Card sx={{ ...cardSx, p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon="mdi:gift-outline" width={20} sx={{ color: ORO }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} color={ESPRESSO}>{t("evea.gift_evea")}</Typography>
          <Typography variant="caption" sx={{ color: MUTED, lineHeight: 1 }}>Bonus 3 For Free</Typography>
        </Box>
      </Stack>
      {loading ? <Skeleton height={56} variant="rounded" /> : (
        <>
          <Stack direction="row" spacing={2.5} justifyContent="center" mb={2}>
            {slots.map((c, i) => (
              <Stack key={i} alignItems="center" spacing={0.5}>
                <Avatar sx={{ width: 52, height: 52, bgcolor: c ? alpha(ORO, 0.12) : "#f5f5f5", color: c ? ORO : "#ccc", border: c ? `2px solid ${ORO}` : "2px dashed #ddd" }}>
                  {c ? <Iconify icon="mdi:check-bold" width={24} /> : <Iconify icon="mdi:account-plus-outline" width={24} />}
                </Avatar>
                <Typography variant="caption" sx={{ color: c ? ESPRESSO : "#aaa", maxWidth: 70, fontWeight: c ? 600 : 400 }} noWrap>{c?.customer_name || `${t("evea.friend")} ${i + 1}`}</Typography>
              </Stack>
            ))}
          </Stack>
          <Box sx={{ textAlign: "center", bgcolor: "#fafafa", borderRadius: 2, py: 1.5, mb: 2 }}>
            <Typography variant="body2" sx={{ color: MUTED }}>
              <b style={{ color: ESPRESSO }}>{current}/{required}</b> {t("evea.friends_invited")}
              <Divider component="span" orientation="vertical" sx={{ mx: 1.5, height: 14, display: "inline-block", borderColor: "#ddd" }} />
              {t("evea.reward")}: <b style={{ color: ORO, fontSize: "1.1em" }}>€{bonus}</b>
            </Typography>
          </Box>
        </>
      )}
      <Button fullWidth variant="contained" startIcon={<Iconify icon="mdi:content-copy" />} onClick={copy}
        sx={{ bgcolor: ORO, color: "#fff", "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, borderRadius: 2, py: 1.2, textTransform: "none", fontSize: "0.875rem", boxShadow: `0 4px 12px ${alpha(ORO, 0.3)}` }}>
        {t("evea.copy_invite")}
      </Button>
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
    <Card sx={{ ...cardSx, p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:calendar-heart" width={20} sx={{ color: ORO }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color={ESPRESSO}>{t("evea.loyalty_path")}</Typography>
            <Typography variant="caption" sx={{ color: MUTED, lineHeight: 1 }}>{t("evea.loyalty_sub")}</Typography>
          </Box>
        </Stack>
        {!loading && totalConsec > 0 && <Chip label={`${t("evea.cycle")} ${cycleNum} · ${posInCycle}/${CYCLE_LEN}`} size="small" sx={{ bgcolor: alpha(ORO, 0.1), color: ORO, fontWeight: 700, fontSize: "0.7rem", height: 24 }} />}
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
                    <Box sx={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", ...(m.completed ? { bgcolor: ORO, color: "#fff", boxShadow: `0 2px 8px ${alpha(ORO, 0.35)}` } : m.isCurrent ? { bgcolor: "#fff", color: ORO, border: `2px solid ${ORO}`, boxShadow: `0 0 0 4px ${alpha(ORO, 0.12)}` } : { bgcolor: "#f5f5f5", color: "#bbb" }) }}>
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
            return (totalConsec > 0) ? (
              <Box sx={{ bgcolor: alpha(ORO, 0.06), borderRadius: 2, p: 2, textAlign: "center" }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} mb={0.5}>
                  <Iconify icon="mdi:piggy-bank-outline" width={18} sx={{ color: ORO }} />
                  <Typography sx={{ fontSize: "0.8rem", color: MUTED, fontWeight: 600 }}>{t("evea.your_savings")}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="center" divider={<Typography sx={{ mx: 1, color: "#ddd" }}>+</Typography>}>
                  {discountMonths > 0 && (
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: ESPRESSO, fontSize: "1.1rem" }}>{discountMonths}x -10%</Typography>
                      <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>{t("evea.discounted_deliveries")}</Typography>
                    </Box>
                  )}
                  {couponValue > 0 && (
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: ORO, fontSize: "1.1rem" }}>€{couponValue}</Typography>
                      <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>{t("evea.in_gift_coupons")}</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            ) : (
              <Box sx={{ bgcolor: alpha(ORO, 0.06), borderRadius: 2, p: 1.5, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.8rem", color: MUTED }}>Inizia il tuo abbonamento per risparmiare ogni mese!</Typography>
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
    const { data: r } = await axiosInstance.get("api/wp/admin/kpi/product-mix?period=month");
    return r?.data;
  });
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={150} /></Card>;
  if (!data || !data.length) return null;
  const top = data.slice(0, 5);
  const maxRev = Math.max(...top.map((p) => p.revenue), 1);

  return (
    <Card sx={{ ...cardSx, p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon="mdi:package-variant" width={20} sx={{ color: ORO }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} color={ESPRESSO}>{t("evea.best_selling")}</Typography>
          <Typography variant="caption" sx={{ color: MUTED, lineHeight: 1 }}>{t("evea.this_month")}</Typography>
        </Box>
      </Stack>
      <Stack spacing={1.2}>
        {top.map((p, i) => (
          <Stack key={i} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: PROD_COLORS[i % PROD_COLORS.length], flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.8rem", color: TEXT, fontWeight: 600, flex: 1 }} noWrap>{p.product || "N/A"}</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>{p.orders}x</Typography>
            <Box sx={{ width: 60 }}>
              <LinearProgress variant="determinate" value={(p.revenue / maxRev) * 100} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(PROD_COLORS[i % PROD_COLORS.length], 0.1), "& .MuiLinearProgress-bar": { bgcolor: PROD_COLORS[i % PROD_COLORS.length], borderRadius: 3 } }} />
            </Box>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: ORO }}>€{p.revenue}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

// ═══════════════════════════════════════
// SECTION TITLE
// ═══════════════════════════════════════
const Section = ({ icon, children }) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
    <Iconify icon={icon} width={20} sx={{ color: ORO }} />
    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: TEXT }}>{children}</Typography>
  </Stack>
);

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
const PromoterDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: heroData } = useHero();
  return (
    <Page title="Dashboard">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4, mx: { xs: -2, md: -3 }, mt: -2, pt: 2, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Stack spacing={2}>
          <HeroCard />
          <OnboardingBanner />
          <TickerBar />

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

          <Section icon="mdi:cash-multiple">{t("evea.earnings")}</Section>
          <EarningsSection />

          {user?.is_promoter === 1 && !heroData?.has_starter_kit && (
            <>
              <Section icon="mdi:package-variant-closed">Kit Starter</Section>
              <KitUpgrade />
            </>
          )}

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
        </Stack>
      </Box>
    </Page>
  );
};

export default PromoterDashboard;
