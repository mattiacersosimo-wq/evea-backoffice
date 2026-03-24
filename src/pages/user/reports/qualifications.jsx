import { Box, Card, Chip, Grid, LinearProgress, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B"; const ESPRESSO = "#2C1A0E"; const MUTED = "#7A6A5C";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const getBadge = (pct) => {
  if (pct >= 90) return { label: "Ready!", color: "#4A5C3A", bg: "#EAF3DE" };
  if (pct >= 70) return { label: "Almost!", color: ORO, bg: alpha(ORO, 0.1) };
  return { label: "In progress", color: MUTED, bg: "#f5f5f5" };
};

const QualificationsReport = () => {
  const { t, i18n } = useTranslation();
  const isIt = i18n.resolvedLanguage === "it";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const { data: r } = await axiosInstance.get("api/wp/reports/qualifications"); setData(r?.data); }
      catch {}
      setLoading(false);
    })();
  }, []);

  const mvp = data?.mvp_progress || [];
  const rank = data?.rank_progress || [];
  const alerts = data?.alerts || [];

  return (
    <Box>
      {loading ? <Skeleton height={300} /> : (
        <>
          {/* Smart Alerts */}
          {alerts.length > 0 && (
            <Card sx={{ ...cs, p: 2.5, mb: 3, border: `1.5px solid ${ORO}`, bgcolor: alpha(ORO, 0.02) }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <Iconify icon="mdi:bell-ring" width={20} sx={{ color: ORO }} />
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>
                  {isIt ? "Notifiche Smart" : "Smart Alerts"}
                </Typography>
                <Chip label={alerts.length} size="small" sx={{ height: 22, fontWeight: 700, bgcolor: alpha(ORO, 0.1), color: ORO }} />
              </Stack>
              <Stack spacing={1}>
                {alerts.map((a, i) => (
                  <Stack key={i} direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.8, borderBottom: i < alerts.length - 1 ? "1px solid #f5f0e8" : "none" }}>
                    <Iconify icon={a.icon} width={20} sx={{ color: a.color }} />
                    <Typography sx={{ fontSize: "0.82rem", color: ESPRESSO, flex: 1 }}>
                      {isIt ? a.message_it : a.message}
                    </Typography>
                    {a.pct && <Chip label={`${a.pct}%`} size="small" sx={{ height: 22, fontWeight: 700, bgcolor: alpha(a.color, 0.1), color: a.color }} />}
                  </Stack>
                ))}
              </Stack>
            </Card>
          )}

          {/* MVP Progress */}
          <Card sx={{ ...cs, p: 2.5, mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Iconify icon="mdi:rocket-launch" width={22} sx={{ color: "#4CAF50" }} />
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ESPRESSO }}>
                {isIt ? "Avanzamento Go MVP del Team" : "Team Go MVP Progress"}
              </Typography>
              <Chip label={mvp.length} size="small" sx={{ height: 22, fontWeight: 700, bgcolor: alpha("#4CAF50", 0.1), color: "#4CAF50" }} />
            </Stack>

            {mvp.length === 0 ? (
              <Typography sx={{ textAlign: "center", py: 3, color: MUTED }}>
                {isIt ? "Tutti i promoter hanno già raggiunto il Go MVP o non hanno ancora il kit" : "All promoters already have Go MVP or no starter kit yet"}
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {mvp.map((m) => {
                  const badge = getBadge(m.avg_pct);
                  return (
                    <Box key={m.user_id} sx={{ p: 1.5, borderRadius: 2, bgcolor: m.expired ? alpha("#E24B4A", 0.03) : "#fafafa", border: `1px solid ${m.expired ? alpha("#E24B4A", 0.15) : "#f0ece6"}` }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.8}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO }}>{m.username}</Typography>
                          <Chip label={badge.label} size="small" sx={{ height: 20, fontSize: "0.6rem", fontWeight: 700, bgcolor: badge.bg, color: badge.color }} />
                          {m.expired && <Chip label="Expired" size="small" sx={{ height: 20, fontSize: "0.6rem", fontWeight: 700, bgcolor: alpha("#E24B4A", 0.1), color: "#E24B4A" }} />}
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: m.avg_pct >= 70 ? "#4CAF50" : MUTED }}>{m.avg_pct}%</Typography>
                          {!m.expired && <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>{m.days_left}d left</Typography>}
                        </Stack>
                      </Stack>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Stack direction="row" justifyContent="space-between" mb={0.2}>
                            <Typography sx={{ fontSize: "0.68rem", color: MUTED }}>DQV</Typography>
                            <Typography sx={{ fontSize: "0.68rem", color: MUTED }}>{m.dqv}/{m.dqv_required}</Typography>
                          </Stack>
                          <LinearProgress variant="determinate" value={m.dqv_pct}
                            sx={{ height: 5, borderRadius: 3, bgcolor: "#eee", "& .MuiLinearProgress-bar": { bgcolor: m.dqv_pct >= 100 ? "#4CAF50" : ORO, borderRadius: 3 } }} />
                        </Grid>
                        <Grid item xs={6}>
                          <Stack direction="row" justifyContent="space-between" mb={0.2}>
                            <Typography sx={{ fontSize: "0.68rem", color: MUTED }}>{isIt ? "Clienti" : "Customers"}</Typography>
                            <Typography sx={{ fontSize: "0.68rem", color: MUTED }}>{m.customers}/{m.customers_required}</Typography>
                          </Stack>
                          <LinearProgress variant="determinate" value={m.customers_pct}
                            sx={{ height: 5, borderRadius: 3, bgcolor: "#eee", "& .MuiLinearProgress-bar": { bgcolor: m.customers_pct >= 100 ? "#4CAF50" : "#2196F3", borderRadius: 3 } }} />
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Card>

          {/* Rank Progress */}
          <Card sx={{ ...cs, p: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Iconify icon="mdi:trophy-outline" width={22} sx={{ color: ORO }} />
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ESPRESSO }}>
                {isIt ? "Avanzamento Rank del Team" : "Team Rank Progress"}
              </Typography>
            </Stack>

            {rank.length === 0 ? (
              <Typography sx={{ textAlign: "center", py: 3, color: MUTED }}>
                {isIt ? "Nessun dato" : "No data"}
              </Typography>
            ) : (
              <Stack spacing={1}>
                {rank.map((r) => {
                  const badge = getBadge(r.gv_pct);
                  return (
                    <Stack key={r.user_id} direction="row" alignItems="center" spacing={1.5} sx={{ py: 1, borderBottom: "1px solid #f5f0e8" }}>
                      <Box sx={{ minWidth: 90 }}>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO }}>{r.username}</Typography>
                        <Chip label={r.type} size="small" sx={{ height: 16, fontSize: "0.5rem", bgcolor: r.type === "promoter" ? alpha(ORO, 0.1) : alpha("#2196F3", 0.1), color: r.type === "promoter" ? ORO : "#2196F3" }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" mb={0.2}>
                          <Typography sx={{ fontSize: "0.68rem", color: MUTED }}>{r.current_rank} → {r.next_rank}</Typography>
                          <Typography sx={{ fontSize: "0.68rem", color: MUTED }}>{r.gv}/{r.gv_required} GV</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={r.gv_pct}
                          sx={{ height: 6, borderRadius: 3, bgcolor: "#eee", "& .MuiLinearProgress-bar": { bgcolor: r.gv_pct >= 90 ? "#4CAF50" : r.gv_pct >= 70 ? ORO : "#ccc", borderRadius: 3 } }} />
                      </Box>
                      <Chip label={badge.label} size="small" sx={{ height: 22, fontSize: "0.6rem", fontWeight: 700, bgcolor: badge.bg, color: badge.color }} />
                      <Typography sx={{ fontSize: "0.9rem", fontWeight: 800, color: r.gv_pct >= 70 ? ORO : MUTED, minWidth: 40, textAlign: "right" }}>{r.gv_pct}%</Typography>
                    </Stack>
                  );
                })}
              </Stack>
            )}
          </Card>
        </>
      )}
    </Box>
  );
};

export default QualificationsReport;
