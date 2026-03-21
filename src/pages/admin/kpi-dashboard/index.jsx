import {
  Avatar, Box, Card, Chip, Grid, LinearProgress, Skeleton, Stack, Tooltip, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

// ═══════════════════════════════════════
// PALETTE
// ═══════════════════════════════════════
const ORO = "#B8963B";
const AVORIO = "#FAF6EF";
const ESPRESSO = "#2C1A0E";
const TEXT = "#3D3229";
const MUTED = "#7A6A5C";
const SUCCESS = "#4A5C3A";
const WARNING = "#EF9F27";
const DANGER = "#E24B4A";
const INFO = "#378ADD";
const SABBIA = "#E8DDCA";

const cardSx = { bgcolor: "#fff", borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f0ece6" };

// ═══════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let off = false;
    (async () => {
      try { const { data: r } = await axiosInstance.get(url); if (!off) setData(r?.data); }
      catch { /* silent */ }
      if (!off) setLoading(false);
    })();
    return () => { off = true; };
  }, []);
  return { data, loading };
};

// ═══════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════
const Section = ({ children }) => (
  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 1, mb: 1.5, mt: 1 }}>{children}</Typography>
);

const StatBar = ({ label, value, max = 100, color = ORO, suffix = "%" }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <Box sx={{ mb: 1.5 }}>
      <Stack direction="row" justifyContent="space-between" mb={0.3}>
        <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600 }}>{label}</Typography>
        <Typography sx={{ fontSize: "0.7rem", color, fontWeight: 700 }}>{value}{suffix}</Typography>
      </Stack>
      <LinearProgress variant="determinate" value={pct} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 } }} />
    </Box>
  );
};

// ═══════════════════════════════════════
// 1. RISK ALERT
// ═══════════════════════════════════════
const RiskAlert = () => {
  const { data } = useFetch("api/wp/admin/kpi/risk-alert");
  if (!data || !data.length) return null;
  return (
    <Box sx={{ bgcolor: "#FCEBEB", border: `1px solid ${DANGER}`, borderRadius: 2, p: 2, mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Iconify icon="mdi:alert-circle" width={22} sx={{ color: DANGER }} />
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: DANGER }}>Rischio Concentrazione Fatturato</Typography>
      </Stack>
      {data.map((r) => (
        <Stack key={r.user_id} direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.8 }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(DANGER, 0.1), color: DANGER, fontSize: 12, fontWeight: 700 }}>
            {(r.name || r.username || "?").charAt(0)}
          </Avatar>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: TEXT, flex: 1 }}>{r.name || r.username}</Typography>
          <Box sx={{ width: 120 }}>
            <LinearProgress variant="determinate" value={Math.min(r.pct, 100)} sx={{ height: 6, borderRadius: 3, bgcolor: alpha(DANGER, 0.1), "& .MuiLinearProgress-bar": { bgcolor: DANGER, borderRadius: 3 } }} />
          </Box>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: DANGER }}>{r.pct}%</Typography>
          <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>€{r.totale}</Typography>
        </Stack>
      ))}
    </Box>
  );
};

// ═══════════════════════════════════════
// 2. BIG KPI CARDS
// ═══════════════════════════════════════
const BigKPI = ({ icon, label, value, sub, delta, color = ORO }) => (
  <Card sx={{ bgcolor: ESPRESSO, borderRadius: 3, p: 2.5, height: "100%" }}>
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(color, 0.15), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Iconify icon={icon} width={22} sx={{ color }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: "0.6rem", color: alpha("#fff", 0.5), textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</Typography>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>{value}</Typography>
      </Box>
      {delta !== undefined && (
        <Chip
          icon={<Iconify icon={delta >= 0 ? "mdi:trending-up" : "mdi:trending-down"} width={14} />}
          label={`${delta >= 0 ? "+" : ""}${delta}%`}
          size="small"
          sx={{ height: 22, fontSize: "0.6rem", fontWeight: 700, bgcolor: alpha(delta >= 0 ? SUCCESS : DANGER, 0.2), color: delta >= 0 ? "#8BC34A" : "#FF6B6B" }}
        />
      )}
    </Stack>
    {sub && <Typography sx={{ fontSize: "0.6rem", color: alpha("#fff", 0.4), mt: 0.5 }}>{sub}</Typography>}
  </Card>
);

const OverviewCards = () => {
  const { data: o, loading } = useFetch("api/wp/admin/kpi/overview");
  if (loading) return <Grid container spacing={2}>{[0,1,2,3].map(i => <Grid item xs={6} md={3} key={i}><Skeleton variant="rounded" height={100} sx={{ borderRadius: 3 }} /></Grid>)}</Grid>;
  if (!o) return null;
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={3}><BigKPI icon="mdi:cash-multiple" label="Fatturato Mese" value={`€${(o.fatturato_mese || 0).toLocaleString("it")}`} delta={o.fatturato_delta} sub={`Mese prec: €${(o.fatturato_mese_prec || 0).toLocaleString("it")}`} /></Grid>
      <Grid item xs={6} md={3}><BigKPI icon="mdi:refresh-circle" label="MRR Smartship" value={`€${(o.mrr_smartship || 0).toLocaleString("it")}`} sub={`${o.mrr_pct || 0}% del fatturato`} color="#8BC34A" /></Grid>
      <Grid item xs={6} md={3}><BigKPI icon="mdi:account-cash" label="Provvigioni" value={`€${(o.provvigioni || 0).toLocaleString("it")}`} sub={`Payout ratio: ${o.payout_ratio || 0}%`} color={DANGER} /></Grid>
      <Grid item xs={6} md={3}><BigKPI icon="mdi:account-group" label="Smartship Attivi" value={o.smartship_attivi || 0} delta={o.smartship_delta} sub={`AOV: €${o.aov || 0} · Refund: ${o.refund_rate || 0}%`} color={INFO} /></Grid>
    </Grid>
  );
};

// ═══════════════════════════════════════
// 3. REVENUE CHART + WEEKLY
// ═══════════════════════════════════════
const MESI = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];

const RevenueChart = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/revenue-history");
  if (loading) return <Card sx={{ ...cardSx, p: 2.5 }}><Skeleton height={200} /></Card>;
  if (!data || !data.length) return null;
  const maxVal = Math.max(...data.map(d => Math.max(d.fatturato, d.payout, d.margine)), 1);
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Fatturato vs Payout vs Margine (6 mesi)</Typography>
      <Stack direction="row" spacing={1.5} alignItems="flex-end" sx={{ height: 180 }}>
        {data.map((d) => (
          <Box key={`${d.anno}-${d.mese}`} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Stack spacing={0.3} sx={{ width: "100%", alignItems: "center" }}>
              {[
                { val: d.fatturato, color: ORO, label: "F" },
                { val: d.payout, color: DANGER, label: "P" },
                { val: d.margine, color: SUCCESS, label: "M" },
              ].map((b) => (
                <Tooltip key={b.label} title={`${b.label}: €${b.val.toLocaleString("it")}`}>
                  <Box sx={{ width: b.label === "F" ? "80%" : "60%", height: Math.max((b.val / maxVal) * 50, 2), bgcolor: alpha(b.color, b.label === "F" ? 0.8 : 0.5), borderRadius: 1 }} />
                </Tooltip>
              ))}
            </Stack>
            <Typography sx={{ fontSize: "0.55rem", color: MUTED, mt: 0.5 }}>{MESI[d.mese - 1]}</Typography>
          </Box>
        ))}
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1.5 }}>
        {[{ label: "Fatturato", color: ORO }, { label: "Payout", color: DANGER }, { label: "Margine", color: SUCCESS }].map(l => (
          <Stack key={l.label} direction="row" alignItems="center" spacing={0.5}>
            <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: l.color }} />
            <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>{l.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

const WeeklyComparison = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/weekly-comparison");
  if (loading) return <Card sx={{ ...cardSx, p: 2.5 }}><Skeleton height={200} /></Card>;
  if (!data || !data.length) return null;
  const maxRev = Math.max(...data.map(d => Math.max(d.revenue_current, d.revenue_previous)), 1);
  const totalCur = data.reduce((s, d) => s + d.revenue_current, 0);
  const totalPrev = data.reduce((s, d) => s + d.revenue_previous, 0);
  const weekDelta = totalPrev > 0 ? ((totalCur - totalPrev) / totalPrev * 100).toFixed(1) : 0;
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Settimana vs Precedente</Typography>
      <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ height: 140 }}>
        {data.map((d) => (
          <Box key={d.day} sx={{ flex: 1, textAlign: "center" }}>
            <Stack spacing={0.5} alignItems="center">
              <Tooltip title={`Questa: €${d.revenue_current}`}>
                <Box sx={{ width: "60%", height: Math.max((d.revenue_current / maxRev) * 100, 2), bgcolor: ORO, borderRadius: 1 }} />
              </Tooltip>
              <Tooltip title={`Prec: €${d.revenue_previous}`}>
                <Box sx={{ width: "60%", height: Math.max((d.revenue_previous / maxRev) * 100, 2), bgcolor: alpha(ORO, 0.25), borderRadius: 1 }} />
              </Tooltip>
            </Stack>
            <Typography sx={{ fontSize: "0.55rem", color: MUTED, mt: 0.3 }}>{d.day}</Typography>
          </Box>
        ))}
      </Stack>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Card sx={{ flex: 1, p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.1)}` }}>
          <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>Questa settimana</Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: TEXT }}>€{totalCur.toFixed(0)}</Typography>
        </Card>
        <Card sx={{ flex: 1, p: 1.5, bgcolor: alpha(weekDelta >= 0 ? SUCCESS : DANGER, 0.04), borderRadius: 2, border: `1px solid ${alpha(weekDelta >= 0 ? SUCCESS : DANGER, 0.1)}` }}>
          <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>Delta</Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: weekDelta >= 0 ? SUCCESS : DANGER }}>{weekDelta >= 0 ? "+" : ""}{weekDelta}%</Typography>
        </Card>
      </Stack>
    </Card>
  );
};

// ═══════════════════════════════════════
// 4. PRODUCT MIX + GEO + SEGMENTATION
// ═══════════════════════════════════════
const PRODUCT_COLORS = [ORO, "#8BC34A", "#2196F3", "#FF9800", "#9C27B0", DANGER, INFO, SUCCESS];

const ProductMix = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/product-mix");
  if (loading) return <Card sx={{ ...cardSx, p: 2.5 }}><Skeleton height={150} /></Card>;
  if (!data || !data.length) return null;
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Product Mix</Typography>
      <Stack spacing={1}>
        {data.slice(0, 8).map((p, i) => (
          <Box key={p.product || i}>
            <Stack direction="row" justifyContent="space-between" mb={0.3}>
              <Typography sx={{ fontSize: "0.68rem", color: TEXT, fontWeight: 600 }} noWrap>{p.product || "N/A"}</Typography>
              <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>€{p.revenue} ({p.pct}%)</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={p.pct} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(PRODUCT_COLORS[i % PRODUCT_COLORS.length], 0.1), "& .MuiLinearProgress-bar": { bgcolor: PRODUCT_COLORS[i % PRODUCT_COLORS.length], borderRadius: 3 } }} />
          </Box>
        ))}
      </Stack>
    </Card>
  );
};

const GeoDistribution = () => {
  const { data: ops } = useFetch("api/wp/admin/kpi/operations");
  const geo = ops?.geo || [];
  if (!geo.length) return <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}><Typography sx={{ fontSize: "0.75rem", color: MUTED }}>Nessun dato geo</Typography></Card>;
  const maxCnt = Math.max(...geo.map(g => g.cnt), 1);
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Distribuzione Geo</Typography>
      <Stack spacing={1}>
        {geo.map((g, i) => (
          <Stack key={g.country || i} direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: TEXT, width: 50 }}>{g.country || "N/A"}</Typography>
            <Box sx={{ flex: 1 }}>
              <LinearProgress variant="determinate" value={(g.cnt / maxCnt) * 100} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(INFO, 0.1), "& .MuiLinearProgress-bar": { bgcolor: INFO, borderRadius: 3 } }} />
            </Box>
            <Typography sx={{ fontSize: "0.65rem", color: MUTED, width: 30, textAlign: "right" }}>{g.cnt}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

const ClientSegmentation = () => {
  const { data: cl, loading } = useFetch("api/wp/admin/kpi/clients");
  if (loading) return <Card sx={{ ...cardSx, p: 2.5 }}><Skeleton height={150} /></Card>;
  if (!cl) return null;
  const seg = cl.segmentation || {};
  const total = (seg.smartship || 0) + (seg.repeat_2plus || 0) + (seg.one_time || 0);
  const segments = [
    { label: "Smartship", value: seg.smartship || 0, color: SUCCESS },
    { label: "Repeat 2+", value: seg.repeat_2plus || 0, color: INFO },
    { label: "One-time", value: seg.one_time || 0, color: WARNING },
  ];
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Segmentazione Clienti</Typography>
      <Stack spacing={1.5}>
        {segments.map((s) => (
          <Box key={s.label}>
            <Stack direction="row" justifyContent="space-between" mb={0.3}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />
                <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600 }}>{s.label}</Typography>
              </Stack>
              <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>{s.value} ({total > 0 ? Math.round(s.value / total * 100) : 0}%)</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={total > 0 ? (s.value / total) * 100 : 0} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(s.color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: s.color, borderRadius: 3 } }} />
          </Box>
        ))}
      </Stack>
      <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2 }}>
        <StatBar label="NRR" value={cl.nrr || 0} color={cl.nrr >= 100 ? SUCCESS : WARNING} />
        <StatBar label="Churn Rate" value={cl.churn_rate || 0} color={cl.churn_rate < 10 ? SUCCESS : DANGER} />
        <StatBar label="Retention Smartship" value={cl.smartship_retention || 0} color={SUCCESS} />
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════
// 5. NETWORK
// ═══════════════════════════════════════
const NetworkKPIs = () => {
  const { data: n, loading } = useFetch("api/wp/admin/kpi/network");
  if (loading) return <Card sx={{ ...cardSx, p: 2.5 }}><Skeleton height={200} /></Card>;
  if (!n) return null;
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Network</Typography>
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {[
          { label: "Attivi", value: n.distributori_attivi, total: n.distributori_totali, color: SUCCESS },
          { label: "Nuovi", value: n.nuovi_distributori, color: INFO },
          { label: "Rank Up", value: n.rank_advancement, color: ORO },
          { label: "€/Promoter", value: `€${n.revenue_per_promoter}`, color: ORO },
        ].map((m) => (
          <Grid item xs={6} key={m.label}>
            <Box sx={{ p: 1.5, bgcolor: alpha(m.color, 0.04), borderRadius: 2, border: `1px solid ${alpha(m.color, 0.1)}`, textAlign: "center" }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: m.color }}>{m.value}</Typography>
              <Typography sx={{ fontSize: "0.55rem", color: MUTED }}>{m.label}{m.total ? ` / ${m.total}` : ""}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      {n.breakeven && (
        <Box sx={{ p: 1.5, bgcolor: alpha(SUCCESS, 0.04), borderRadius: 2, border: `1px solid ${alpha(SUCCESS, 0.1)}` }}>
          <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600 }}>Breakeven: <b style={{ color: SUCCESS }}>{n.breakeven.in_profit}</b>/{n.breakeven.total} promoter in utile</Typography>
          <LinearProgress variant="determinate" value={n.breakeven.total > 0 ? (n.breakeven.in_profit / n.breakeven.total) * 100 : 0} sx={{ height: 5, borderRadius: 3, mt: 0.5, bgcolor: alpha(SUCCESS, 0.1), "& .MuiLinearProgress-bar": { bgcolor: SUCCESS, borderRadius: 3 } }} />
        </Box>
      )}
    </Card>
  );
};

// ═══════════════════════════════════════
// 6. TOP 10 + COHORT
// ═══════════════════════════════════════
const Top10 = () => {
  const { data: n } = useFetch("api/wp/admin/kpi/network");
  const top = n?.top10 || [];
  if (!top.length) return null;
  const maxTot = Math.max(...top.map(t => t.totale), 1);
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Top 10 Promoter</Typography>
      <Stack spacing={0.8}>
        {top.map((t, i) => (
          <Stack key={t.user_id} direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: MUTED, width: 16 }}>{i + 1}</Typography>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: t.pct > 20 ? DANGER : t.pct > 10 ? WARNING : SUCCESS }} />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: TEXT, flex: 1 }} noWrap>{t.name || t.username}</Typography>
            <Box sx={{ width: 80 }}>
              <LinearProgress variant="determinate" value={(t.totale / maxTot) * 100} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(ORO, 0.1), "& .MuiLinearProgress-bar": { bgcolor: ORO, borderRadius: 2 } }} />
            </Box>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ORO, width: 40, textAlign: "right" }}>{t.pct}%</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

const CohortAnalysis = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/cohort");
  if (loading) return <Card sx={{ ...cardSx, p: 2.5 }}><Skeleton height={200} /></Card>;
  if (!data || !data.length) return null;
  const maxCols = Math.max(...data.map(d => d.retention?.length || 0));
  const getColor = (v) => {
    if (v >= 80) return SUCCESS;
    if (v >= 50) return "#8BC34A";
    if (v >= 30) return WARNING;
    if (v >= 10) return "#FF9800";
    return DANGER;
  };
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%", overflow: "auto" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Cohort Analysis</Typography>
      <Box sx={{ overflowX: "auto" }}>
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={0.5}>
            <Box sx={{ width: 60, flexShrink: 0 }} />
            {Array.from({ length: maxCols }, (_, i) => (
              <Box key={i} sx={{ width: 40, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.5rem", color: MUTED }}>M{i}</Typography>
              </Box>
            ))}
          </Stack>
          {data.map((row) => (
            <Stack key={row.mese} direction="row" spacing={0.5} alignItems="center">
              <Box sx={{ width: 60, flexShrink: 0 }}>
                <Typography sx={{ fontSize: "0.55rem", color: TEXT, fontWeight: 600 }}>{row.mese}</Typography>
                <Typography sx={{ fontSize: "0.45rem", color: MUTED }}>{row.total} utenti</Typography>
              </Box>
              {(row.retention || []).map((v, i) => (
                <Box key={i} sx={{ width: 40, height: 28, borderRadius: 1, bgcolor: alpha(getColor(v), 0.15), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography sx={{ fontSize: "0.5rem", fontWeight: 700, color: getColor(v) }}>{v}%</Typography>
                </Box>
              ))}
            </Stack>
          ))}
        </Stack>
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════
// 7. HEATMAP + RANK VELOCITY
// ═══════════════════════════════════════
const HOUR_LABELS = ["Notte (0-6)", "Mattina (6-12)", "Pomeriggio (12-18)", "Sera (18-24)"];
const DAY_LABELS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

const OrderHeatmap = () => {
  const { data: ops } = useFetch("api/wp/admin/kpi/operations");
  const heatmap = ops?.heatmap || [];
  if (!heatmap.length) return null;
  // Build grid: 4 time slots x 7 days
  const grid = Array.from({ length: 4 }, () => Array(7).fill(0));
  heatmap.forEach((h) => {
    const dayIdx = ((h.dow + 5) % 7); // MySQL DAYOFWEEK: 1=Sun -> we want 0=Mon
    const slotIdx = Math.min(3, Math.floor(h.hora / 6));
    grid[slotIdx][dayIdx] += h.cnt;
  });
  const maxCnt = Math.max(...grid.flat(), 1);
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Heatmap Ordini</Typography>
      <Stack spacing={0.5}>
        <Stack direction="row" spacing={0.5}>
          <Box sx={{ width: 80 }} />
          {DAY_LABELS.map(d => <Box key={d} sx={{ flex: 1, textAlign: "center" }}><Typography sx={{ fontSize: "0.5rem", color: MUTED }}>{d}</Typography></Box>)}
        </Stack>
        {grid.map((row, si) => (
          <Stack key={si} direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 80 }}><Typography sx={{ fontSize: "0.5rem", color: MUTED }}>{HOUR_LABELS[si]}</Typography></Box>
            {row.map((cnt, di) => {
              const intensity = cnt / maxCnt;
              return (
                <Box key={di} sx={{ flex: 1, height: 32, borderRadius: 1, bgcolor: alpha(ORO, 0.05 + intensity * 0.6), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography sx={{ fontSize: "0.55rem", fontWeight: 600, color: intensity > 0.5 ? "#fff" : TEXT }}>{cnt || ""}</Typography>
                </Box>
              );
            })}
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

const RankVelocity = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/rank-velocity");
  if (loading) return <Card sx={{ ...cardSx, p: 2.5 }}><Skeleton height={150} /></Card>;
  if (!data || !data.length) return <Card sx={{ ...cardSx, p: 2.5 }}><Typography sx={{ fontSize: "0.75rem", color: MUTED }}>Nessun dato rank velocity</Typography></Card>;
  const maxDays = Math.max(...data.map(d => d.avg_days), 1);
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Rank Velocity</Typography>
      <Stack spacing={1}>
        {data.map((r, i) => (
          <Box key={i}>
            <Stack direction="row" justifyContent="space-between" mb={0.3}>
              <Typography sx={{ fontSize: "0.65rem", color: TEXT, fontWeight: 600 }}>{r.from} → {r.to}</Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: r.alert ? DANGER : SUCCESS }}>{r.avg_days}gg</Typography>
                {r.alert && <Iconify icon="mdi:alert" width={14} sx={{ color: DANGER }} />}
              </Stack>
            </Stack>
            <LinearProgress variant="determinate" value={Math.min((r.avg_days / maxDays) * 100, 100)} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(r.alert ? DANGER : ORO, 0.1), "& .MuiLinearProgress-bar": { bgcolor: r.alert ? DANGER : ORO, borderRadius: 3 } }} />
            <Typography sx={{ fontSize: "0.5rem", color: MUTED }}>{r.count} transizioni</Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
};

// ═══════════════════════════════════════
// 8. INVENTORY + AGING
// ═══════════════════════════════════════
const InventoryForecast = () => {
  const { data: ops } = useFetch("api/wp/admin/kpi/operations");
  const inv = ops?.inventory || [];
  if (!inv.length) return null;
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Inventory Forecast</Typography>
      <Stack spacing={1}>
        {inv.slice(0, 6).map((p, i) => {
          const status = p.stock >= p.forecast ? "ok" : p.stock >= p.forecast * 0.5 ? "attenzione" : "riordina";
          const statusColor = status === "ok" ? SUCCESS : status === "attenzione" ? WARNING : DANGER;
          return (
            <Stack key={i} direction="row" alignItems="center" spacing={1}>
              <Typography sx={{ fontSize: "0.68rem", color: TEXT, fontWeight: 600, flex: 1 }} noWrap>{p.product || "N/A"}</Typography>
              <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>30d: {p.avg_30d}</Typography>
              <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>Prev: {p.forecast}</Typography>
              <Chip label={status} size="small" sx={{ height: 18, fontSize: "0.5rem", fontWeight: 700, bgcolor: alpha(statusColor, 0.1), color: statusColor }} />
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
};

const AgingCommissions = () => {
  const { data: ops } = useFetch("api/wp/admin/kpi/operations");
  const aging = ops?.aging;
  if (!aging) return null;
  const bands = [
    { label: "< 30 giorni", value: aging.lt30 || 0, color: SUCCESS },
    { label: "30-60 giorni", value: aging.d30_60 || 0, color: WARNING },
    { label: "60-90 giorni", value: aging.d60_90 || 0, color: "#FF9800" },
    { label: "> 90 giorni", value: aging.gt90 || 0, color: DANGER },
  ];
  const total = bands.reduce((s, b) => s + b.value, 0);
  return (
    <Card sx={{ ...cardSx, p: 2.5, height: "100%" }}>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT, mb: 2 }}>Aging Commissioni Pending</Typography>
      <Stack spacing={1.5}>
        {bands.map((b) => (
          <Box key={b.label}>
            <Stack direction="row" justifyContent="space-between" mb={0.3}>
              <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600 }}>{b.label}</Typography>
              <Typography sx={{ fontSize: "0.7rem", color: b.color, fontWeight: 700 }}>€{b.value.toFixed(0)}</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={total > 0 ? (b.value / total) * 100 : 0} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(b.color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: b.color, borderRadius: 3 } }} />
          </Box>
        ))}
      </Stack>
      <Box sx={{ mt: 1.5, p: 1, bgcolor: alpha(ORO, 0.04), borderRadius: 2, textAlign: "center" }}>
        <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>Totale pending: <b style={{ color: TEXT }}>€{total.toFixed(0)}</b></Typography>
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
const KpiDashboard = () => {
  return (
    <Page title="KPI Dashboard">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4, bgcolor: AVORIO, minHeight: "100vh" }}>
        <Stack spacing={2.5}>
          <Typography variant="h5" fontWeight={700} color={ESPRESSO} sx={{ pt: 1 }}>KPI Dashboard</Typography>

          <RiskAlert />
          <OverviewCards />

          <Section>Revenue & Performance</Section>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}><RevenueChart /></Grid>
            <Grid item xs={12} md={5}><WeeklyComparison /></Grid>
          </Grid>

          <Section>Prodotti, Geografia & Clienti</Section>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><ProductMix /></Grid>
            <Grid item xs={12} md={4}><GeoDistribution /></Grid>
            <Grid item xs={12} md={4}><ClientSegmentation /></Grid>
          </Grid>

          <Section>Network & Promoter</Section>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><NetworkKPIs /></Grid>
            <Grid item xs={12} md={4}><Top10 /></Grid>
            <Grid item xs={12} md={4}><CohortAnalysis /></Grid>
          </Grid>

          <Section>Operazioni & Analisi</Section>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}><OrderHeatmap /></Grid>
            <Grid item xs={12} md={3}><RankVelocity /></Grid>
            <Grid item xs={12} md={3}><InventoryForecast /></Grid>
            <Grid item xs={12} md={3}><AgingCommissions /></Grid>
          </Grid>
        </Stack>
      </Box>
    </Page>
  );
};

export default KpiDashboard;
