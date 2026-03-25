import { Box, Button, Card, Chip, CircularProgress, Grid, IconButton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

const AGENT_META = {
  fiscal: { label: "Fiscale", icon: "mdi:calculator-variant", color: "#E91E63" },
  commissions: { label: "Commissioni", icon: "mdi:cash-multiple", color: "#FF9800" },
  operations: { label: "Operazioni", icon: "mdi:cog-outline", color: "#607D8B" },
  business: { label: "Business", icon: "mdi:chart-line", color: "#4CAF50" },
  security: { label: "Sicurezza", icon: "mdi:shield-alert", color: "#E24B4A" },
};

const SEV = {
  critical: { color: "#E24B4A", bg: "#FCEBEB", icon: "mdi:alert-circle", label: "Critico" },
  warning: { color: "#EF9F27", bg: "#FFF8E1", icon: "mdi:alert", label: "Attenzione" },
  info: { color: "#378ADD", bg: "#E6F1FB", icon: "mdi:information", label: "Info" },
};

const CentroControllo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchDashboard = useCallback(async () => {
    try {
      const { data: r } = await axiosInstance.get("api/wp/health/dashboard");
      setData(r?.data);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const runChecks = async () => {
    setRunning(true);
    try {
      await axiosInstance.get("api/wp/health/run-all");
      enqueueSnackbar("Check completati", { variant: "success" });
      await fetchDashboard();
    } catch { enqueueSnackbar("Errore durante i check", { variant: "error" }); }
    setRunning(false);
  };

  const resolveAlert = async (id) => {
    try {
      await axiosInstance.post(`api/wp/health/resolve/${id}`);
      setData((d) => ({ ...d, alerts: d.alerts.filter((a) => a.id !== id) }));
      enqueueSnackbar("Alert risolto", { variant: "success" });
    } catch { enqueueSnackbar("Errore", { variant: "error" }); }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: ORO }} /></Box>;

  const alerts = data?.alerts || [];
  const critical = data?.critical || 0;
  const warning = data?.warning || 0;
  const info = data?.info || 0;

  return (
    <Page title="Centro Controllo">
      <Box sx={{ px: 3, pb: 4 }}>
        <HeaderBreadcrumbs heading="Centro Controllo" links={[{ name: "Dashboard" }, { name: "Centro Controllo" }]}
          action={<Button variant="contained" startIcon={running ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="mdi:play" />}
            onClick={runChecks} disabled={running}
            sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none" }}>
            {running ? "Checking..." : "Esegui Check"}
          </Button>} />

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: "Critici", count: critical, sev: "critical" },
            { label: "Attenzione", count: warning, sev: "warning" },
            { label: "Info", count: info, sev: "info" },
            { label: "Totale Alert", count: critical + warning + info, sev: null },
          ].map((c, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: "1px solid #f0ece6", textAlign: "center" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: "50%", mx: "auto", mb: 1,
                  bgcolor: c.sev ? alpha(SEV[c.sev]?.color || "#999", 0.1) : alpha(ORO, 0.1),
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Iconify icon={c.sev ? SEV[c.sev]?.icon : "mdi:shield-check"} width={22}
                    sx={{ color: c.sev ? SEV[c.sev]?.color : ORO }} />
                </Box>
                <Typography variant="h4" fontWeight={800} color={c.count > 0 && c.sev === "critical" ? "#E24B4A" : ESPRESSO}>{c.count}</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#7A6A5C" }}>{c.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Agents Status */}
        <Typography variant="subtitle1" fontWeight={700} color={ESPRESSO} sx={{ mb: 1.5 }}>Agenti</Typography>
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {Object.entries(AGENT_META).map(([key, meta]) => {
            const agentAlerts = alerts.filter((a) => a.agent === key);
            const lastCheck = (data?.recent_checks || []).filter((c) => c.agent === key)[0];
            return (
              <Grid item xs={6} md={3} key={key}>
                <Card sx={{ p: 2, borderRadius: 3, border: "1px solid #f0ece6", height: "100%" }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: alpha(meta.color, 0.1),
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Iconify icon={meta.icon} width={18} sx={{ color: meta.color }} />
                    </Box>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO }}>{meta.label}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip size="small" label={agentAlerts.length === 0 ? "OK" : `${agentAlerts.length} alert`}
                      sx={{ height: 22, fontSize: "0.65rem", fontWeight: 700,
                        bgcolor: agentAlerts.length === 0 ? alpha("#4CAF50", 0.1) : alpha("#EF9F27", 0.1),
                        color: agentAlerts.length === 0 ? "#4CAF50" : "#EF9F27" }} />
                    {lastCheck && (
                      <Typography sx={{ fontSize: "0.6rem", color: "#aaa" }}>{lastCheck.duration_ms}ms</Typography>
                    )}
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Alert List */}
        <Typography variant="subtitle1" fontWeight={700} color={ESPRESSO} sx={{ mb: 1.5 }}>
          Alert Attivi ({alerts.length})
        </Typography>
        {alerts.length === 0 ? (
          <Card sx={{ p: 4, borderRadius: 3, textAlign: "center", border: "1px solid #f0ece6" }}>
            <Iconify icon="mdi:check-circle-outline" width={48} sx={{ color: "#4CAF50", mb: 1 }} />
            <Typography sx={{ color: "#4CAF50", fontWeight: 700 }}>Tutto OK — nessun alert attivo</Typography>
          </Card>
        ) : (
          <Stack spacing={1.5}>
            {alerts.map((a) => {
              const sev = SEV[a.severity] || SEV.info;
              const agent = AGENT_META[a.agent] || { label: a.agent, icon: "mdi:help", color: "#999" };
              return (
                <Card key={a.id} sx={{ p: 2, borderRadius: 3, border: `1px solid ${alpha(sev.color, 0.2)}`, bgcolor: alpha(sev.bg, 0.3) }}>
                  <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(sev.color, 0.1),
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: 0.3 }}>
                      <Iconify icon={sev.icon} width={20} sx={{ color: sev.color }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                        <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: ESPRESSO }}>{a.title}</Typography>
                        <Chip size="small" label={agent.label} sx={{ height: 20, fontSize: "0.6rem", bgcolor: alpha(agent.color, 0.1), color: agent.color }} />
                        <Chip size="small" label={sev.label} sx={{ height: 20, fontSize: "0.6rem", bgcolor: alpha(sev.color, 0.1), color: sev.color }} />
                      </Stack>
                      <Typography sx={{ fontSize: "0.75rem", color: "#7A6A5C", mt: 0.5 }}>{a.message}</Typography>
                      <Typography sx={{ fontSize: "0.6rem", color: "#bbb", mt: 0.3 }}>{a.created_at}</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => resolveAlert(a.id)} title="Segna come risolto"
                      sx={{ color: "#4CAF50", bgcolor: alpha("#4CAF50", 0.08), "&:hover": { bgcolor: alpha("#4CAF50", 0.15) } }}>
                      <Iconify icon="mdi:check" width={18} />
                    </IconButton>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}
      </Box>
    </Page>
  );
};

export default CentroControllo;
