import {
  Avatar, Box, Button, ButtonGroup, Card, Chip, Grid, LinearProgress, Skeleton, Stack, TextField, Tooltip, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
// PERIOD CONTEXT
// ═══════════════════════════════════════
const PeriodCtx = createContext({ qs: "" });
const usePeriod = () => useContext(PeriodCtx);

const PeriodFilter = ({ period, setPeriod, customFrom, setCustomFrom, customTo, setCustomTo }) => {
  const periods = [
    { key: "week", label: "Settimana" },
    { key: "month", label: "Mese" },
    { key: "quarter", label: "Trimestre" },
    { key: "ytd", label: "YTD" },
    { key: "year", label: "Anno" },
    { key: "custom", label: "Custom" },
  ];
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
      <ButtonGroup size="small" sx={{ "& .MuiButton-root": { textTransform: "none", fontSize: "0.72rem", fontWeight: 600, borderColor: alpha(ORO, 0.3) } }}>
        {periods.map((p) => (
          <Button key={p.key} onClick={() => setPeriod(p.key)}
            sx={{ bgcolor: period === p.key ? ORO : "transparent", color: period === p.key ? "#fff" : TEXT, "&:hover": { bgcolor: period === p.key ? ORO : alpha(ORO, 0.08) } }}>
            {p.label}
          </Button>
        ))}
      </ButtonGroup>
      {period === "custom" && (
        <Stack direction="row" spacing={1}>
          <TextField size="small" type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} sx={{ "& input": { fontSize: "0.72rem", py: 0.5 } }} />
          <TextField size="small" type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} sx={{ "& input": { fontSize: "0.72rem", py: 0.5 } }} />
        </Stack>
      )}
    </Stack>
  );
};

// ═══════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════
const useFetch = (url, addPeriod = false) => {
  const { qs } = usePeriod();
  const finalUrl = addPeriod ? `${url}${url.includes("?") ? "&" : "?"}${qs}` : url;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let off = false;
    setLoading(true);
    (async () => {
      try { const { data: r } = await axiosInstance.get(finalUrl); if (!off) setData(r?.data); }
      catch { /* silent */ }
      if (!off) setLoading(false);
    })();
    return () => { off = true; };
  }, [finalUrl]);
  return { data, loading };
};

// ═══════════════════════════════════════
// SHARED
// ═══════════════════════════════════════
const Section = ({ children }) => <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 1.2, mb: 1.5, mt: 2 }}>{children}</Typography>;
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
const Donut = ({ segments, size = 120 }) => {
  const r = 42; const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {total > 0 && segments.map((seg, i) => { const pct = seg.value / total; const dash = pct * circ; const rotation = offset * 360 - 90; offset += pct; return <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={seg.color} strokeWidth="14" strokeDasharray={`${dash} ${circ - dash}`} transform={`rotate(${rotation} 50 50)`} />; })}
      <circle cx="50" cy="50" r="32" fill="#fff" />
    </svg>
  );
};

// ═══════════════════════════════════════
// 1. RISK ALERT
// ═══════════════════════════════════════
const RiskAlert = () => {
  const { data } = useFetch("api/wp/admin/kpi/risk-alert", true);
  if (!data || !data.length) return null;
  const top = data[0];
  return (
    <Box sx={{ bgcolor: "#FCEBEB", border: `1.5px solid ${DANGER}`, borderRadius: 3, p: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(DANGER, 0.15), color: DANGER }}><Iconify icon="mdi:alert" width={22} /></Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: DANGER }}>Rischio concentrazione — Leader critico rilevato</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: TEXT }}><b>{top.name || top.username}</b> genera il <b>{top.pct}%</b> del fatturato. Soglia superata (20-30%). Diversificare urgentemente.</Typography>
        </Box>
      </Stack>
    </Box>
  );
};

// ═══════════════════════════════════════
// 2. BIG KPI CARDS
// ═══════════════════════════════════════
const OverviewCards = () => {
  const { data: o, loading } = useFetch("api/wp/admin/kpi/overview", true);
  if (loading) return <Grid container spacing={2}>{[0,1,2,3].map(i => <Grid item xs={6} md={3} key={i}><Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} /></Grid>)}</Grid>;
  if (!o) return null;
  const cards = [
    { label: "FATTURATO PERIODO", value: `€${(o.fatturato_mese || 0).toLocaleString("it")}`, sub: `${o.fatturato_delta >= 0 ? "+" : ""}${o.fatturato_delta}% vs periodo prec · ${o.totale_ordini || 0} ordini`, color: ORO },
    { label: "MRR — SMARTSHIP", value: `€${(o.mrr_smartship || 0).toLocaleString("it")}`, sub: `${o.mrr_pct || 0}% del fatturato ricorrente`, color: "#8BC34A" },
    { label: "PROVVIGIONI MATURATE", value: `€${(o.provvigioni || 0).toLocaleString("it")}`, sub: `Payout ratio: ${o.payout_ratio || 0}% · AOV: €${o.aov || 0}`, color: DANGER },
    { label: "SMARTSHIP ATTIVI", value: o.smartship_attivi || 0, sub: `${o.smartship_delta >= 0 ? "+" : ""}${o.smartship_delta || 0} vs prec · Refund: ${o.refund_rate || 0}%`, color: INFO },
  ];
  return (
    <Grid container spacing={2}>
      {cards.map((c, i) => (
        <Grid item xs={6} md={3} key={i}>
          <Card sx={{ bgcolor: ESPRESSO, borderRadius: 3, p: 2.5, height: "100%" }}>
            <Typography sx={{ fontSize: "0.55rem", color: alpha("#fff", 0.5), textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>{c.label}</Typography>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", mt: 0.5, lineHeight: 1.1 }}>{c.value}</Typography>
            <Typography sx={{ fontSize: "0.6rem", color: alpha("#fff", 0.45), mt: 0.5 }}>{c.sub}</Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// ═══════════════════════════════════════
// 3. REVENUE CHART + WEEKLY + DAILY
// ═══════════════════════════════════════
const MESI = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
const GIORNI_SETT = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];

const RevenueChart = () => {
  const { qs } = usePeriod();
  const period = new URLSearchParams(qs).get("period") || "month";

  // For week/month: use daily-revenue endpoint
  // For quarter/year/ytd: use revenue-history (monthly)
  const isDaily = period === "week" || period === "month";
  const days = period === "week" ? 7 : 30;
  const months = period === "quarter" ? 3 : 12;

  const dailyUrl = `api/wp/admin/kpi/daily-revenue?days=${days}`;
  const monthlyUrl = `api/wp/admin/kpi/revenue-history?months=${months}`;

  const { data: dailyData, loading: dLoad } = useFetch(isDaily ? dailyUrl : "___skip___");
  const { data: monthlyData, loading: mLoad } = useFetch(!isDaily ? monthlyUrl : "___skip___");

  const loading = isDaily ? dLoad : mLoad;

  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={250} /></Card>;

  // Normalize data to [{label, revenue, payout?, margine?}]
  let chartData = [];
  let subtitle = "";

  if (isDaily) {
    const raw = dailyData || [];
    // Fill all days in range with 0 where no data
    const dataMap = {};
    raw.forEach((d) => { dataMap[d.giorno] = d; });
    const allDays = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const entry = dataMap[key];
      allDays.push({
        label: period === "week"
          ? d.toLocaleDateString("it", { weekday: "short" })
          : d.toLocaleDateString("it", { day: "2-digit", month: "short" }),
        revenue: entry ? Number(entry.revenue) || 0 : 0,
        orders: entry ? Number(entry.ordini) || 0 : 0,
      });
    }
    chartData = allDays;
    subtitle = period === "week" ? "Ultimi 7 giorni" : "Ultimi 30 giorni";
  } else {
    const raw = monthlyData || [];
    const dataMap = {};
    raw.forEach((d) => { dataMap[`${d.anno}-${d.mese}`] = d; });
    const allMonths = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const entry = dataMap[key];
      allMonths.push({
        label: MESI[d.getMonth()],
        revenue: entry ? entry.fatturato || 0 : 0,
        payout: entry ? entry.payout || 0 : 0,
        margine: entry ? entry.margine || 0 : 0,
      });
    }
    chartData = allMonths;
    subtitle = `${months} mesi`;
  }

  if (!chartData.length) return <Card sx={{ ...cardSx, p: 3 }}><Typography sx={{ fontSize: "0.75rem", color: MUTED }}>Nessun dato per questo periodo</Typography></Card>;

  const maxVal = Math.max(...chartData.map(d => Math.max(d.revenue || 0, d.payout || 0, d.margine || 0)), 1);
  const totalRev = chartData.reduce((s, d) => s + (d.revenue || 0), 0);
  const totalOrd = chartData.reduce((s, d) => s + (d.orders || 0), 0);

  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT }}>
            {isDaily ? "Revenue giornaliero" : "Fatturato vs Payout"}
          </Typography>
          <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>{subtitle} · Tot: €{totalRev.toLocaleString("it")}{totalOrd > 0 ? ` · ${totalOrd} ordini` : ""}</Typography>
        </Box>
        {!isDaily && (
          <Stack direction="row" spacing={1.5}>{[{ l: "Fatturato", c: ORO }, { l: "Payout", c: DANGER }, { l: "Margine", c: SUCCESS }].map(x => (
            <Stack key={x.l} direction="row" alignItems="center" spacing={0.3}><Box sx={{ width: 10, height: 3, borderRadius: 1, bgcolor: x.c }} /><Typography sx={{ fontSize: "0.55rem", color: MUTED }}>{x.l}</Typography></Stack>))}</Stack>
        )}
      </Stack>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: isDaily ? "2px" : "6px", height: 200 }}>
        {chartData.map((d, i) => {
          const barH = 180; // max bar height in px
          if (isDaily) {
            const h = Math.max((d.revenue / maxVal) * barH, 2);
            return (
              <Box key={i} sx={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                <Tooltip title={`€${d.revenue}${d.orders ? ` · ${d.orders} ordini` : ""}`}>
                  <Box sx={{ width: "70%", mx: "auto", height: h, bgcolor: d.revenue > 0 ? ORO : alpha(ORO, 0.08), borderRadius: "3px 3px 0 0", transition: "height 0.3s", minHeight: 2 }} />
                </Tooltip>
                <Typography sx={{ fontSize: chartData.length > 15 ? "0.38rem" : "0.5rem", color: d.revenue > 0 ? ORO : MUTED, mt: 0.3, whiteSpace: "nowrap", fontWeight: d.revenue > 0 ? 600 : 400 }}>{d.label}</Typography>
              </Box>
            );
          } else {
            return (
              <Box key={i} sx={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                <Box sx={{ display: "flex", gap: "1px", justifyContent: "center", alignItems: "flex-end", flex: 1 }}>
                  {[{ v: d.revenue, c: ORO }, { v: d.payout, c: DANGER }, { v: d.margine, c: SUCCESS }].map((b, bi) => {
                    const bh = Math.max((b.v / maxVal) * barH, 1);
                    return <Tooltip key={bi} title={`€${b.v}`}><Box sx={{ width: "30%", height: bh, bgcolor: b.c, borderRadius: "2px 2px 0 0", opacity: 0.85 }} /></Tooltip>;
                  })}
                </Box>
                <Typography sx={{ fontSize: "0.5rem", color: MUTED, mt: 0.3 }}>{d.label}</Typography>
              </Box>
            );
          }
        })}
      </Box>
    </Card>
  );
};

const WeeklyComparison = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/weekly-comparison");
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={250} /></Card>;
  if (!data || !data.length) return null;
  const maxRev = Math.max(...data.flatMap(d => [d.revenue_current, d.revenue_previous]), 1);
  const totalCur = data.reduce((s, d) => s + d.revenue_current, 0);
  const totalPrev = data.reduce((s, d) => s + d.revenue_previous, 0);
  const delta = totalPrev > 0 ? ((totalCur - totalPrev) / totalPrev * 100).toFixed(0) : 0;
  const totalOrd = data.reduce((s, d) => s + (d.orders_current || 0), 0);
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Confronto settimana corrente vs precedente</Typography>
      <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ height: 140 }}>
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
      <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
        <Grid item xs={6}><Box sx={{ p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.1)}`, textAlign: "center" }}>
          <Typography sx={{ fontSize: "0.55rem", color: MUTED }}>Questa settimana</Typography>
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: TEXT }}>€{totalCur.toLocaleString("it")}</Typography>
          <Typography sx={{ fontSize: "0.55rem", color: delta >= 0 ? SUCCESS : DANGER }}>{delta >= 0 ? "+" : ""}{delta}% vs prec</Typography>
        </Box></Grid>
        <Grid item xs={6}><Box sx={{ p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.1)}`, textAlign: "center" }}>
          <Typography sx={{ fontSize: "0.55rem", color: MUTED }}>Ordini questa settimana</Typography>
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: TEXT }}>{totalOrd}</Typography>
        </Box></Grid>
      </Grid>
    </Card>
  );
};

// ═══════════════════════════════════════
// 4. REVENUE BREAKDOWN (Kit/Smartship/Singoli)
// ═══════════════════════════════════════
const RevenueBreakdown = () => {
  const { data: rb, loading } = useFetch("api/wp/admin/kpi/revenue-breakdown", true);
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={200} /></Card>;
  if (!rb) return null;
  const segments = [
    { label: "Starter Kit", value: rb.kit || 0, color: ORO, pct: rb.kit_pct },
    { label: "Smartship", value: rb.smartship || 0, color: SUCCESS, pct: rb.smartship_pct },
    { label: "Ordini singoli", value: rb.single || 0, color: INFO, pct: rb.single_pct },
  ];
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 1.5 }}>Revenue Breakdown</Typography>
      <Box sx={{ textAlign: "center", mb: 2 }}><Donut segments={segments} size={110} /></Box>
      <Stack spacing={1}>
        {segments.map((s) => (
          <Stack key={s.label} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600, flex: 1 }}>{s.label}</Typography>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: s.color }}>€{s.value.toLocaleString("it")} ({s.pct}%)</Typography>
          </Stack>
        ))}
      </Stack>
      {rb.kits_detail && rb.kits_detail.length > 0 && (
        <Box sx={{ mt: 1.5, p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2 }}>
          <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: MUTED, mb: 0.5 }}>Kit venduti</Typography>
          {rb.kits_detail.map((k, i) => (
            <Stack key={i} direction="row" justifyContent="space-between" sx={{ py: 0.2 }}>
              <Typography sx={{ fontSize: "0.6rem", color: TEXT }}>{k.name}</Typography>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: TEXT }}>{k.cnt}x · €{Number(k.rev).toLocaleString("it")}</Typography>
            </Stack>
          ))}
        </Box>
      )}
      {rb.kit_conversion_rate > 0 && (
        <Insight color={SUCCESS} icon="mdi:check-circle">Conversione kit (entro 7gg): {rb.kit_conversion_rate}% ({rb.kit_conversion_7d}/{rb.new_users} nuovi utenti)</Insight>
      )}
    </Card>
  );
};

// ═══════════════════════════════════════
// 5. ACTIVATION + SPONSOR EFFECTIVENESS
// ═══════════════════════════════════════
const ActivationCard = () => {
  const { data: act, loading } = useFetch("api/wp/admin/kpi/activation", true);
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={200} /></Card>;
  if (!act) return null;
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Activation & Onboarding</Typography>
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {[
          { label: "Nuovi iscritti", value: act.total_new_users, color: INFO },
          { label: "Attivati", value: act.activated, color: SUCCESS },
          { label: "Activation rate", value: `${act.activation_rate}%`, color: act.activation_rate >= 50 ? SUCCESS : WARNING },
          { label: "Tempo 1° ordine", value: `${act.time_to_first_order}gg`, color: act.time_to_first_order <= 7 ? SUCCESS : WARNING },
        ].map((m) => (
          <Grid item xs={6} key={m.label}>
            <Box sx={{ p: 1.5, bgcolor: alpha(m.color, 0.04), borderRadius: 2, border: `1px solid ${alpha(m.color, 0.1)}`, textAlign: "center" }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: m.color }}>{m.value}</Typography>
              <Typography sx={{ fontSize: "0.55rem", color: MUTED }}>{m.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      {act.sponsor_effectiveness && act.sponsor_effectiveness.length > 0 && (
        <>
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: TEXT, mb: 1 }}>Top Sponsor per efficacia</Typography>
          <Stack spacing={0.8}>
            {act.sponsor_effectiveness.slice(0, 5).map((s) => (
              <Stack key={s.user_id} direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: "0.68rem", color: TEXT, fontWeight: 600, flex: 1 }} noWrap>@{s.username}</Typography>
                <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>{s.total_referred} ref</Typography>
                <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>{s.active_referred} attivi</Typography>
                <Chip label={`${s.effectiveness}%`} size="small" sx={{ height: 18, fontSize: "0.5rem", fontWeight: 700, bgcolor: alpha(s.effectiveness >= 50 ? SUCCESS : WARNING, 0.1), color: s.effectiveness >= 50 ? SUCCESS : WARNING }} />
              </Stack>
            ))}
          </Stack>
        </>
      )}
    </Card>
  );
};

// ═══════════════════════════════════════
// 6. COMMISSION BREAKDOWN
// ═══════════════════════════════════════
const COMM_COLORS = { direct_sales_bonus: ORO, residual_bonus: SUCCESS, go_mvp_bonus: "#4CAF50", indirect_sales_bonus: INFO, leadership_bonus: "#9C27B0", rock_solid_bonus: "#455A64", evolving_bonus: "#FF5722", pmb_bonus: "#795548", residual_matching_bonus: WARNING, three_ff_bonus: "#E91E63", rock_solid_mvp_bonus: "#2196F3" };
const CommissionBreakdown = () => {
  const { data: cb, loading } = useFetch("api/wp/admin/kpi/commission-breakdown", true);
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={200} /></Card>;
  if (!cb) return null;
  const items = cb.breakdown || [];
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT }}>Commissioni per tipo</Typography>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: ORO }}>Tot: €{(cb.total || 0).toLocaleString("it")}</Typography>
      </Stack>
      <Stack spacing={1}>
        {items.map((c) => {
          const clr = COMM_COLORS[c.type] || ORO;
          return (
            <Box key={c.type}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.3}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: clr }} />
                  <Typography sx={{ fontSize: "0.68rem", color: TEXT, fontWeight: 600 }}>{c.label}</Typography>
                </Stack>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: clr }}>€{c.total} ({c.pct}%)</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={c.pct} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(clr, 0.1), "& .MuiLinearProgress-bar": { bgcolor: clr, borderRadius: 2 } }} />
            </Box>
          );
        })}
      </Stack>
    </Card>
  );
};

// ═══════════════════════════════════════
// EXISTING SECTIONS (kept from v1 - product mix, geo, segmentation, network, top10, cohort, heatmap, rank velocity, inventory, aging)
// ═══════════════════════════════════════
const PROD_COLORS = [ESPRESSO, ORO, "#D4B86A", SUCCESS, WARNING, INFO, DANGER, "#9C27B0"];
const ProductMix = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/product-mix", true);
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={200} /></Card>;
  if (!data || !data.length) return null;
  const segments = data.slice(0, 6).map((p, i) => ({ value: p.revenue, color: PROD_COLORS[i % PROD_COLORS.length], label: p.product || "N/A", pct: p.pct, orders: p.orders }));
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 1 }}>Revenue per prodotto</Typography>
      <Box sx={{ textAlign: "center", mb: 2 }}><Donut segments={segments} size={120} /></Box>
      <Stack spacing={0.8}>
        {segments.map((s) => (
          <Stack key={s.label} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color, flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.68rem", color: TEXT, fontWeight: 600, flex: 1 }} noWrap>{s.label}</Typography>
            <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>{s.orders}x</Typography>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: TEXT }}>{s.pct}%</Typography>
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
  const total = geo.reduce((s, g) => s + g.cnt, 0);
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Distribuzione geografica</Typography>
      <Stack spacing={1.5}>
        {geo.slice(0, 5).map((g) => (
          <Stack key={g.country} direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: TEXT, width: 24 }}>{(g.country || "N/A").substring(0, 2).toUpperCase()}</Typography>
            <Typography sx={{ fontSize: "0.68rem", color: TEXT, flex: 1 }}>{g.country || "N/A"}</Typography>
            <Box sx={{ width: 60 }}><LinearProgress variant="determinate" value={total > 0 ? (g.cnt / total) * 100 : 0} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(SUCCESS, 0.1), "& .MuiLinearProgress-bar": { bgcolor: SUCCESS, borderRadius: 3 } }} /></Box>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: TEXT }}>{total > 0 ? Math.round(g.cnt / total * 100) : 0}%</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

const ClientSegmentation = () => {
  const { data: cl, loading } = useFetch("api/wp/admin/kpi/clients", true);
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={250} /></Card>;
  if (!cl) return null;
  const seg = cl.segmentation || {};
  const total = (seg.smartship || 0) + (seg.repeat_2plus || 0) + (seg.one_time || 0);
  const segments = [
    { label: "Smartship", value: seg.smartship || 0, color: SUCCESS },
    { label: "Repeat 2+", value: seg.repeat_2plus || 0, color: INFO },
    { label: "One-time", value: seg.one_time || 0, color: WARNING },
  ];
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 1.5 }}>Segmentazione clienti</Typography>
      <Box sx={{ textAlign: "center", mb: 2 }}><Donut segments={segments} size={110} /></Box>
      <Stack spacing={1}>
        {segments.map((s) => (
          <Stack key={s.label} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontSize: "0.68rem", color: TEXT, flex: 1 }}>{s.label}</Typography>
            <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: TEXT }}>{s.value}</Typography>
            <Chip label={`${total > 0 ? Math.round(s.value / total * 100) : 0}%`} size="small" sx={{ height: 18, fontSize: "0.55rem", fontWeight: 700, bgcolor: alpha(s.color, 0.1), color: s.color }} />
          </Stack>
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

const NetworkKPIs = () => {
  const { data: n, loading } = useFetch("api/wp/admin/kpi/network", true);
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={200} /></Card>;
  if (!n) return null;
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Network</Typography>
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {[{ label: "Attivi", value: n.distributori_attivi, sub: `/ ${n.distributori_totali}`, color: SUCCESS }, { label: "Nuovi", value: n.nuovi_distributori, color: INFO }, { label: "Rank Up", value: n.rank_advancement, color: ORO }, { label: "€/Promoter", value: `€${n.revenue_per_promoter}`, color: ORO }].map((m) => (
          <Grid item xs={6} key={m.label}><Box sx={{ p: 1.5, bgcolor: alpha(m.color, 0.04), borderRadius: 2, border: `1px solid ${alpha(m.color, 0.1)}`, textAlign: "center" }}>
            <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: m.color }}>{m.value}</Typography>
            <Typography sx={{ fontSize: "0.55rem", color: MUTED }}>{m.label}{m.sub || ""}</Typography>
          </Box></Grid>
        ))}
      </Grid>
      {n.breakeven && <Box sx={{ p: 1.5, bgcolor: alpha(SUCCESS, 0.04), borderRadius: 2, border: `1px solid ${alpha(SUCCESS, 0.1)}` }}>
        <Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600 }}>Breakeven: <b style={{ color: SUCCESS }}>{n.breakeven.in_profit}</b>/{n.breakeven.total} in utile</Typography>
        <LinearProgress variant="determinate" value={n.breakeven.total > 0 ? (n.breakeven.in_profit / n.breakeven.total) * 100 : 0} sx={{ height: 5, borderRadius: 3, mt: 0.5, bgcolor: alpha(SUCCESS, 0.1), "& .MuiLinearProgress-bar": { bgcolor: SUCCESS, borderRadius: 3 } }} />
      </Box>}
    </Card>
  );
};

const MEDAL_COLORS = [ORO, "#A0A0A0", "#CD7F32"];
const Top10 = () => {
  const { data: n } = useFetch("api/wp/admin/kpi/network", true);
  const top = n?.top10 || [];
  if (!top.length) return null;
  const top5 = top.slice(0, 5);
  const rest = top.slice(5);
  const restPct = rest.reduce((s, t) => s + t.pct, 0);
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Top 10 promoter per fatturato</Typography>
      <Stack spacing={0.8}>
        {top5.map((t, i) => (
          <Stack key={t.user_id} direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 22, height: 22, bgcolor: alpha(ORO, 0.1), color: ORO, fontSize: 10, fontWeight: 700 }}>{i + 1}</Avatar>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: t.pct > 20 ? DANGER : t.pct > 10 ? WARNING : SUCCESS }} />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: TEXT, flex: 1 }} noWrap>{t.name || t.username}</Typography>
            <Box sx={{ width: 60 }}><LinearProgress variant="determinate" value={Math.min(t.pct * 2, 100)} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(ORO, 0.1), "& .MuiLinearProgress-bar": { bgcolor: ORO, borderRadius: 2 } }} /></Box>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ORO, width: 35, textAlign: "right" }}>{t.pct}%</Typography>
          </Stack>
        ))}
        {rest.length > 0 && <Stack direction="row" alignItems="center" spacing={1} sx={{ pt: 0.5, borderTop: "1px solid #f0ece6" }}>
          <Typography sx={{ fontSize: "0.6rem", color: MUTED, flex: 1 }}>6-10 altri {rest.length}</Typography>
          <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: MUTED }}>{restPct.toFixed(0)}%</Typography>
        </Stack>}
      </Stack>
    </Card>
  );
};

const CohortAnalysis = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/cohort");
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={200} /></Card>;
  if (!data || !data.length) return null;
  const maxCols = Math.max(...data.map(d => d.retention?.length || 0));
  const gc = (v) => v >= 80 ? SUCCESS : v >= 50 ? "#8BC34A" : v >= 30 ? WARNING : v >= 10 ? "#FF9800" : DANGER;
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%", overflow: "auto" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Cohort — retention per mese</Typography>
      <Stack spacing={0.5}>
        <Stack direction="row" spacing={0.5}><Box sx={{ width: 65 }} />{Array.from({ length: maxCols }, (_, i) => <Box key={i} sx={{ width: 40, textAlign: "center" }}><Typography sx={{ fontSize: "0.5rem", fontWeight: 700, color: MUTED }}>M{i + 1}</Typography></Box>)}</Stack>
        {data.map((row) => (
          <Stack key={row.mese} direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 65 }}><Typography sx={{ fontSize: "0.55rem", fontWeight: 600, color: TEXT }}>{row.mese}</Typography><Typography sx={{ fontSize: "0.42rem", color: row.total > 0 ? SUCCESS : MUTED }}>{row.total} utenti</Typography></Box>
            {(row.retention || []).map((v, i) => <Box key={i} sx={{ width: 40, height: 28, borderRadius: 1, bgcolor: alpha(gc(v), 0.15), display: "flex", alignItems: "center", justifyContent: "center" }}><Typography sx={{ fontSize: "0.55rem", fontWeight: 700, color: gc(v) }}>{v}%</Typography></Box>)}
            {Array.from({ length: maxCols - (row.retention?.length || 0) }, (_, i) => <Box key={`e${i}`} sx={{ width: 40, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><Typography sx={{ fontSize: "0.55rem", color: "#ddd" }}>—</Typography></Box>)}
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

const HOUR_SLOTS = ["8-12", "12-18", "18-22", "22-8"];
const DAY_LABELS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const OrderHeatmap = () => {
  const { data: ops } = useFetch("api/wp/admin/kpi/operations");
  const hm = ops?.heatmap || [];
  if (!hm.length) return null;
  const grid = Array.from({ length: 4 }, () => Array(7).fill(0));
  hm.forEach((h) => { const di = ((h.dow + 5) % 7); const si = h.hora >= 8 && h.hora < 12 ? 0 : h.hora >= 12 && h.hora < 18 ? 1 : h.hora >= 18 && h.hora < 22 ? 2 : 3; grid[si][di] += h.cnt; });
  const mx = Math.max(...grid.flat(), 1);
  let pS = 0, pD = 0, pV = 0; grid.forEach((r, si) => r.forEach((v, di) => { if (v > pV) { pV = v; pS = si; pD = di; } }));
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Heatmap ordini</Typography>
      <Stack spacing={0.5}>
        <Stack direction="row" spacing={0.5}><Box sx={{ width: 45 }} />{DAY_LABELS.map(d => <Box key={d} sx={{ flex: 1, textAlign: "center" }}><Typography sx={{ fontSize: "0.5rem", fontWeight: 600, color: MUTED }}>{d}</Typography></Box>)}</Stack>
        {grid.map((row, si) => (
          <Stack key={si} direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 45 }}><Typography sx={{ fontSize: "0.48rem", color: MUTED }}>{HOUR_SLOTS[si]}</Typography></Box>
            {row.map((cnt, di) => { const int = cnt / mx; return (
              <Box key={di} sx={{ flex: 1, height: 32, borderRadius: 1.5, bgcolor: cnt > 0 ? alpha(ORO, 0.08 + int * 0.55) : "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", border: si === pS && di === pD ? `2px solid ${ORO}` : "none" }}>
                <Typography sx={{ fontSize: "0.6rem", fontWeight: cnt > 0 ? 700 : 400, color: int > 0.6 ? "#fff" : cnt > 0 ? TEXT : "#ddd" }}>{cnt || ""}</Typography>
              </Box>);
            })}
          </Stack>
        ))}
      </Stack>
      <Insight color={ORO} icon="mdi:chart-timeline-variant">Picco: {DAY_LABELS[pD]} {HOUR_SLOTS[pS]} ({pV} ordini)</Insight>
    </Card>
  );
};

const RankVelocity = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/rank-velocity");
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={200} /></Card>;
  if (!data || !data.length) return <Card sx={{ ...cardSx, p: 3 }}><Typography sx={{ fontSize: "0.75rem", color: MUTED }}>Nessun dato rank velocity</Typography></Card>;
  const mx = Math.max(...data.map(d => d.avg_days), 60);
  const slow = data.reduce((a, b) => b.avg_days > a.avg_days ? b : a, data[0]);
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Rank Velocity</Typography>
      <Stack spacing={1.5}>
        {data.map((r, i) => { const bc = r.avg_days > 60 ? DANGER : r.avg_days > 30 ? WARNING : SUCCESS; return (
          <Box key={i}><Stack direction="row" justifyContent="space-between" mb={0.3}><Typography sx={{ fontSize: "0.68rem", color: TEXT, fontWeight: 600 }}>{r.from} → {r.to}</Typography><Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: bc }}>{r.avg_days}gg</Typography></Stack>
          <LinearProgress variant="determinate" value={Math.min((r.avg_days / mx) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: alpha(bc, 0.1), "& .MuiLinearProgress-bar": { bgcolor: bc, borderRadius: 4 } }} />
          <Typography sx={{ fontSize: "0.48rem", color: MUTED, mt: 0.2 }}>{r.count} transizioni</Typography></Box>);
        })}
      </Stack>
      {slow && slow.avg_days > 60 && <Insight color={DANGER} icon="mdi:alert-circle">{slow.from} → {slow.to} richiede {slow.avg_days}gg — troppo lungo.</Insight>}
    </Card>
  );
};

const InventoryForecast = () => {
  const { data: ops } = useFetch("api/wp/admin/kpi/operations");
  const inv = ops?.inventory || [];
  if (!inv.length) return null;
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Inventory forecast</Typography>
      <Stack spacing={1.5}>
        {inv.slice(0, 6).map((p, i) => { const st = p.stock >= p.forecast ? "ok" : p.stock >= p.forecast * 0.5 ? "attenzione" : "riordina"; const sc = st === "ok" ? SUCCESS : st === "attenzione" ? WARNING : DANGER; return (
          <Stack key={i} direction="row" alignItems="center" spacing={1}><Typography sx={{ fontSize: "0.72rem", color: TEXT, fontWeight: 700, flex: 1 }} noWrap>{p.product || "N/A"}</Typography>
          <Typography sx={{ fontSize: "0.58rem", color: MUTED }}>Stock: {p.stock}</Typography><Typography sx={{ fontSize: "0.58rem", fontWeight: 700, color: sc }}>Need: {p.forecast}</Typography>
          <Chip label={st} size="small" sx={{ height: 18, fontSize: "0.48rem", fontWeight: 700, bgcolor: alpha(sc, 0.1), color: sc }} /></Stack>);
        })}
      </Stack>
    </Card>
  );
};

const AgingCommissions = () => {
  const { data: ops } = useFetch("api/wp/admin/kpi/operations");
  const aging = ops?.aging; if (!aging) return null;
  const bands = [{ label: "< 30 giorni", value: aging.lt30 || 0, color: SUCCESS, badge: "attivi" }, { label: "30-60 giorni", value: aging.d30_60 || 0, color: WARNING, badge: "monit." }, { label: "60-90 giorni", value: aging.d60_90 || 0, color: "#FF9800", badge: "rischio" }, { label: "> 90 giorni", value: aging.gt90 || 0, color: DANGER, badge: "dormiente" }];
  const total = bands.reduce((s, b) => s + b.value, 0);
  return (
    <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT, mb: 2 }}>Pending commissions aging</Typography>
      <Stack spacing={1.5}>
        {bands.map((b) => (<Box key={b.label}><Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.3}><Typography sx={{ fontSize: "0.7rem", color: TEXT, fontWeight: 600 }}>{b.label}</Typography><Stack direction="row" spacing={0.5}><Typography sx={{ fontSize: "0.7rem", color: b.color, fontWeight: 700 }}>€{b.value.toFixed(0)}</Typography><Chip label={b.badge} size="small" sx={{ height: 16, fontSize: "0.45rem", fontWeight: 700, bgcolor: alpha(b.color, 0.1), color: b.color }} /></Stack></Stack>
        <LinearProgress variant="determinate" value={total > 0 ? (b.value / total) * 100 : 0} sx={{ height: 5, borderRadius: 3, bgcolor: alpha(b.color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: b.color, borderRadius: 3 } }} /></Box>))}
      </Stack>
      <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2 }}>
        <Typography sx={{ fontSize: "0.62rem", fontWeight: 600, color: TEXT, mb: 0.5 }}>Forecast payout</Typography>
        {[{ l: "+30g (85%)", v: Math.round(total * 0.85) }, { l: "+60g (70%)", v: Math.round(total * 0.70) }, { l: "+90g (55%)", v: Math.round(total * 0.55) }].map((f) => (
          <Stack key={f.l} direction="row" justifyContent="space-between" sx={{ py: 0.2 }}><Typography sx={{ fontSize: "0.58rem", color: MUTED }}>{f.l}</Typography><Typography sx={{ fontSize: "0.58rem", fontWeight: 700, color: TEXT }}>€{f.v.toLocaleString("it")}</Typography></Stack>
        ))}
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════
// LEADERBOARD (Earners, Recruiters, Achievers)
// ═══════════════════════════════════════
const LeaderList = ({ title, icon, items, valueKey, valueLabel, valueSuffix = "", secondaryKey, secondaryLabel }) => (
  <Card sx={{ ...cardSx, p: 3, height: "100%" }}>
    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
      <Iconify icon={icon} width={20} sx={{ color: ORO }} />
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT }}>{title}</Typography>
    </Stack>
    {(!items || !items.length) ? <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Nessun dato</Typography> : (
      <Stack spacing={0.8}>
        {items.map((t, i) => (
          <Stack key={t.user_id || i} direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: i < 3 ? alpha(ORO, 0.12) : "#f5f5f5", color: i < 3 ? ORO : MUTED, fontSize: 10, fontWeight: 700 }}>{i + 1}</Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: TEXT }} noWrap>{t.name || t.username}</Typography>
              {t.rank_name && <Typography sx={{ fontSize: "0.5rem", color: ORO }}>{t.rank_name}</Typography>}
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: ORO }}>{typeof t[valueKey] === "number" ? `${valueSuffix}${t[valueKey]}` : t[valueKey]}</Typography>
              {secondaryKey && <Typography sx={{ fontSize: "0.5rem", color: MUTED }}>{t[secondaryKey]} {secondaryLabel}</Typography>}
            </Box>
          </Stack>
        ))}
      </Stack>
    )}
  </Card>
);

const Leaderboard = () => {
  const { data, loading } = useFetch("api/wp/admin/kpi/leaderboard", true);
  if (loading) return <Grid container spacing={2}>{[0,1,2].map(i => <Grid item xs={12} md={4} key={i}><Skeleton variant="rounded" height={250} sx={{ borderRadius: 3 }} /></Grid>)}</Grid>;
  if (!data) return null;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <LeaderList title="Top Earners" icon="mdi:cash-multiple" items={data.top_earners} valueKey="total_earned" valueSuffix="€" secondaryKey="num_commissions" secondaryLabel="commissioni" />
      </Grid>
      <Grid item xs={12} md={4}>
        <LeaderList title="Top Recruiters" icon="mdi:account-multiple-plus" items={data.top_recruiters} valueKey="total_recruited" valueSuffix="" secondaryKey="active_recruited" secondaryLabel="attivi" />
      </Grid>
      <Grid item xs={12} md={4}>
        <LeaderList title="Top Achievers" icon="mdi:trophy" items={data.top_achievers} valueKey="rank_name" valueSuffix="" />
      </Grid>
    </Grid>
  );
};

// ═══════════════════════════════════════
// PAYOUT SUMMARY
// ═══════════════════════════════════════
const PayoutSummary = () => {
  const { data: ps, loading } = useFetch("api/wp/admin/kpi/payout-summary", true);
  if (loading) return <Card sx={{ ...cardSx, p: 3 }}><Skeleton height={250} /></Card>;
  if (!ps) return null;

  const statusCards = [
    { label: "Totale generato", value: ps.total_generated, color: ORO, icon: "mdi:sigma" },
    { label: "Pagato", value: ps.paid, color: SUCCESS, icon: "mdi:check-circle" },
    { label: "Pending", value: ps.pending, color: WARNING, icon: "mdi:clock-outline" },
    { label: "On Hold", value: ps.on_hold, color: INFO, icon: "mdi:pause-circle" },
  ];

  return (
    <Card sx={{ ...cardSx, p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: TEXT }}>Payout Summary</Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Iconify icon="mdi:wallet-outline" width={16} sx={{ color: MUTED }} />
          <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>Wallet totale: <b style={{ color: TEXT }}>€{ps.total_wallet_balance}</b></Typography>
        </Stack>
      </Stack>

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {statusCards.map((c) => (
          <Grid item xs={6} md={3} key={c.label}>
            <Box sx={{ p: 1.5, bgcolor: alpha(c.color, 0.04), borderRadius: 2, border: `1px solid ${alpha(c.color, 0.1)}`, textAlign: "center" }}>
              <Iconify icon={c.icon} width={18} sx={{ color: c.color, mb: 0.3 }} />
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: c.color }}>€{(c.value || 0).toLocaleString("it")}</Typography>
              <Typography sx={{ fontSize: "0.55rem", color: MUTED }}>{c.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: TEXT, mb: 1 }}>Bonus per tipo</Typography>
      <Stack spacing={0.8}>
        {(ps.by_type || []).map((b) => {
          const clr = COMM_COLORS[b.type] || ORO;
          return (
            <Stack key={b.type} direction="row" alignItems="center" spacing={1}>
              <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: clr, flexShrink: 0 }} />
              <Typography sx={{ fontSize: "0.65rem", color: TEXT, fontWeight: 600, flex: 1 }} noWrap>{b.label}</Typography>
              <Stack direction="row" spacing={0.5}>
                <Chip label={`€${b.paid} paid`} size="small" sx={{ height: 16, fontSize: "0.45rem", bgcolor: alpha(SUCCESS, 0.08), color: SUCCESS }} />
                <Chip label={`€${b.pending} pend`} size="small" sx={{ height: 16, fontSize: "0.45rem", bgcolor: alpha(WARNING, 0.08), color: WARNING }} />
              </Stack>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: clr, width: 40, textAlign: "right" }}>{b.pct}%</Typography>
            </Stack>
          );
        })}
      </Stack>

      <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha(ORO, 0.04), borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ fontSize: "0.62rem", color: MUTED }}>Bonus medio/promoter attivo</Typography>
          <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: TEXT }}>€{ps.avg_bonus_per_promoter} ({ps.active_promoters} attivi)</Typography>
        </Stack>
        {(ps.cancelled || 0) > 0 && (
          <Typography sx={{ fontSize: "0.55rem", color: DANGER, mt: 0.5 }}>€{ps.cancelled} in commissioni cancellate</Typography>
        )}
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
const KpiDashboard = () => {
  const [period, setPeriod] = useState("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const qs = useMemo(() => {
    let q = `period=${period}`;
    if (period === "custom" && customFrom) q += `&from=${customFrom}`;
    if (period === "custom" && customTo) q += `&to=${customTo}`;
    return q;
  }, [period, customFrom, customTo]);

  return (
    <PeriodCtx.Provider value={{ qs }}>
      <Page title="KPI Dashboard">
        <Box sx={{ px: { xs: 2, md: 3 }, pb: 4, bgcolor: AVORIO, minHeight: "100vh" }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ pt: 1 }}>
              <Typography variant="h5" fontWeight={700} color={ESPRESSO}>KPI Dashboard</Typography>
              <PeriodFilter period={period} setPeriod={setPeriod} customFrom={customFrom} setCustomFrom={setCustomFrom} customTo={customTo} setCustomTo={setCustomTo} />
            </Stack>

            <RiskAlert />
            <OverviewCards />

            <Section>Revenue &amp; Performance</Section>
            <Grid container spacing={2}>
              <Grid item xs={12} md={7}><RevenueChart /></Grid>
              <Grid item xs={12} md={5}><WeeklyComparison /></Grid>
            </Grid>

            <Section>Revenue Breakdown &amp; Commissioni</Section>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><RevenueBreakdown /></Grid>
              <Grid item xs={12} md={4}><CommissionBreakdown /></Grid>
              <Grid item xs={12} md={4}><ActivationCard /></Grid>
            </Grid>

            <Section>Prodotti, Geografia &amp; Segmentazione</Section>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><ProductMix /></Grid>
              <Grid item xs={12} md={4}><GeoDistribution /></Grid>
              <Grid item xs={12} md={4}><ClientSegmentation /></Grid>
            </Grid>

            <Section>Leaderboard — Earners, Recruiters, Achievers</Section>
            <Leaderboard />

            <Section>Payout &amp; Network Bonus</Section>
            <PayoutSummary />

            <Section>Network &amp; Promoter</Section>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><NetworkKPIs /></Grid>
              <Grid item xs={12} md={4}><Top10 /></Grid>
              <Grid item xs={12} md={4}><CohortAnalysis /></Grid>
            </Grid>

            <Section>Operazioni &amp; Analisi</Section>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}><OrderHeatmap /></Grid>
              <Grid item xs={12} md={3}><RankVelocity /></Grid>
              <Grid item xs={12} md={3}><InventoryForecast /></Grid>
              <Grid item xs={12} md={3}><AgingCommissions /></Grid>
            </Grid>
          </Stack>
        </Box>
      </Page>
    </PeriodCtx.Provider>
  );
};

export default KpiDashboard;
