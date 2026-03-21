import {
  Avatar, Box, Button, Card, Chip, Grid, IconButton,
  LinearProgress, Skeleton, Stack, Tooltip, Typography,
} from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
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
  const grab = async (list) => {
    const results = await Promise.allSettled(list.map(async (c) => {
      try {
        const { data } = await fetchUser(c.url);
        const d = Array.isArray(data?.data) ? data.data[0] : data?.data;
        const src = c.nested ? d?.[c.nested] : d;
        return Number(src?.[c.field]) || 0;
      } catch { return 0; }
    }));
    return results.reduce((s, r) => s + (r.status === "fulfilled" ? r.value : 0), 0);
  };
  const [w, m] = await Promise.all([grab(weeklyUrls), grab(monthlyUrls)]);
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
      <Typography sx={{ fontSize: "0.6rem", color: alpha("#fff", 0.6), mb: 0.3 }}>{label}</Typography>
      <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: ORO, bgcolor: alpha(ORO, 0.12), borderRadius: 1, px: 1, py: 0.3, border: `1px solid ${alpha(ORO, 0.3)}` }}>
        {pad(time.d)}d {pad(time.h)}h {pad(time.m)}m {pad(time.s)}s
      </Typography>
    </Box>
  );
};

// ═══════════════════════════════════════
// 1. HERO CARD
// ═══════════════════════════════════════
const HeroCard = () => {
  const { user } = useAuth();
  const { data: rank, loading } = useRankSummary();
  const profile = user?.user_profile || {};
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || user?.username || "";

  return (
    <Card sx={{ bgcolor: ESPRESSO, color: "#fff", borderRadius: 4, p: { xs: 2.5, md: 3.5 }, position: "relative", overflow: "hidden" }}>
      <Box sx={{ position: "absolute", bottom: -40, right: -40, width: 140, height: 140, borderRadius: "50%", bgcolor: alpha(ORO, 0.06) }} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ xs: "center", md: "flex-start" }} sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, width: "100%" }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: alpha(ORO, 0.2), color: ORO, fontSize: 24, fontWeight: 700, border: `2px solid ${alpha(ORO, 0.4)}` }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
              <Typography variant="h6" fontWeight={700}>{fullName}</Typography>
              {rank?.current_rank && <Chip label={rank.current_rank} size="small" sx={{ bgcolor: alpha(ORO, 0.15), color: ORO, fontWeight: 700, fontSize: "0.7rem", height: 24, border: `1px solid ${alpha(ORO, 0.3)}` }} />}
            </Stack>
            <Typography sx={{ fontSize: "0.65rem", color: alpha("#fff", 0.5), mt: 0.3 }}>
              ID: {user?.id} &middot; @{user?.username} &middot; IT &middot; Sponsor: {user?.sponsor?.username || "—"}
            </Typography>
          </Box>
        </Stack>
        {!loading && rank && (
          <Stack direction="row" spacing={1.5} alignItems="center" flexShrink={0}>
            <CountdownTimer expiryDate={rank.month_end} label="Periodo scade" />
            {rank.dsp_end && <CountdownTimer expiryDate={rank.dsp_end} label="DSB boost scade" />}
          </Stack>
        )}
      </Stack>

      {loading ? <Skeleton height={50} sx={{ mt: 2, bgcolor: alpha("#fff", 0.05), borderRadius: 2 }} /> : (
        <Stack direction="row" spacing={1} sx={{ mt: 2.5, flexWrap: "wrap", gap: 1 }}>
          {[
            { icon: "mdi:wallet-outline", label: "Wallet", value: `€${Number(rank?.wallet_balance || 0).toFixed(2)}` },
            { icon: "mdi:chart-bar", label: "QV Mese", value: rank?.current_pqv || 0 },
            { icon: "mdi:diamond-outline", label: "BV Mese", value: rank?.current_bv || 0 },
            { icon: "mdi:account-group", label: "Clienti", value: rank?.total_customers || 0 },
            { icon: "mdi:account-tie", label: "Team", value: rank?.total_promoters || 0 },
          ].map((m) => (
            <Box key={m.label} sx={{ flex: "1 1 0", minWidth: 80, bgcolor: alpha("#fff", 0.06), borderRadius: 2, p: 1, textAlign: "center", border: `1px solid ${alpha(ORO, 0.1)}` }}>
              <Iconify icon={m.icon} width={18} sx={{ color: ORO, mb: 0.3 }} />
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>{m.value}</Typography>
              <Typography sx={{ fontSize: "0.55rem", color: alpha("#fff", 0.5) }}>{m.label}</Typography>
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
  const ticker = useTicker();
  if (!ticker) return null;
  const items = [...(ticker.sales || []), ...(ticker.new_members || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  if (!items.length) return null;
  return (
    <Box sx={{ bgcolor: ESPRESSO, borderRadius: 2, overflow: "hidden", py: 0.8 }}>
      <Box sx={{ display: "flex", animation: `${scroll} ${Math.max(items.length * 5, 20)}s linear infinite`, width: "max-content" }}>
        {[...items, ...items].map((it, i) => (
          <Stack key={i} direction="row" alignItems="center" spacing={0.8} sx={{ px: 2.5, flexShrink: 0 }}>
            <Chip label={it.type === "sale" ? "Vendita" : "Nuovo"} size="small" sx={{ height: 18, fontSize: "0.55rem", fontWeight: 700, bgcolor: it.type === "sale" ? alpha("#4CAF50", 0.2) : alpha("#2196F3", 0.2), color: it.type === "sale" ? "#4CAF50" : "#2196F3" }} />
            <Typography sx={{ fontSize: "0.7rem", color: "#fff", fontWeight: 600 }}>@{it.username}</Typography>
            {it.product && <Typography sx={{ fontSize: "0.65rem", color: alpha("#fff", 0.5) }}>{it.product}</Typography>}
            {it.amount && <Typography sx={{ fontSize: "0.7rem", color: ORO, fontWeight: 700 }}>€{it.amount}</Typography>}
          </Stack>
        ))}
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
      <Typography sx={{ fontSize: "0.82rem", color: TEXT, fontWeight: 600 }}>
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
  return (
    <Box sx={{ bgcolor: alpha("#4CAF50", 0.08), border: `1px solid ${alpha("#4CAF50", 0.2)}`, borderRadius: 2, p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
      <Iconify icon="mdi:party-popper" width={24} sx={{ color: "#4CAF50" }} />
      <Typography sx={{ fontSize: "0.82rem", color: TEXT, fontWeight: 600 }}>
        3 For Free completato! Hai guadagnato <b style={{ color: ORO }}>€{ff?.current_bonus_amount || 0}</b>
      </Typography>
    </Box>
  );
};

// ═══════════════════════════════════════
// 5. GUADAGNI
// ═══════════════════════════════════════
const EarningsSection = () => {
  const { data: bonus, loading: bLoad } = useBonusPending();
  const { data: rank, loading: rLoad } = useRankSummary();

  const PendingCard = ({ label, icon, color, value }) => (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(color, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon={icon} width={22} sx={{ color }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</Typography>
          {bLoad ? <Skeleton width={80} height={30} /> : <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: value > 0 ? color : "#ccc" }}>€{value.toFixed(2)}</Typography>}
        </Box>
      </Stack>
    </Card>
  );

  const pqvReq = Number(rank?.next_rank_pqv || 0);
  const pqvCur = Number(rank?.current_pqv || 0);
  const bvReq = Number(rank?.next_rank_bv || 0);
  const bvCur = Number(rank?.current_bv || 0);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}><PendingCard label="Pending Settimanali" icon="mdi:calendar-week" color="#4CAF50" value={bonus?.weekly || 0} /></Grid>
      <Grid item xs={12} md={4}><PendingCard label="Pending Mensili" icon="mdi:calendar-month" color={ORO} value={bonus?.monthly || 0} /></Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", mb: 1.5 }}>Avanzamento Rank</Typography>
          {rLoad ? <Skeleton height={60} /> : (
            <Stack spacing={1.5}>
              {pqvReq > 0 && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={0.3}>
                    <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600 }}>QV Team</Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>{pqvCur}/{pqvReq}</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={pqvReq > 0 ? Math.min(100, (pqvCur / pqvReq) * 100) : 0} sx={{ height: 6, borderRadius: 3, bgcolor: SABBIA, "& .MuiLinearProgress-bar": { bgcolor: ORO, borderRadius: 3 } }} />
                </Box>
              )}
              {bvReq > 0 && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={0.3}>
                    <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600 }}>BV Personale</Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>{bvCur}/{bvReq}</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={bvReq > 0 ? Math.min(100, (bvCur / bvReq) * 100) : 0} sx={{ height: 6, borderRadius: 3, bgcolor: SABBIA, "& .MuiLinearProgress-bar": { bgcolor: "#4CAF50", borderRadius: 3 } }} />
                </Box>
              )}
              {pqvReq > 0 && pqvCur < pqvReq && (
                <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>Mancano <b style={{ color: ORO }}>{(pqvReq - pqvCur).toFixed(0)} QV</b> al prossimo rank</Typography>
              )}
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
            {k.recommended && <Chip label="Consigliato" size="small" sx={{ position: "absolute", top: 10, right: 10, height: 20, fontSize: "0.6rem", fontWeight: 700, bgcolor: ORO, color: "#fff" }} />}
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
              <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>BV <b style={{ color: TEXT }}>{k.bv}</b></Typography>
              <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>QV <b style={{ color: TEXT }}>{k.qv}</b></Typography>
              <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>{k.products} prodotti</Typography>
            </Stack>
            <Button fullWidth size="small" variant={k.recommended ? "contained" : "outlined"} href={k.url} target="_blank"
              sx={{ ...(k.recommended ? { bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" } } : { borderColor: alpha(ORO, 0.3), color: ORO }), fontWeight: 700, textTransform: "none", borderRadius: 2 }}>
              Acquista
            </Button>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// ═══════════════════════════════════════
// 7. ACCESSO RAPIDO
// ═══════════════════════════════════════
const QuickAccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const referralLink = user?.username ? `${WP_URL}?ref=${user.username}` : "";
  const shortcuts = [
    { icon: "mdi:shopping-outline", label: "Negozio", action: () => navigate("/user/online-store") },
    { icon: "mdi:link-variant", label: "Link Referral", action: async () => { if (referralLink) { await navigator.clipboard.writeText(referralLink); enqueueSnackbar("Link copiato!"); } } },
    { icon: "mdi:cash-multiple", label: "Payout", action: () => navigate("/user/financial/request-payout") },
    { icon: "mdi:package-variant", label: "Ordini", action: () => navigate("/user/online-store/my-orders") },
    { icon: "mdi:ticket-percent-outline", label: "Coupon", action: () => navigate("/user/coupons") },
    { icon: "mdi:refresh-circle", label: "Smartship", action: () => navigate("/user/recurring-orders") },
  ];
  return (
    <Grid container spacing={1.5}>
      {shortcuts.map((s) => (
        <Grid item xs={4} md={2} key={s.label}>
          <Card onClick={s.action} sx={{ ...cardSx, p: 1.5, textAlign: "center", cursor: "pointer", transition: "all 0.2s", "&:hover": { transform: "translateY(-2px)", boxShadow: `0 4px 12px ${alpha(ORO, 0.15)}`, borderColor: alpha(ORO, 0.3) } }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.08), display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 0.5 }}>
              <Iconify icon={s.icon} width={20} sx={{ color: ORO }} />
            </Box>
            <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: TEXT }}>{s.label}</Typography>
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
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Top Performer del Mese</Typography>
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
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: TEXT }} noWrap>{[p.first_name, p.last_name].filter(Boolean).join(" ") || p.username}</Typography>
                <Typography sx={{ fontSize: "0.58rem", color: MUTED }}>ID: {p.user_id} &middot; @{p.username} &middot; IT</Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ORO }}>{p.total_qv} QV</Typography>
                <Chip label={p.type} size="small" sx={{ height: 16, fontSize: "0.5rem", bgcolor: p.type === "promoter" ? alpha(ORO, 0.1) : alpha("#4CAF50", 0.1), color: p.type === "promoter" ? ORO : "#4CAF50" }} />
              </Box>
            </Stack>
          ))}
          {(!top || !top.length) && <Typography sx={{ fontSize: "0.75rem", color: MUTED, textAlign: "center" }}>Nessun dato</Typography>}
        </Stack>
      )}
    </Card>
  );
};

// ═══════════════════════════════════════
// 9. ANDAMENTO QV + STATISTICHE
// ═══════════════════════════════════════
const MESI = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
const QvAndStats = () => {
  const { data: history, loading: hLoad } = useQvHistory();
  const { data: stats, loading: sLoad } = useStats();
  const now = new Date();
  const maxQv = Math.max(...(history || []).map((h) => h.total_qv), 1);
  const daysPassed = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const curQv = (history || []).find((h) => h.mese === now.getMonth() + 1 && h.anno === now.getFullYear())?.total_qv || 0;
  const projection = daysInMonth > 0 ? Math.round((curQv / Math.max(daysPassed, 1)) * daysInMonth) : 0;

  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Andamento QV</Typography>
      {hLoad ? <Skeleton height={120} /> : (
        <>
          <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ height: 120, mb: 1 }}>
            {(history || []).map((h) => {
              const pct = maxQv > 0 ? (h.total_qv / maxQv) * 100 : 0;
              const isCur = h.mese === now.getMonth() + 1 && h.anno === now.getFullYear();
              return (
                <Tooltip key={`${h.anno}-${h.mese}`} title={`${h.total_qv} QV`}>
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "0.5rem", color: MUTED, mb: 0.3 }}>{h.total_qv}</Typography>
                    <Box sx={{ width: "100%", height: `${Math.max(pct, 4)}%`, bgcolor: isCur ? ORO : alpha(ORO, 0.3), borderRadius: "4px 4px 0 0", transition: "height 0.5s" }} />
                    <Typography sx={{ fontSize: "0.5rem", color: isCur ? ORO : MUTED, fontWeight: isCur ? 700 : 400, mt: 0.3 }}>{MESI[h.mese - 1]}</Typography>
                  </Box>
                </Tooltip>
              );
            })}
          </Stack>
          <Box sx={{ bgcolor: alpha(ORO, 0.05), borderRadius: 2, p: 1, mb: 2, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>Proiezione: <b style={{ color: ORO }}>{projection} QV</b></Typography>
          </Box>
        </>
      )}
      <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: TEXT, mb: 1 }}>Statistiche</Typography>
      {sLoad ? <Skeleton height={60} /> : (
        <Stack spacing={1}>
          {[
            { label: "Tasso Riordine", value: stats?.tasso_riordine || 0, color: "#4CAF50" },
            { label: "Clienti Smartship", value: stats?.clienti_smartship || 0, color: "#2196F3" },
            { label: "Promoter Attivi", value: stats?.promoter_attivi || 0, color: ORO },
          ].map((s) => (
            <Box key={s.label}>
              <Stack direction="row" justifyContent="space-between" mb={0.3}>
                <Typography sx={{ fontSize: "0.65rem", color: TEXT, fontWeight: 600 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: "0.65rem", color: s.color, fontWeight: 700 }}>{s.value}%</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={Math.min(s.value, 100)} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(s.color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: s.color, borderRadius: 2 } }} />
            </Box>
          ))}
          {stats?.totals && <Typography sx={{ fontSize: "0.55rem", color: MUTED, mt: 0.5 }}>{stats.totals.clienti_diretti} clienti &middot; {stats.totals.clienti_smartship} smartship &middot; {stats.totals.promoter_diretti} promoter</Typography>}
        </Stack>
      )}
    </Card>
  );
};

// ═══════════════════════════════════════
// 10. 3FF + ROB mini
// ═══════════════════════════════════════
const ThreeFFMini = () => {
  const { data: ff, loading } = useThreeFF();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const copy = async () => { const link = `${WP_URL}?ref=${user?.username}`; if (link) { await navigator.clipboard.writeText(link); enqueueSnackbar("Link copiato!"); } };
  if (loading) return <Card sx={{ ...cardSx, p: 2.5 }}><Skeleton height={80} /></Card>;
  if (!ff) return null;
  const req = ff?.required_customers || 3;
  const cur = ff?.current_qualified_customer_count || 0;
  const customers = ff?.current_customers_largest_orders || [];
  const slots = Array.from({ length: req }, (_, i) => customers[i] || null);
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Box sx={{ width: 30, height: 30, borderRadius: 2, bgcolor: alpha("#E91E63", 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon="mdi:gift-outline" width={16} sx={{ color: "#E91E63" }} />
        </Box>
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: TEXT }}>3 For Free</Typography>
        <Chip label={`${cur}/${req}`} size="small" sx={{ ml: "auto", height: 20, fontSize: "0.6rem", fontWeight: 700, bgcolor: cur >= req ? alpha("#4CAF50", 0.1) : alpha(ORO, 0.1), color: cur >= req ? "#4CAF50" : ORO }} />
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
        {slots.map((c, i) => (
          <Avatar key={i} sx={{ width: 40, height: 40, bgcolor: c ? alpha(ORO, 0.12) : "#f5f5f5", color: c ? ORO : "#ccc", border: c ? `2px solid ${ORO}` : "2px dashed #ddd" }}>
            {c ? <Iconify icon="mdi:check-bold" width={18} /> : <Iconify icon="mdi:account-plus-outline" width={18} />}
          </Avatar>
        ))}
      </Stack>
      <Button fullWidth size="small" variant="contained" startIcon={<Iconify icon="mdi:content-copy" />} onClick={copy}
        sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none", borderRadius: 2, boxShadow: `0 4px 12px ${alpha(ORO, 0.3)}` }}>
        Copia Link Referral
      </Button>
    </Card>
  );
};

const ROBMini = () => {
  const { data: rob, loading } = useROB();
  if (loading) return <Card sx={{ ...cardSx, p: 2.5 }}><Skeleton height={80} /></Card>;
  if (!rob) return null;
  const total = Number(rob?.current_consecutive_months) || 0;
  const req = Number(rob?.required_consecutive_months) || 8;
  const pct = req > 0 ? Math.min(100, (total / req) * 100) : 0;
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Box sx={{ width: 30, height: 30, borderRadius: 2, bgcolor: alpha("#8BC34A", 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon="mdi:refresh-circle" width={16} sx={{ color: "#8BC34A" }} />
        </Box>
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: TEXT }}>Recurring Order</Typography>
        <Chip label={`${total}/${req} mesi`} size="small" sx={{ ml: "auto", height: 20, fontSize: "0.6rem", fontWeight: 700, bgcolor: alpha("#8BC34A", 0.1), color: "#8BC34A" }} />
      </Stack>
      <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4, bgcolor: SABBIA, "& .MuiLinearProgress-bar": { bgcolor: "#8BC34A", borderRadius: 4 } }} />
      <Typography sx={{ fontSize: "0.6rem", color: MUTED, mt: 0.5, textAlign: "right" }}>{total} mesi consecutivi</Typography>
    </Card>
  );
};

// ═══════════════════════════════════════
// SECTION TITLE
// ═══════════════════════════════════════
const Section = ({ icon, children }) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
    <Iconify icon={icon} width={20} sx={{ color: ORO }} />
    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT }}>{children}</Typography>
  </Stack>
);

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
const PromoterDashboard = () => {
  const { user } = useAuth();
  return (
    <Page title="Dashboard">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4, bgcolor: AVORIO, minHeight: "100vh" }}>
        <Stack spacing={2}>
          <HeroCard />
          <TickerBar />
          <UrgencyAlert />
          <CelebrationBanner />

          <Section icon="mdi:cash-multiple">Guadagni</Section>
          <EarningsSection />

          {user?.is_promoter === 1 && (
            <>
              <Section icon="mdi:package-variant-closed">Kit Starter</Section>
              <KitUpgrade />
            </>
          )}

          <Section icon="mdi:lightning-bolt">Accesso Rapido</Section>
          <QuickAccess />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Section icon="mdi:podium-gold">Top Performer</Section>
              <Box sx={{ mt: 1 }}><TopPerformers /></Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Section icon="mdi:chart-bar">Andamento & Statistiche</Section>
              <Box sx={{ mt: 1 }}><QvAndStats /></Box>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><ThreeFFMini /></Grid>
            <Grid item xs={12} md={6}><ROBMini /></Grid>
          </Grid>
        </Stack>
      </Box>
    </Page>
  );
};

export default PromoterDashboard;
