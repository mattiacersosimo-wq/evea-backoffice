import {
  Box, Card, Chip, Grid, LinearProgress, MenuItem, Select, Skeleton,
  Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";
const cardSx = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const BONUS_COLORS = {
  direct_sales_bonus: "#FF9800", fast_start_bonus: "#FF4081", indirect_sales_bonus: "#00BCD4", go_mvp_bonus: "#4CAF50",
  rock_solid_mvp_bonus: "#2196F3", pmb_bonus: "#9C27B0", residual_bonus: "#607D8B",
  leadership_bonus: ORO, residual_matching: "#795548", ritual_bonus: "#455A64",
  eveolving_bonus: "#FF5722", first_order_bonus: "#8BC34A", rank_bonus: "#673AB7",
};

const ALL_BONUSES = [
  { type: "direct_sales_bonus", label: "Direct Sales Bonus", freq: "weekly" },
  { type: "fast_start_bonus", label: "Fast Start Bonus", freq: "weekly" },
  { type: "indirect_sales_bonus", label: "Indirect Sales Bonus", freq: "weekly" },
  { type: "go_mvp_bonus", label: "Go MVP Bonus", freq: "weekly" },
  { type: "rock_solid_mvp_bonus", label: "Rock Solid MVP Bonus", freq: "weekly" },
  { type: "pmb_bonus", label: "MVP Mentor Bonus", freq: "weekly" },
  { type: "residual_bonus", label: "Residual Bonus", freq: "monthly" },
  { type: "leadership_bonus", label: "Leadership Bonus", freq: "monthly" },
  { type: "residual_matching", label: "Residual Matching", freq: "monthly" },
  { type: "ritual_bonus", label: "Ritual Bonus", freq: "monthly" },
  { type: "eveolving_bonus", label: "Evolving Bonus", freq: "monthly" },
];

const STATUS_BADGE = {
  yes: { label: "Approvato", color: "#4A5C3A", bg: "#EAF3DE" },
  pending: { label: "Pending", color: "#EF9F27", bg: "#FFF3E0" },
  on_hold: { label: "In attesa", color: "#607D8B", bg: "#ECEFF1" },
};

const MONTHS_IT = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

const IncomeReport = ({ initialViewAs = null }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("this_month");
  const [weekVal, setWeekVal] = useState("");
  const [monthVal, setMonthVal] = useState("");
  const [yearVal, setYearVal] = useState(new Date().getFullYear());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let params = { period };
      if (period === "week" && weekVal) params.week = weekVal;
      if (period === "month" && monthVal) params.month = monthVal;
      if (period === "year") params.year = yearVal;
      if (initialViewAs) params.view_as = initialViewAs;
      const { data: r } = await axiosInstance.get("api/wp/income-report", { params });
      setData(r?.data);
    } catch { /* silent */ }
    setLoading(false);
  }, [period, weekVal, monthVal, yearVal, initialViewAs]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const formatDate = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return d; }
  };

  const summary = data?.summary || {};
  const rawByType = data?.by_type || [];
  const byTypeMap = Object.fromEntries(rawByType.map((b) => [b.type, b]));
  const byType = ALL_BONUSES.map((ab) => byTypeMap[ab.type] || { ...ab, total: 0, paid: 0, pending: 0, on_hold: 0, count: 0 });
  const transactions = data?.transactions || [];
  const weeklyTrend = data?.weekly_trend || [];
  const availableWeeks = data?.available_weeks || [];

  // Generate month options
  const monthOptions = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthOptions.push({ value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: `${MONTHS_IT[d.getMonth()]} ${d.getFullYear()}` });
  }

  // Generate week options from API
  const weekOptions = availableWeeks.map((w) => ({
    value: `${String(w.yw).substring(0, 4)}-W${String(w.yw).substring(4)}`,
    label: `${w.week_start} — €${Number(w.total).toFixed(0)}`,
  }));

  return (
    <Page title="Income Report">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4, mx: { xs: -2, md: -3 }, mt: -2, pt: 2, bgcolor: "#f5f5f5", minHeight: "100vh" }}>

        {/* Hero */}
        <Card sx={{ bgcolor: "#FAF6EF", color: ESPRESSO, borderRadius: 4, p: 3, mb: 3, border: `1px solid ${alpha(ORO, 0.2)}` }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Iconify icon="mdi:chart-timeline-variant-shimmer" width={28} sx={{ color: ORO }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color={ESPRESSO}>Income Report</Typography>
                <Typography sx={{ fontSize: "0.8rem", color: MUTED }}>{t("evea.earnings")} — {data?.period?.start?.substring(0, 10)} → {data?.period?.end?.substring(0, 10)}</Typography>
              </Box>
            </Stack>

            {/* Period selector */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Select size="small" value={period} onChange={(e) => setPeriod(e.target.value)}
                sx={{ minWidth: 140, bgcolor: "#fff", borderRadius: 2, "& .MuiSelect-select": { py: 0.8, fontSize: "0.82rem" } }}>
                <MenuItem value="this_week">{t("evea.this_week_filter")}</MenuItem>
                <MenuItem value="last_week">{t("evea.last_week_filter")}</MenuItem>
                <MenuItem value="this_month">{t("evea.this_month_filter")}</MenuItem>
                <MenuItem value="last_month">{t("evea.last_month_filter")}</MenuItem>
                <MenuItem value="this_year">{t("evea.this_year_filter")}</MenuItem>
                <MenuItem value="week">{t("evea.select_week")}</MenuItem>
                <MenuItem value="month">{t("evea.select_month")}</MenuItem>
                <MenuItem value="year">{t("evea.select_year")}</MenuItem>
              </Select>
              {period === "week" && (
                <Select size="small" value={weekVal} onChange={(e) => setWeekVal(e.target.value)} displayEmpty
                  sx={{ minWidth: 180, bgcolor: "#fff", borderRadius: 2, "& .MuiSelect-select": { py: 0.8, fontSize: "0.82rem" } }}>
                  <MenuItem value="" disabled>Select week...</MenuItem>
                  {weekOptions.map((w) => <MenuItem key={w.value} value={w.value}>{w.label}</MenuItem>)}
                </Select>
              )}
              {period === "month" && (
                <Select size="small" value={monthVal} onChange={(e) => setMonthVal(e.target.value)} displayEmpty
                  sx={{ minWidth: 140, bgcolor: "#fff", borderRadius: 2, "& .MuiSelect-select": { py: 0.8, fontSize: "0.82rem" } }}>
                  <MenuItem value="" disabled>Select month...</MenuItem>
                  {monthOptions.map((m) => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                </Select>
              )}
              {period === "year" && (
                <Select size="small" value={yearVal} onChange={(e) => setYearVal(e.target.value)}
                  sx={{ minWidth: 100, bgcolor: "#fff", borderRadius: 2, "& .MuiSelect-select": { py: 0.8, fontSize: "0.82rem" } }}>
                  {[2024, 2025, 2026, 2027].map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
              )}
            </Stack>
          </Stack>
        </Card>

        {loading ? (
          <Grid container spacing={2}>{[0, 1, 2].map((i) => <Grid item xs={4} key={i}><Skeleton variant="rounded" height={100} sx={{ borderRadius: 3 }} /></Grid>)}</Grid>
        ) : (
          <>
            {/* Summary cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { label: t("evea.total"), value: summary.total, color: ORO, icon: "mdi:cash-multiple" },
                { label: "Approved", value: summary.paid, color: "#4A5C3A", icon: "mdi:check-circle-outline" },
                { label: "Pending", value: summary.pending, color: "#EF9F27", icon: "mdi:clock-outline" },
              ].map((c) => (
                <Grid item xs={12} md={4} key={c.label}>
                  <Card sx={{ ...cardSx, p: 2.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(c.color, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Iconify icon={c.icon} width={22} sx={{ color: c.color }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED, textTransform: "uppercase" }}>{c.label}</Typography>
                        <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: (c.value || 0) > 0 ? c.color : "#ccc" }}>€{(c.value || 0).toFixed(2)}</Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Breakdown by type */}
            <Card sx={{ ...cardSx, p: 2.5, mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Iconify icon="mdi:chart-bar" width={20} sx={{ color: ORO }} />
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>{t("evea.breakdown")}</Typography>
              </Stack>
              <Stack spacing={1.2}>
                {byType.map((b) => {
                  const color = BONUS_COLORS[b.type] || "#999";
                  const pct = summary.total > 0 ? (b.total / summary.total) * 100 : 0;
                  return (
                    <Box key={b.type}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: ESPRESSO }}>{b.label}</Typography>
                          <Chip label={b.freq === "weekly" ? "W" : "M"} size="small"
                            sx={{ height: 18, fontSize: "0.55rem", fontWeight: 700, bgcolor: b.freq === "weekly" ? alpha("#4CAF50", 0.1) : alpha(ORO, 0.1), color: b.freq === "weekly" ? "#4CAF50" : ORO }} />
                          <Typography sx={{ fontSize: "0.68rem", color: MUTED }}>{b.count} comm.</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>{pct.toFixed(1)}%</Typography>
                          <Typography sx={{ fontSize: "0.88rem", fontWeight: 800, color }}>{"\u20AC"}{b.total.toFixed(2)}</Typography>
                        </Stack>
                      </Stack>
                      <LinearProgress variant="determinate" value={Math.min(pct, 100)}
                        sx={{ height: 6, borderRadius: 3, bgcolor: alpha(color, 0.08), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 } }} />
                    </Box>
                  );
                })}
                {byType.length === 0 && <Typography sx={{ fontSize: "0.82rem", color: MUTED, textAlign: "center", py: 2 }}>No commissions in this period</Typography>}
              </Stack>
            </Card>

            {/* Weekly trend */}
            {weeklyTrend.length > 0 && (
              <Card sx={{ ...cardSx, p: 2.5, mb: 3 }}>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>{t("evea.weekly_trend")}</Typography>
                {(() => {
                  const maxVal = Math.max(...weeklyTrend.map((x) => Number(x.total)), 1);
                  return (
                    <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, height: 180, pt: 2 }}>
                      {weeklyTrend.map((w) => {
                        const val = Number(w.total);
                        const barH = Math.max((val / maxVal) * 140, 6);
                        return (
                          <Box key={w.yw} sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 50, maxWidth: 80 }}>
                            <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: val > 0 ? ORO : "#ccc", mb: 0.5 }}>{"\u20AC"}{val.toFixed(0)}</Typography>
                            <Box sx={{ width: 50, height: barH, bgcolor: val > 0 ? ORO : alpha(ORO, 0.15), borderRadius: "6px 6px 0 0", transition: "height 0.5s" }} />
                            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: MUTED, mt: 0.8 }}>{w.week_start?.substring(5)}</Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })()}
              </Card>
            )}

            {/* Transactions */}
            <Card sx={{ ...cardSx, p: 2.5 }}>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>{t("evea.transactions")}</Typography>
              {transactions.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED }}>Date</TableCell>
                      <TableCell sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED }}>Bonus</TableCell>
                      <TableCell sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED }}>From</TableCell>
                      <TableCell align="right" sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED }}>Amount</TableCell>
                      <TableCell sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx) => {
                      const st = STATUS_BADGE[tx.status] || STATUS_BADGE.pending;
                      const color = BONUS_COLORS[tx.type] || "#999";
                      return (
                        <TableRow key={tx.id}>
                          <TableCell sx={{ fontSize: "0.75rem" }}>{formatDate(tx.date)}</TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
                              <Typography sx={{ fontSize: "0.75rem" }}>{tx.label}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.75rem", color: MUTED }}>{tx.from || "—"}</TableCell>
                          <TableCell align="right" sx={{ fontSize: "0.8rem", fontWeight: 700, color }}>{"\u20AC"}{tx.amount.toFixed(2)}</TableCell>
                          <TableCell><Chip label={st.label} size="small" sx={{ height: 22, fontSize: "0.65rem", fontWeight: 600, bgcolor: st.bg, color: st.color }} /></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <Typography sx={{ fontSize: "0.82rem", color: MUTED, textAlign: "center", py: 3 }}>No transactions in this period</Typography>
              )}
            </Card>
          </>
        )}
      </Box>
    </Page>
  );
};

export default IncomeReport;
