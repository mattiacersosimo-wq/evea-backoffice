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
const CREMA = "#F0E8D8";
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
// SHARED
// ═══════════════════════════════════════
const Section = ({ children }) => (
  <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 1.2, mb: 1.5, mt: 2 }}>{children}</Typography>
);

const Insight = ({ color = WARNING, icon = "mdi:lightbulb-outline", children }) => (
  <Box sx={{ mt: 1.5, p: 1.5, bgcolor: alpha(color, 0.06), borderRadius: 2, border: `1px solid ${alpha(color, 0.15)}`, display: "flex", alignItems: "flex-start", gap: 1 }}>
    <Iconify icon={icon} width={16} sx={{ color, mt: 0.2, flexShrink: 0 }} />
    <Typography sx={{ fontSize: "0.65rem", color: TEXT, lineHeight: 1.4 }}>{children}</Typography>
  </Box>
);

const StatBar = ({ label, value, max = 100, color = ORO, suffix = "%", badge }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <Box sx={{ mb: 1.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.3}>
        <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600 }}>{label}</Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography sx={{ fontSize: "0.7rem", color, fontWeight: 700 }}>{value}{suffix}</Typography>
          {badge && <Chip label={badge} size="small" sx={{ height: 16, fontSize: "0.5rem", fontWeight: 700, bgcolor: alpha(color, 0.1), color }} />}
        </Stack>
      </Stack>
      <LinearProgress variant="determinate" value={pct} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 } }} />
    </Box>
  );
};

// SVG Donut
const Donut = ({ segments, size = 120 }) => {
  const r = 42; const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {total > 0 && segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const rotation = offset * 360 - 90;
        offset += pct;
        return <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={seg.color} strokeWidth="14" strokeDasharray={`${dash} ${gap}`} transform={`rotate(${rotation} 50 50)`} />;
      })}
      <circle cx="50" cy="50" r="32" fill="#fff" />
    </svg>
  );
};

// ═══════════════════════════════════════
// 1. RISK ALERT
// ═══════════════════════════════════════
const RiskAlert = () => {
  const { data } = useFetch("api/wp/admin/kpi/risk-alert");
  if (!data || !data.length) return null;
  const top = data[0];
  return (
    <Box sx={{ bgcolor: "#FCEBEB", border: `1.5px solid ${DANGER}`, borderRadius: 3, p: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(DANGER, 0.15), color: DANGER }}>
          <Iconify icon="mdi:alert" width={22} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: DANGER }}>
            Rischio concentrazione — Leader critico rilevato
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: TEXT }}>
            <b>{top.name || top.username}</b> genera il <b>{top.pct}%</b> del fatturato. Soglia superata (20-30%). Diversificare urgentemente.
          </Typography>
        </Box>
      </Stack>
      {data.length > 1 && data.slice(1).map((r) => (
        <Stack key={r.user_id} direction="row" alignItems="center" spacing={1} sx={{ mt: 1, pl: 6 }}>
          <Typography sx={{ fontSize: "0.7rem", color: TEXT }}>{r.name || r.username}</Typography>
          <Box sx={{ flex: 1 }}><LinearProgress variant="determinate" value={Math.min(r.pct, 100)} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(DANGER, 0.1), "& .MuiLinearProgress-bar": { bgcolor: DANGER, borderRadius: 2 } }} /></Box>
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: DANGER }}>{r.pct}%</Typography>
          <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>€{r.totale}</Typography>
        </Stack>
      ))}
    </Box>
  );
};

// ═══════════════════════════════════════
// 2. BIG KPI CARDS
// ═══════════════════════════════════════
const OverviewCards = () => {
  const { data: o, loading } = useFetch("api/wp/admin/kpi/overview");
  if (loading) return <Grid container spacing={2}>{[0,1,2,3].map(i => <Grid item xs={6} md={3} key={i}><Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} /></Grid>)}</Grid>;
  if (!o) return null;

  const cards = [
    { label: "FATTURATO MESE", value: `€${(o.fatturato_mese || 0).toLocaleString("it")}`, sub: o.fatturato_delta > 0 ? `+${o.fatturato_delta}% vs mese scorso` : `${o.fatturato_delta}% vs mese scorso`, color: ORO, icon: "mdi:cash-multiple" },
    { label: "MRR — SMARTSHIP", value: `€${(o.mrr_smartship || 0).toLocaleString("it")}`, sub: `${o.mrr_pct || 0}% del fatturato ricorrente`, color: "#8BC34A", icon: "mdi:refresh-circle" },
    { label: "PROVVIGIONI MATURATE", value: `€${(o.provvigioni || 0).toLocaleString("it")}`, sub: `Payout ratio: ${o.payout_ratio || 0}%`, color: DANGER, icon: "mdi:account-cash" },
    { label: "SMARTSHIP ATTIVI", value: o.smartship_attivi || 0, sub: `${o.smartship_delta >= 0 ? "+" : ""}${o.smartship_delta || 0} questo mese`, color: INFO, icon: "mdi:account-group" },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((c, i) => (
        <Grid item xs={6} md={3} key={i}>
          <Card sx={{ bgcolor: ESPRESSO, borderRadius: 3, p: 2.5, height: "100%" }}>
            <Typography sx={{ fontSize: "0.58rem", color: alpha("#fff", 0.5), textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>{c.label}</Typography>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", mt: 0.5, lineHeight: 1.1 }}>{c.value}</Typography>
            <Typography sx={{ fontSize: "0.65rem", color: alpha("#fff", 0.5), mt: 0.5 }}>{c.sub}</Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// ═══════════════════════════════════════
// 3. REVENUE + WEEKLY
// ═══════════════════════════════════════
const MESI = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];

const RevenueChart = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/revenue-history");
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={250} /></Card>;
  if (!data || !data.length) return null;
  const maxVal = Math.max(...data.flatMap(d => [d.fatturato, d.payout, d.margine]), 1);
  const ySteps = 5;

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT }}>Fatturato vs Payout — 6 mesi</Typography>
        <Stack direction="row" spacing={1.5}>
          {[{ l: "Fatturato", c: ORO }, { l: "Payout", c: DANGER }, { l: "Margine", c: SUCCESS }].map(x => (
            <Stack key={x.l} direction="row" alignItems="center" spacing={0.3}>
              <Box sx={{ width: 10, height: 3, borderRadius: 1, bgcolor: x.c }} />
              <Typography sx={{ fontSize: "0.55rem", color: MUTED }}>{x.l}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Box sx={{ position: "relative", height: 200 }}>
        {/* Y axis labels */}
        {Array.from({ length: ySteps + 1 }, (_, i) => {
          const val = Math.round((maxVal / ySteps) * (ySteps - i));
          return (
            <Typography key={i} sx={{ position: "absolute", left: 0, top: `${(i / ySteps) * 100}%`, fontSize: "0.5rem", color: MUTED, transform: "translateY(-50%)" }}>
              €{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
            </Typography>
          );
        })}
        {/* Grid lines */}
        {Array.from({ length: ySteps + 1 }, (_, i) => (
          <Box key={i} sx={{ position: "absolute", left: 40, right: 0, top: `${(i / ySteps) * 100}%`, height: "1px", bgcolor: "#f0f0f0" }} />
        ))}
        {/* Bars */}
        <Stack direction="row" spacing={1} sx={{ position: "absolute", left: 45, right: 0, bottom: 0, top: 0, alignItems: "flex-end" }}>
          {data.map((d) => {
            const fPct = (d.fatturato / maxVal) * 100;
            const pPct = (d.payout / maxVal) * 100;
            const mPct = (d.margine / maxVal) * 100;
            return (
              <Box key={`${d.anno}-${d.mese}`} sx={{ flex: 1, textAlign: "center" }}>
                <Stack direction="row" spacing={0.3} justifyContent="center" alignItems="flex-end" sx={{ height: "100%" }}>
                  <Tooltip title={`Fatturato: €${d.fatturato}`}><Box sx={{ width: "28%", height: `${Math.max(fPct, 1)}%`, bgcolor: ORO, borderRadius: "3px 3px 0 0" }} /></Tooltip>
                  <Tooltip title={`Payout: €${d.payout}`}><Box sx={{ width: "28%", height: `${Math.max(pPct, 1)}%`, bgcolor: DANGER, borderRadius: "3px 3px 0 0" }} /></Tooltip>
                  <Tooltip title={`Margine: €${d.margine}`}><Box sx={{ width: "28%", height: `${Math.max(mPct, 1)}%`, bgcolor: SUCCESS, borderRadius: "3px 3px 0 0" }} /></Tooltip>
                </Stack>
                <Typography sx={{ fontSize: "0.55rem", color: MUTED, mt: 0.5 }}>{MESI[d.mese - 1]}</Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Card>
  );
};

const WeeklyComparison = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/weekly-comparison");
  const { data: o } = useFetch("api/wp/admin/kpi/overview");
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={250} /></Card>;
  if (!data || !data.length) return null;
  const maxRev = Math.max(...data.flatMap(d => [d.revenue_current, d.revenue_previous]), 1);
  const totalCur = data.reduce((s, d) => s + d.revenue_current, 0);
  const totalPrev = data.reduce((s, d) => s + d.revenue_previous, 0);
  const delta = totalPrev > 0 ? ((totalCur - totalPrev) / totalPrev * 100).toFixed(0) : 0;
  const totalOrders = o ? Math.round(totalCur / Math.max(o.aov || 1, 1)) : 0;

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Confronto settimana corrente vs precedente</Typography>
      <Box sx={{ position: "relative", height: 160 }}>
        <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ height: "100%" }}>
          {data.map((d) => (
            <Box key={d.day} sx={{ flex: 1, textAlign: "center" }}>
              <Stack direction="row" spacing={0.3} justifyContent="center" alignItems="flex-end" sx={{ height: "100%" }}>
                <Tooltip title={`Questa: €${d.revenue_current}`}><Box sx={{ width: "40%", height: `${Math.max((d.revenue_current / maxRev) * 100, 2)}%`, bgcolor: ORO, borderRadius: "3px 3px 0 0" }} /></Tooltip>
                <Tooltip title={`Prec: €${d.revenue_previous}`}><Box sx={{ width: "40%", height: `${Math.max((d.revenue_previous / maxRev) * 100, 2)}%`, bgcolor: alpha(ORO, 0.25), borderRadius: "3px 3px 0 0" }} /></Tooltip>
              </Stack>
              <Typography sx={{ fontSize: "0.55rem", color: MUTED, mt: 0.3, textTransform: "capitalize" }}>{d.day}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
      <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
        <Grid item xs={6}>
          <Box sx={{ p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.1)}`, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.55rem", color: MUTED }}>Questa settimana</Typography>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: TEXT }}>€{totalCur.toLocaleString("it")}</Typography>
            <Typography sx={{ fontSize: "0.55rem", color: delta >= 0 ? SUCCESS : DANGER }}>{delta >= 0 ? "+" : ""}{delta}% vs precedente</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.1)}`, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.55rem", color: MUTED }}>Ordini questa settimana</Typography>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: TEXT }}>{totalOrders}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

// ═══════════════════════════════════════
// 4. PRODUCT MIX + GEO + SEGMENTATION
// ═══════════════════════════════════════
const PROD_COLORS = [ESPRESSO, ORO, "#D4B86A", SUCCESS, WARNING, INFO, DANGER, "#9C27B0"];

const ProductMix = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/product-mix");
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={200} /></Card>;
  if (!data || !data.length) return null;
  const segments = data.slice(0, 6).map((p, i) => ({ value: p.revenue, color: PROD_COLORS[i % PROD_COLORS.length], label: p.product || "N/A", pct: p.pct }));

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 1 }}>Revenue per prodotto</Typography>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" mb={1.5}>
        {segments.map((s) => (
          <Stack key={s.label} direction="row" alignItems="center" spacing={0.3}>
            <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: s.color }} />
            <Typography sx={{ fontSize: "0.55rem", color: MUTED }}>{s.label}</Typography>
          </Stack>
        ))}
      </Stack>
      <Box sx={{ textAlign: "center", mb: 2 }}><Donut segments={segments} size={130} /></Box>
      <Stack spacing={1}>
        {segments.map((s) => (
          <Stack key={s.label} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color, flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600, flex: 1 }}>{s.label}</Typography>
            <Box sx={{ width: 60 }}><LinearProgress variant="determinate" value={s.pct} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(s.color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: s.color, borderRadius: 2 } }} /></Box>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: TEXT, width: 30, textAlign: "right" }}>{s.pct}%</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

const GeoDistribution = () => {
  const { data: ops } = useFetch("api/wp/admin/kpi/operations");
  const geo = ops?.geo || [];
  if (!geo.length) return <Card sx={{ ...cardSx, p: 3, height: "100%" }}><Typography sx={{ fontSize: "0.75rem", color: MUTED }}>Nessun dato geo</Typography></Card>;
  const maxCnt = Math.max(...geo.map(g => g.cnt), 1);
  const total = geo.reduce((s, g) => s + g.cnt, 0);

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Distribuzione geografica ordini</Typography>
      <Stack spacing={1.5}>
        {geo.slice(0, 5).map((g) => (
          <Stack key={g.country} direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: TEXT, width: 24 }}>{(g.country || "N/A").substring(0, 2).toUpperCase()}</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: TEXT, width: 60 }}>{g.country || "N/A"}</Typography>
            <Box sx={{ flex: 1 }}><LinearProgress variant="determinate" value={(g.cnt / maxCnt) * 100} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(SUCCESS, 0.1), "& .MuiLinearProgress-bar": { bgcolor: SUCCESS, borderRadius: 3 } }} /></Box>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: TEXT }}>{total > 0 ? Math.round(g.cnt / total * 100) : 0}%</Typography>
          </Stack>
        ))}
      </Stack>
      {geo.length >= 2 && (
        <Insight color={SUCCESS} icon="mdi:earth">
          {geo.length > 1 ? `${geo.length} paesi attivi. Opportunità di espansione nei mercati secondari.` : "Mercato concentrato su un solo paese."}
        </Insight>
      )}
    </Card>
  );
};

const ClientSegmentation = () => {
  const { data: cl, loading } = useFetch("api/wp/admin/kpi/clients");
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={250} /></Card>;
  if (!cl) return null;
  const seg = cl.segmentation || {};
  const total = (seg.smartship || 0) + (seg.repeat_2plus || 0) + (seg.one_time || 0);
  const segments = [
    { label: "Clienti smartship attivi", value: seg.smartship || 0, color: SUCCESS },
    { label: "Clienti one-time (2+ ordini)", value: seg.repeat_2plus || 0, color: INFO },
    { label: "Clienti one-time (1 ordine)", value: seg.one_time || 0, color: WARNING },
  ];

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 1.5 }}>Segmentazione clienti</Typography>
      <Box sx={{ textAlign: "center", mb: 2 }}><Donut segments={segments} size={120} /></Box>
      <Stack spacing={1.5}>
        {segments.map((s) => (
          <Stack key={s.label} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color, flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.68rem", color: TEXT, flex: 1 }}>{s.label}</Typography>
            <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: TEXT }}>{s.value}</Typography>
            <Chip label={`${total > 0 ? Math.round(s.value / total * 100) : 0}%`} size="small" sx={{ height: 18, fontSize: "0.55rem", fontWeight: 700, bgcolor: alpha(s.color, 0.1), color: s.color }} />
          </Stack>
        ))}
      </Stack>
      <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2 }}>
        <StatBar label="NRR — Net Revenue Retention" value={cl.nrr || 0} color={cl.nrr >= 100 ? SUCCESS : WARNING} />
        <StatBar label="Churn Rate" value={cl.churn_rate || 0} color={cl.churn_rate < 10 ? SUCCESS : DANGER} />
        <StatBar label="Retention Smartship" value={cl.smartship_retention || 0} color={SUCCESS} />
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════
// 5. REVENUE HEALTH: NRR + LTV + BREAKEVEN
// ═══════════════════════════════════════
const RevenueHealth = () => {
  const { data: cl } = useFetch("api/wp/admin/kpi/clients");
  const { data: n } = useFetch("api/wp/admin/kpi/network");
  const { data: o } = useFetch("api/wp/admin/kpi/overview");

  const nrr = cl?.nrr || 0;
  const be = n?.breakeven || {};
  const totalClienti = cl?.segmentation ? (cl.segmentation.smartship || 0) + (cl.segmentation.repeat_2plus || 0) + (cl.segmentation.one_time || 0) : 0;
  const ltvBase = o && totalClienti > 0 ? Math.round(o.fatturato_mese * 12 / totalClienti) : 0;
  const ltvSmart = o && (cl?.segmentation?.smartship || 0) > 0 ? Math.round(o.mrr_smartship * 12 / cl.segmentation.smartship) : 0;
  const revPerPromoter = n?.revenue_per_promoter || 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
          <Typography sx={{ fontSize: "0.65rem", color: MUTED, fontWeight: 600, textTransform: "uppercase" }}>NRR — Net Revenue Retention</Typography>
          <Typography sx={{ fontSize: "2.5rem", fontWeight: 900, color: nrr >= 100 ? SUCCESS : DANGER, lineHeight: 1.1, mt: 0.5 }}>{nrr}%</Typography>
          <Typography sx={{ fontSize: "0.65rem", color: nrr >= 100 ? SUCCESS : DANGER, mt: 0.5 }}>
            {nrr >= 100 ? "Clienti esistenti spendono di più ✓" : "Clienti in contrazione — azione richiesta"}
          </Typography>
          <Typography sx={{ fontSize: "0.55rem", color: MUTED, mt: 1 }}>Target: 100%+ · Ottimo: 110%+</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
          <Typography sx={{ fontSize: "0.65rem", color: MUTED, fontWeight: 600, textTransform: "uppercase" }}>LTV / CAC ratio</Typography>
          <Typography sx={{ fontSize: "2.5rem", fontWeight: 900, color: ORO, lineHeight: 1.1, mt: 0.5 }}>—</Typography>
          <Typography sx={{ fontSize: "0.6rem", color: MUTED, mt: 0.5 }}>CAC non disponibile (nessun dato ads)</Typography>
          <Stack spacing={0.5} sx={{ mt: 1.5 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>LTV medio cliente</Typography>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: TEXT }}>€{ltvBase}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>LTV con smartship</Typography>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: TEXT }}>€{ltvSmart}</Typography>
            </Stack>
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
          <Typography sx={{ fontSize: "0.65rem", color: MUTED, fontWeight: 600, textTransform: "uppercase" }}>Breakeven per promoter</Typography>
          <Typography sx={{ fontSize: "2.5rem", fontWeight: 900, color: SUCCESS, lineHeight: 1.1, mt: 0.5 }}>{be.in_profit || 0}/{be.total || 0}</Typography>
          <Typography sx={{ fontSize: "0.65rem", color: SUCCESS }}>Promoter che coprono il loro costo</Typography>
          <Stack spacing={0.5} sx={{ mt: 1.5 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>Revenue/promoter attivo</Typography>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: TEXT }}>€{revPerPromoter}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>In utile</Typography>
              <Chip label={be.in_profit || 0} size="small" sx={{ height: 18, fontSize: "0.55rem", bgcolor: alpha(SUCCESS, 0.1), color: SUCCESS, fontWeight: 700 }} />
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>A costo netto</Typography>
              <Chip label={(be.total || 0) - (be.in_profit || 0)} size="small" sx={{ height: 18, fontSize: "0.55rem", bgcolor: alpha(DANGER, 0.1), color: DANGER, fontWeight: 700 }} />
            </Stack>
          </Stack>
          {(be.total || 0) - (be.in_profit || 0) > 0 && (
            <Insight color={WARNING}>{(be.total || 0) - (be.in_profit || 0)} promoter ricevono bonus ma non generano vendite sufficienti</Insight>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

// ═══════════════════════════════════════
// 6. TOP 10 + COHORT
// ═══════════════════════════════════════
const Top10 = () => {
  const { data: n } = useFetch("api/wp/admin/kpi/network");
  const top = n?.top10 || [];
  if (!top.length) return null;
  const top5 = top.slice(0, 5);
  const rest = top.slice(5);
  const restPct = rest.reduce((s, t) => s + t.pct, 0);

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT }}>Top 10 promoter per fatturato</Typography>
        <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>% del fatturato totale</Typography>
      </Stack>
      <Stack spacing={1}>
        {top5.map((t, i) => {
          const riskColor = t.pct > 20 ? DANGER : t.pct > 10 ? WARNING : SUCCESS;
          return (
            <Stack key={t.user_id} direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(ORO, 0.1), color: ORO, fontSize: 11, fontWeight: 700 }}>{i + 1}</Avatar>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: riskColor }} />
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: TEXT, flex: 1 }} noWrap>{t.name || t.username}</Typography>
              <Box sx={{ width: 70 }}><LinearProgress variant="determinate" value={Math.min(t.pct * 2, 100)} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(ORO, 0.1), "& .MuiLinearProgress-bar": { bgcolor: ORO, borderRadius: 2 } }} /></Box>
              <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: ORO, width: 35, textAlign: "right" }}>{t.pct}%</Typography>
            </Stack>
          );
        })}
        {rest.length > 0 && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ pt: 0.5, borderTop: "1px solid #f0ece6" }}>
            <Typography sx={{ fontSize: "0.65rem", color: MUTED, flex: 1 }}>6-10 altri {rest.length}</Typography>
            <Box sx={{ width: 70 }}><LinearProgress variant="determinate" value={Math.min(restPct * 2, 100)} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(ORO, 0.1), "& .MuiLinearProgress-bar": { bgcolor: alpha(ORO, 0.4), borderRadius: 2 } }} /></Box>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: MUTED, width: 35, textAlign: "right" }}>{restPct.toFixed(0)}%</Typography>
          </Stack>
        )}
      </Stack>
      <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
        {[{ l: "Rischio alto", c: DANGER }, { l: "Monitorare", c: WARNING }, { l: "Sano", c: SUCCESS }].map(x => (
          <Stack key={x.l} direction="row" alignItems="center" spacing={0.3}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: x.c }} />
            <Typography sx={{ fontSize: "0.5rem", color: MUTED }}>{x.l}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

const CohortAnalysis = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/cohort");
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={200} /></Card>;
  if (!data || !data.length) return null;
  const maxCols = Math.max(...data.map(d => d.retention?.length || 0));
  const getColor = (v) => v >= 80 ? SUCCESS : v >= 50 ? "#8BC34A" : v >= 30 ? WARNING : v >= 10 ? "#FF9800" : DANGER;

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%", overflow: "auto" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Cohort analysis — retention per mese</Typography>
      <Box sx={{ overflowX: "auto" }}>
        {/* Header */}
        <Stack direction="row" spacing={0.5} mb={0.5}>
          <Box sx={{ width: 70, flexShrink: 0 }}><Typography sx={{ fontSize: "0.55rem", fontWeight: 700, color: MUTED }}>Cohort</Typography></Box>
          {Array.from({ length: maxCols }, (_, i) => (
            <Box key={i} sx={{ width: 44, textAlign: "center", flexShrink: 0 }}>
              <Typography sx={{ fontSize: "0.55rem", fontWeight: 700, color: MUTED }}>M{i + 1}</Typography>
            </Box>
          ))}
        </Stack>
        {/* Rows */}
        {data.map((row) => (
          <Stack key={row.mese} direction="row" spacing={0.5} mb={0.5} alignItems="center">
            <Box sx={{ width: 70, flexShrink: 0 }}>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: TEXT }}>{row.mese}</Typography>
              <Typography sx={{ fontSize: "0.45rem", color: row.total > 0 ? SUCCESS : MUTED }}>{row.total} utenti</Typography>
            </Box>
            {(row.retention || []).map((v, i) => (
              <Box key={i} sx={{ width: 44, height: 30, borderRadius: 1, bgcolor: alpha(getColor(v), 0.15), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: getColor(v) }}>{v}%</Typography>
              </Box>
            ))}
            {/* Fill empty cells */}
            {Array.from({ length: maxCols - (row.retention?.length || 0) }, (_, i) => (
              <Box key={`e${i}`} sx={{ width: 44, height: 30, flexShrink: 0 }}>
                <Typography sx={{ fontSize: "0.6rem", color: "#ddd", textAlign: "center" }}>—</Typography>
              </Box>
            ))}
          </Stack>
        ))}
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════
// 7. HEATMAP + RANK VELOCITY
// ═══════════════════════════════════════
const HOUR_SLOTS = ["8-12", "12-18", "18-22", "22-8"];
const DAY_LABELS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

const OrderHeatmap = () => {
  const { data: ops } = useFetch("api/wp/admin/kpi/operations");
  const heatmap = ops?.heatmap || [];
  if (!heatmap.length) return null;
  const grid = Array.from({ length: 4 }, () => Array(7).fill(0));
  heatmap.forEach((h) => {
    const dayIdx = ((h.dow + 5) % 7);
    let slotIdx;
    if (h.hora >= 8 && h.hora < 12) slotIdx = 0;
    else if (h.hora >= 12 && h.hora < 18) slotIdx = 1;
    else if (h.hora >= 18 && h.hora < 22) slotIdx = 2;
    else slotIdx = 3;
    grid[slotIdx][dayIdx] += h.cnt;
  });
  const maxCnt = Math.max(...grid.flat(), 1);
  // Find peak
  let peakSlot = 0, peakDay = 0, peakVal = 0;
  grid.forEach((row, si) => row.forEach((v, di) => { if (v > peakVal) { peakVal = v; peakSlot = si; peakDay = di; } }));

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Heatmap ordini — giorno/fascia oraria</Typography>
      <Stack spacing={0.5}>
        <Stack direction="row" spacing={0.5}>
          <Box sx={{ width: 50 }} />
          {DAY_LABELS.map(d => <Box key={d} sx={{ flex: 1, textAlign: "center" }}><Typography sx={{ fontSize: "0.55rem", fontWeight: 600, color: MUTED }}>{d}</Typography></Box>)}
        </Stack>
        {grid.map((row, si) => (
          <Stack key={si} direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 50 }}><Typography sx={{ fontSize: "0.5rem", color: MUTED }}>{HOUR_SLOTS[si]}</Typography></Box>
            {row.map((cnt, di) => {
              const intensity = cnt / maxCnt;
              const isPeak = si === peakSlot && di === peakDay;
              return (
                <Box key={di} sx={{ flex: 1, height: 34, borderRadius: 1.5, bgcolor: cnt > 0 ? alpha(ORO, 0.08 + intensity * 0.55) : "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", border: isPeak ? `2px solid ${ORO}` : "none" }}>
                  <Typography sx={{ fontSize: "0.65rem", fontWeight: cnt > 0 ? 700 : 400, color: intensity > 0.6 ? "#fff" : cnt > 0 ? TEXT : "#ddd" }}>{cnt || ""}</Typography>
                </Box>
              );
            })}
          </Stack>
        ))}
      </Stack>
      <Insight color={ORO} icon="mdi:chart-timeline-variant">
        Picco: {DAY_LABELS[peakDay]} {HOUR_SLOTS[peakSlot]} ({peakVal} ordini). Ottimizza notifiche push in questa fascia.
      </Insight>
    </Card>
  );
};

const RankVelocity = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/rank-velocity");
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={200} /></Card>;
  if (!data || !data.length) return <Card sx={{ ...cardSx, p: 3 }}><Typography sx={{ fontSize: "0.75rem", color: MUTED }}>Nessun dato rank velocity</Typography></Card>;
  const maxDays = Math.max(...data.map(d => d.avg_days), 60);
  const slowest = data.reduce((a, b) => b.avg_days > a.avg_days ? b : a, data[0]);

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Velocity per rank — tempo medio avanzamento</Typography>
      <Stack spacing={1.5}>
        {data.map((r, i) => {
          const barColor = r.avg_days > 60 ? DANGER : r.avg_days > 30 ? WARNING : SUCCESS;
          return (
            <Box key={i}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.3}>
                <Typography sx={{ fontSize: "0.68rem", color: TEXT, fontWeight: 600 }}>{r.from} → {r.to}</Typography>
                <Stack direction="row" alignItems="center" spacing={0.3}>
                  <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: barColor }}>{r.avg_days}gg</Typography>
                  {r.alert && <Iconify icon="mdi:alert" width={14} sx={{ color: DANGER }} />}
                </Stack>
              </Stack>
              <LinearProgress variant="determinate" value={Math.min((r.avg_days / maxDays) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: alpha(barColor, 0.1), "& .MuiLinearProgress-bar": { bgcolor: barColor, borderRadius: 4 } }} />
              <Typography sx={{ fontSize: "0.5rem", color: MUTED, mt: 0.2 }}>{r.count} transizioni</Typography>
            </Box>
          );
        })}
      </Stack>
      {slowest && slowest.avg_days > 60 && (
        <Insight color={DANGER} icon="mdi:alert-circle">
          {slowest.from} → {slowest.to} richiede {slowest.avg_days} giorni — troppo lungo. Valuta un rank intermedio.
        </Insight>
      )}
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
  const atRisk = inv.filter(p => p.stock < p.forecast * 0.5);

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Inventory forecast — fabbisogno prossimo mese</Typography>
      <Stack spacing={1.5}>
        {inv.slice(0, 6).map((p, i) => {
          const status = p.stock >= p.forecast ? "ok" : p.stock >= p.forecast * 0.5 ? "attenzione" : "riordina";
          const sc = status === "ok" ? SUCCESS : status === "attenzione" ? WARNING : DANGER;
          return (
            <Stack key={i} direction="row" alignItems="center" spacing={1}>
              <Typography sx={{ fontSize: "0.72rem", color: TEXT, fontWeight: 700, flex: 1 }} noWrap>{p.product || "N/A"}</Typography>
              <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>Stock: {p.stock}</Typography>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: sc }}>Need: {p.forecast}</Typography>
              <Chip label={status} size="small" sx={{ height: 18, fontSize: "0.5rem", fontWeight: 700, bgcolor: alpha(sc, 0.1), color: sc }} />
            </Stack>
          );
        })}
      </Stack>
      {atRisk.length > 0 && (
        <Insight color={DANGER} icon="mdi:alert">{atRisk.map(p => p.product).join(", ")}: rischio stockout. Contatta fornitore subito.</Insight>
      )}
    </Card>
  );
};

const AgingCommissions = () => {
  const { data: ops } = useFetch("api/wp/admin/kpi/operations");
  const aging = ops?.aging;
  if (!aging) return null;
  const bands = [
    { label: "Meno di 30 giorni", value: aging.lt30 || 0, color: SUCCESS, badge: "attivi" },
    { label: "30-60 giorni", value: aging.d30_60 || 0, color: WARNING, badge: "monit." },
    { label: "60-90 giorni", value: aging.d60_90 || 0, color: "#FF9800", badge: "rischio" },
    { label: "Oltre 90 giorni", value: aging.gt90 || 0, color: DANGER, badge: "dormiente" },
  ];
  const total = bands.reduce((s, b) => s + b.value, 0);
  const overSixty = (aging.d60_90 || 0) + (aging.gt90 || 0);

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Pending commissions aging</Typography>
      <Stack spacing={1.5}>
        {bands.map((b) => (
          <Box key={b.label}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.3}>
              <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600 }}>{b.label}</Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography sx={{ fontSize: "0.7rem", color: b.color, fontWeight: 700 }}>€{b.value.toFixed(0)}</Typography>
                <Chip label={b.badge} size="small" sx={{ height: 16, fontSize: "0.45rem", fontWeight: 700, bgcolor: alpha(b.color, 0.1), color: b.color }} />
              </Stack>
            </Stack>
            <LinearProgress variant="determinate" value={total > 0 ? (b.value / total) * 100 : 0} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(b.color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: b.color, borderRadius: 3 } }} />
          </Box>
        ))}
      </Stack>

      {/* Forecast */}
      <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2 }}>
        <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: TEXT, mb: 0.5 }}>Forecast 30/60/90 giorni</Typography>
        {[
          { label: "+30g (85%)", value: Math.round(total * 0.85) },
          { label: "+60g (70%)", value: Math.round(total * 0.70) },
          { label: "+90g (55%)", value: Math.round(total * 0.55) },
        ].map((f) => (
          <Stack key={f.label} direction="row" justifyContent="space-between" sx={{ py: 0.3 }}>
            <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>{f.label}</Typography>
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: TEXT }}>€{f.value.toLocaleString("it")}</Typography>
          </Stack>
        ))}
      </Box>

      {overSixty > 0 && (
        <Insight color={DANGER}>€{overSixty.toFixed(0)} fermi oltre 60 giorni — probabilmente utenti inattivi. Contatta prima di fare write-off.</Insight>
      )}
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
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700} color={ESPRESSO} sx={{ pt: 1 }}>KPI Dashboard</Typography>

          <RiskAlert />
          <OverviewCards />

          <Section>Revenue &amp; Performance</Section>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}><RevenueChart /></Grid>
            <Grid item xs={12} md={5}><WeeklyComparison /></Grid>
          </Grid>

          <Section>Product mix, geografia e segmentazione clienti</Section>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><ProductMix /></Grid>
            <Grid item xs={12} md={4}><GeoDistribution /></Grid>
            <Grid item xs={12} md={4}><ClientSegmentation /></Grid>
          </Grid>

          <Section>Revenue Health — NRR, LTV/CAC, Breakeven</Section>
          <RevenueHealth />

          <Section>Top 10 promoter per fatturato &amp; Cohort Analysis</Section>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}><Top10 /></Grid>
            <Grid item xs={12} md={7}><CohortAnalysis /></Grid>
          </Grid>

          <Section>Heatmap ordini &amp; Rank Velocity</Section>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><OrderHeatmap /></Grid>
            <Grid item xs={12} md={6}><RankVelocity /></Grid>
          </Grid>

          <Section>Inventory forecast &amp; Pending commissions</Section>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><InventoryForecast /></Grid>
            <Grid item xs={12} md={6}><AgingCommissions /></Grid>
          </Grid>
        </Stack>
      </Box>
    </Page>
  );
};

export default KpiDashboard;
