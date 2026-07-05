import { Alert, Box, Card, Chip, Grid, LinearProgress, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const TEXT = "#3D3229";
const MUTED = "#7A6A5C";
const SUCCESS = "#4A5C3A";
const WARNING = "#EF9F27";
const DANGER = "#E24B4A";

const cardSx = {
  bgcolor: "#fff",
  borderRadius: 3,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  border: "1px solid #f0ece6",
  p: 3,
};

const STATUS_COLORS = {
  green: SUCCESS,
  yellow: WARNING,
  red: DANGER,
};

const STATUS_LABELS = {
  green: "OK",
  yellow: "ATTENZIONE",
  red: "CRITICO",
};

const STATUS_ICONS = {
  green: "mdi:check-circle",
  yellow: "mdi:alert-circle-outline",
  red: "mdi:alert-octagon",
};

const KpiCard = ({ kpi }) => {
  const color = STATUS_COLORS[kpi.status] || MUTED;
  return (
    <Card sx={{ ...cardSx, borderLeft: `4px solid ${color}`, height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Typography sx={{ fontSize: "0.75rem", color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {kpi.label}
        </Typography>
        <Chip
          size="small"
          icon={<Iconify icon={STATUS_ICONS[kpi.status]} width={16} sx={{ color: `${color} !important` }} />}
          label={STATUS_LABELS[kpi.status]}
          sx={{ bgcolor: alpha(color, 0.1), color, fontWeight: 700, fontSize: "0.68rem", height: 22 }}
        />
      </Stack>
      <Stack direction="row" alignItems="baseline" spacing={1}>
        <Typography sx={{ fontSize: "2.4rem", fontWeight: 800, color: ESPRESSO, letterSpacing: "-1px", lineHeight: 1 }}>
          {kpi.value}
        </Typography>
        <Typography sx={{ fontSize: "1rem", color: MUTED, fontWeight: 600 }}>{kpi.unit}</Typography>
      </Stack>
      <Stack direction="row" spacing={2} mt={1.5}>
        <Box>
          <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>Target</Typography>
          <Typography sx={{ fontSize: "0.82rem", color: SUCCESS, fontWeight: 700 }}>
            {kpi.higher_is_worse ? "≤" : "≥"} {kpi.target}{kpi.unit}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>Soglia critica</Typography>
          <Typography sx={{ fontSize: "0.82rem", color: DANGER, fontWeight: 700 }}>
            {kpi.higher_is_worse ? ">" : "<"} {kpi.critical}{kpi.unit}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};

const FinancialCard = ({ financial }) => {
  const grossMargin = financial.gross_margin || 0;
  const marginPct = financial.revenue_mtd > 0
    ? Math.round((grossMargin / financial.revenue_mtd) * 100)
    : 0;
  const revDelta = financial.revenue_prev_month > 0
    ? Math.round(((financial.revenue_mtd - financial.revenue_prev_month) / financial.revenue_prev_month) * 100)
    : 0;

  return (
    <Card sx={cardSx}>
      <Typography sx={{ fontSize: "0.85rem", color: MUTED, fontWeight: 700, mb: 2, textTransform: "uppercase" }}>
        Bilancio del mese in corso
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Fatturato lordo</Typography>
          <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: ESPRESSO }}>
            €{financial.revenue_mtd?.toLocaleString("it-IT", { minimumFractionDigits: 2 }) || "0"}
          </Typography>
          {revDelta !== 0 && (
            <Chip
              size="small"
              icon={<Iconify icon={revDelta >= 0 ? "mdi:arrow-up" : "mdi:arrow-down"} width={12} />}
              label={`${revDelta >= 0 ? "+" : ""}${revDelta}% vs mese scorso`}
              sx={{
                mt: 0.5, height: 20, fontSize: "0.65rem",
                bgcolor: alpha(revDelta >= 0 ? SUCCESS : DANGER, 0.1),
                color: revDelta >= 0 ? SUCCESS : DANGER,
              }}
            />
          )}
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Bonus pagati</Typography>
          <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: DANGER }}>
            -€{financial.total_bonus_cost?.toLocaleString("it-IT", { minimumFractionDigits: 2 }) || "0"}
          </Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Margine lordo</Typography>
          <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: grossMargin >= 0 ? SUCCESS : DANGER }}>
            €{grossMargin.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: MUTED, mt: 0.3 }}>
            {marginPct}% del fatturato
          </Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Clienti / Promoter</Typography>
          <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: ESPRESSO }}>
            {financial.active_customers} / {financial.active_promoters}
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: MUTED, mt: 0.3 }}>
            {financial.churned_customers} churned questo mese
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

const CostBreakdown = ({ costs }) => {
  const total = (costs || []).reduce((sum, c) => sum + (Number(c.total) || 0), 0);
  const typeLabels = {
    fast_start_bonus: "Fast Start Bonus",
    founder_fsb: "Founder FSB",
    direct_sales_bonus: "Direct Sales Bonus",
    indirect_sales_bonus: "Indirect Sales Bonus",
    residual_bonus: "Residual Bonus",
    leadership_bonus: "Leadership Bonus",
    go_mvp_bonus: "Go MVP",
    rock_solid_mvp_bonus: "Rock Solid MVP",
    "3ff_programe": "3 For Free (programa)",
    "3ff_residual": "3 For Free (residuo)",
    rob_bonus: "ROB (Recurring Order Bonus)",
    ritual_bonus: "Ritual Bonus",
    evolving_bonus: "Evolving Bonus",
    residual_matching_bonus: "Residual Matching",
    pmb_bonus: "PMB Bonus",
  };
  return (
    <Card sx={cardSx}>
      <Typography sx={{ fontSize: "0.85rem", color: MUTED, fontWeight: 700, mb: 2, textTransform: "uppercase" }}>
        Costi per tipo di bonus (mese in corso)
      </Typography>
      {(costs || []).length === 0 ? (
        <Typography sx={{ color: MUTED, fontSize: "0.85rem", py: 2 }}>
          Nessun bonus pagato questo mese.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {costs.map((c) => {
            const pct = total > 0 ? (c.total / total) * 100 : 0;
            return (
              <Box key={c.type}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography sx={{ fontSize: "0.85rem", color: TEXT, fontWeight: 600 }}>
                    {typeLabels[c.type] || c.type}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ fontSize: "0.72rem", color: MUTED }}>
                      {c.count} pagamenti
                    </Typography>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, minWidth: 90, textAlign: "right" }}>
                      €{Number(c.total).toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                    </Typography>
                  </Stack>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 6, borderRadius: 3, bgcolor: "#f5efe4",
                    "& .MuiLinearProgress-bar": { bgcolor: ORO, borderRadius: 3 },
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      )}
    </Card>
  );
};

const TrendTable = ({ trend }) => (
  <Card sx={cardSx}>
    <Typography sx={{ fontSize: "0.85rem", color: MUTED, fontWeight: 700, mb: 2, textTransform: "uppercase" }}>
      Storico ultimi 12 mesi
    </Typography>
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={{ width: "100%", minWidth: 600, borderCollapse: "collapse" }}>
        <Box component="thead">
          <Box component="tr">
            {["Mese", "Clienti attivi", "Churn %", "Fatturato", "Costo bonus", "Netto"].map((h) => (
              <Box key={h} component="th" sx={{ p: 1.2, textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", borderBottom: "1px solid #f0ece6" }}>
                {h}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {(trend || []).map((m) => {
            const netto = (m.revenue || 0) - (m.bonus_cost || 0);
            return (
              <Box component="tr" key={m.month} sx={{ "&:hover": { bgcolor: "#faf6ef" } }}>
                <Box component="td" sx={{ p: 1.2, fontSize: "0.82rem", fontWeight: 600, color: ESPRESSO, borderBottom: "1px solid #f5efe4" }}>
                  {m.month}
                </Box>
                <Box component="td" sx={{ p: 1.2, fontSize: "0.82rem", color: TEXT, borderBottom: "1px solid #f5efe4" }}>
                  {m.customers}
                </Box>
                <Box component="td" sx={{ p: 1.2, fontSize: "0.82rem", color: m.churn_rate > 10 ? DANGER : (m.churn_rate > 8 ? WARNING : TEXT), fontWeight: m.churn_rate > 8 ? 700 : 500, borderBottom: "1px solid #f5efe4" }}>
                  {m.churn_rate}%
                </Box>
                <Box component="td" sx={{ p: 1.2, fontSize: "0.82rem", color: TEXT, borderBottom: "1px solid #f5efe4" }}>
                  €{Number(m.revenue).toLocaleString("it-IT", { minimumFractionDigits: 0 })}
                </Box>
                <Box component="td" sx={{ p: 1.2, fontSize: "0.82rem", color: DANGER, borderBottom: "1px solid #f5efe4" }}>
                  -€{Number(m.bonus_cost).toLocaleString("it-IT", { minimumFractionDigits: 0 })}
                </Box>
                <Box component="td" sx={{ p: 1.2, fontSize: "0.85rem", fontWeight: 700, color: netto >= 0 ? SUCCESS : DANGER, borderBottom: "1px solid #f5efe4" }}>
                  {netto >= 0 ? "+" : ""}€{netto.toLocaleString("it-IT", { minimumFractionDigits: 0 })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  </Card>
);

const KpiSustainability = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/admin/kpi/sustainability");
        setData(r?.data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Errore caricamento KPI");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Page title="Sostenibilità Piano Compensi">
      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:scale-balance" width={26} sx={{ color: ORO }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: ESPRESSO }}>
              Sostenibilità Piano Compensi
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", color: MUTED }}>
              3 KPI critici + breakdown costi mensili (analisi 04/07/2026)
            </Typography>
          </Box>
        </Stack>

        {loading && (
          <Grid container spacing={2}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} md={4} key={i}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {data && !loading && (
          <Stack spacing={3}>
            {/* Alerts */}
            {(data.alerts || []).length > 0 && (
              <Stack spacing={1}>
                {data.alerts.map((a, i) => (
                  <Alert
                    key={i}
                    severity={a.level === "red" ? "error" : "warning"}
                    icon={<Iconify icon={STATUS_ICONS[a.level]} width={20} />}
                  >
                    {a.msg}
                  </Alert>
                ))}
              </Stack>
            )}

            {/* 3 KPI critici */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <KpiCard kpi={data.kpi_critical.churn_rate} />
              </Grid>
              <Grid item xs={12} md={4}>
                <KpiCard kpi={data.kpi_critical.customer_promoter_ratio} />
              </Grid>
              <Grid item xs={12} md={4}>
                <KpiCard kpi={data.kpi_critical.multi_box_percent} />
              </Grid>
            </Grid>

            {/* Bilancio mese in corso */}
            <FinancialCard financial={data.financial} />

            {/* Breakdown costi bonus */}
            <CostBreakdown costs={data.financial?.costs_by_type} />

            {/* Trend 12 mesi */}
            <TrendTable trend={data.trend_12m} />

            <Typography sx={{ fontSize: "0.72rem", color: MUTED, textAlign: "right" }}>
              Dati aggiornati al {data.as_of}
            </Typography>
          </Stack>
        )}
      </Box>
    </Page>
  );
};

export default KpiSustainability;
