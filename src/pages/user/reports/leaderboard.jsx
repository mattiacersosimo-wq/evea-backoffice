import { Avatar, Box, Card, Chip, CircularProgress, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MEDAL = ["#FFD700", "#C0C0C0", "#CD7F32"];

const RankRow = ({ rank, item, isMe }) => (
  <Stack
    direction="row" alignItems="center" spacing={1.5}
    sx={{
      p: 1.5, borderRadius: 2, mb: 0.8,
      bgcolor: isMe ? alpha(ORO, 0.08) : rank <= 3 ? alpha(MEDAL[rank - 1], 0.06) : "transparent",
      border: isMe ? `1px solid ${alpha(ORO, 0.3)}` : "1px solid transparent",
    }}
  >
    <Box sx={{
      width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
      bgcolor: rank <= 3 ? MEDAL[rank - 1] : "#eee", color: rank <= 3 ? "#fff" : "#999",
      fontWeight: 800, fontSize: "0.75rem",
    }}>
      {rank}
    </Box>
    <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(ORO, 0.15), color: ORO, fontSize: "0.75rem", fontWeight: 700 }}>
      {(item.name?.[0] || item.username?.[0] || "?").toUpperCase()}
    </Avatar>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: ESPRESSO, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {item.name || item.username}
      </Typography>
      {item.rank && (
        <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C" }}>{item.rank}</Typography>
      )}
    </Box>
    <Typography sx={{ fontSize: "0.9rem", fontWeight: 800, color: rank <= 3 ? MEDAL[rank - 1] : ORO }}>
      {item.total_earned != null ? `€${item.total_earned.toFixed(0)}` : ""}
      {item.total_recruited != null ? item.total_recruited : ""}
      {item.rank_name != null && !item.total_earned && !item.total_recruited ? item.rank_name : ""}
    </Typography>
  </Stack>
);

const LeaderboardCard = ({ title, icon, items, myId, emptyText }) => (
  <Card sx={{ p: 2.5, borderRadius: 3, border: "1px solid #f0ece6", height: "100%" }}>
    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
      <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Iconify icon={icon} width={18} sx={{ color: ORO }} />
      </Box>
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>{title}</Typography>
    </Stack>
    {items.length === 0 ? (
      <Typography sx={{ fontSize: "0.78rem", color: "#aaa", textAlign: "center", py: 3 }}>{emptyText}</Typography>
    ) : (
      items.map((item, i) => (
        <RankRow key={item.user_id} rank={i + 1} item={item} isMe={item.user_id === myId} />
      ))
    )}
  </Card>
);

const Leaderboard = () => {
  const { t, i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const { data: r } = await axiosInstance.get("api/wp/reports/leaderboard");
      setData(r?.data);
    } catch (e) { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress sx={{ color: ORO }} /></Box>;
  if (!data) return null;

  return (
    <Stack spacing={2}>
      {/* My position */}
      <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${alpha(ORO, 0.2)}`, bgcolor: alpha(ORO, 0.03) }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(ORO, 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:podium-gold" width={28} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO }}>
                {isIt ? "La tua posizione" : "Your position"}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#7A6A5C" }}>{data.month}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center">
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: ORO }}>#{data.my_position}</Typography>
              <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C" }}>{isIt ? "classifica" : "ranking"}</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: ESPRESSO }}>€{data.my_earnings?.toFixed(0)}</Typography>
              <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C" }}>{isIt ? "guadagni" : "earnings"}</Typography>
            </Box>
          </Stack>
        </Stack>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)}
        sx={{
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.82rem", minHeight: 40 },
          "& .Mui-selected": { color: ORO },
          "& .MuiTabs-indicator": { bgcolor: ORO, height: 3, borderRadius: 2 },
        }}>
        <Tab label={isIt ? "Top Guadagni" : "Top Earners"} />
        <Tab label={isIt ? "Top Reclutatori" : "Top Recruiters"} />
        <Tab label={isIt ? "Rank Up" : "Rank Achievers"} />
        <Tab label={isIt ? "Il mio Team" : "My Team"} />
      </Tabs>

      {/* Content */}
      {tab === 0 && (
        <LeaderboardCard title={isIt ? "Top 10 Guadagni — Rete EVEA" : "Top 10 Earners — EVEA Network"}
          icon="mdi:trophy" items={data.top_earners || []} myId={null}
          emptyText={isIt ? "Nessun dato questo mese" : "No data this month"} />
      )}
      {tab === 1 && (
        <LeaderboardCard title={isIt ? "Top 10 Reclutatori — Questo Mese" : "Top 10 Recruiters — This Month"}
          icon="mdi:account-multiple-plus" items={data.top_recruiters || []} myId={null}
          emptyText={isIt ? "Nessun reclutamento questo mese" : "No recruits this month"} />
      )}
      {tab === 2 && (
        <LeaderboardCard title={isIt ? "Nuovi Rank — Questo Mese" : "Rank Achievements — This Month"}
          icon="mdi:medal" items={data.top_achievers || []} myId={null}
          emptyText={isIt ? "Nessun rank up questo mese" : "No rank ups this month"} />
      )}
      {tab === 3 && (
        <LeaderboardCard title={isIt ? "Top 10 del tuo Team" : "Top 10 in Your Team"}
          icon="mdi:account-group" items={data.team_earners || []} myId={null}
          emptyText={isIt ? "Nessun membro nel team" : "No team members"} />
      )}
    </Stack>
  );
};

export default Leaderboard;
