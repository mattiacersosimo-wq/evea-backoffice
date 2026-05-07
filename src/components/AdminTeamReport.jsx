import {
  Avatar, Box, Card, Chip, Grid, LinearProgress, Skeleton, Stack, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const TEXT = "#3D3229";
const MUTED = "#7A6A5C";

/**
 * Widget Report Team in versione admin: mostra KPI / inattivi / top referral / stats
 * di un promoter qualunque passato come prop. Usa gli endpoint
 *   GET /api/wp/dashboard/team-details?period=...&user_id=X
 *   GET /api/wp/dashboard/stats?user_id=X
 * con override admin (richiede is_super_admin=1).
 */
export default function AdminTeamReport({ userId, username }) {
  const [period, setPeriod] = useState("month");
  const [team, setTeam] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let off = false;
    setLoading(true);
    (async () => {
      try {
        const { data } = await axiosInstance.get(`api/wp/dashboard/team-details?period=${period}&user_id=${userId}`);
        if (!off) setTeam(data?.data || null);
      } catch { /* silent */ }
      if (!off) setLoading(false);
    })();
    return () => { off = true; };
  }, [period, userId]);

  useEffect(() => {
    if (!userId) return;
    let off = false;
    setStatsLoading(true);
    (async () => {
      try {
        const { data } = await axiosInstance.get(`api/wp/dashboard/stats?user_id=${userId}`);
        if (!off) setStats(data?.data || null);
      } catch { /* silent */ }
      if (!off) setStatsLoading(false);
    })();
    return () => { off = true; };
  }, [userId]);

  const Delta = ({ cur, prev, suffix = "" }) => {
    if (!prev) return null;
    const d = cur - prev;
    return <Typography component="span" sx={{ fontSize: "0.6rem", color: d >= 0 ? "#4CAF50" : "#E24B4A", ml: 0.5 }}>{d >= 0 ? "↑" : "↓"}{Math.abs(d)}{suffix}</Typography>;
  };

  return (
    <Card sx={{ p: 2.5, borderRadius: 3, border: "1px solid #f0ece6", bgcolor: "#fff" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: `linear-gradient(135deg, ${alpha(ORO, 0.18)} 0%, ${alpha(ORO, 0.06)} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:account-group-outline" width={19} sx={{ color: ORO }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: TEXT, lineHeight: 1.1 }}>Report Team</Typography>
            {username && <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>{username}</Typography>}
          </Box>
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
          <Grid container spacing={1}>
            {[
              { label: "QV Team", value: team.qv_team, prev: team.qv_team_prev, color: ORO, icon: "mdi:chart-bar" },
              { label: "Revenue Team", value: `€${team.revenue_team}`, prev: team.revenue_team_prev, color: "#4CAF50", icon: "mdi:cash", rawVal: team.revenue_team },
              { label: "Nuovi Clienti", value: team.new_clients_period, prev: team.new_clients_prev, color: "#2196F3", icon: "mdi:account-plus" },
              { label: "Nuovi Promoter", value: team.new_promoters_period, prev: team.new_promoters_prev, color: "#9C27B0", icon: "mdi:account-star" },
            ].map((m) => (
              <Grid item xs={6} sm={3} key={m.label}>
                <Box sx={{
                  p: 1.4, borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(m.color, 0.08)} 0%, ${alpha(m.color, 0.02)} 100%)`,
                  border: `1px solid ${alpha(m.color, 0.18)}`,
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

          {(team.top_referrals || []).length > 0 && (
            <Box>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: TEXT, mb: 0.8 }}>Top referral del periodo</Typography>
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
            </Box>
          )}

          {!statsLoading && stats && (
            <Stack spacing={1}>
              {[
                { label: "Tasso di riordine", value: stats.tasso_riordine || 0, color: "#4CAF50", icon: "mdi:refresh" },
                { label: "Clienti smartship", value: stats.clienti_smartship || 0, color: "#2196F3", icon: "mdi:calendar-check" },
                { label: "Promoter attivi", value: stats.promoter_attivi || 0, color: ORO, icon: "mdi:account-check" },
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
      ) : (
        <Typography sx={{ fontSize: "0.85rem", color: MUTED, textAlign: "center", py: 3 }}>
          Nessun dato disponibile per questo utente
        </Typography>
      )}
    </Card>
  );
}
