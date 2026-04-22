import { Avatar, Box, Card, Chip, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Tab, Tabs, Typography } from "@mui/material";
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
      <Chip label={items.length} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: alpha(ORO, 0.1), color: ORO }} />
    </Stack>
    {items.length === 0 ? (
      <Typography sx={{ fontSize: "0.78rem", color: "#aaa", textAlign: "center", py: 3 }}>{emptyText}</Typography>
    ) : (
      <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 0.5 }}>
        {items.map((item, i) => (
          <RankRow key={item.user_id + "-" + i} rank={i + 1} item={item} isMe={item.user_id === myId} />
        ))}
      </Box>
    )}
  </Card>
);

const MONTHS_IT = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const Leaderboard = () => {
  const { t, i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const MONTHS = isIt ? MONTHS_IT : MONTHS_EN;
  const now = new Date();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const years = [];
  for (let y = now.getFullYear(); y >= 2026; y--) years.push(y);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: r } = await axiosInstance.get(`api/wp/reports/leaderboard?month=${month}&year=${year}`);
      setData(r?.data);
    } catch (e) { /* silent */ }
    setLoading(false);
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <Stack spacing={2}>
      {/* Period filter */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>{isIt ? "Mese" : "Month"}</InputLabel>
          <Select value={month} label={isIt ? "Mese" : "Month"} onChange={(e) => setMonth(e.target.value)}>
            {MONTHS.map((m, i) => <MenuItem key={i+1} value={i+1}>{m}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>{isIt ? "Anno" : "Year"}</InputLabel>
          <Select value={year} label={isIt ? "Anno" : "Year"} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      {loading && <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress sx={{ color: ORO }} /></Box>}
      {!loading && !data && <Typography sx={{ color: "#aaa", textAlign: "center", py: 4 }}>{isIt ? "Nessun dato" : "No data"}</Typography>}
      {!loading && data && <LeaderboardContent data={data} tab={tab} setTab={setTab} isIt={isIt} />}
    </Stack>
  );
};

const LeaderboardContent = ({ data, tab, setTab, isIt }) => {
  const keyByTab = ["earnings", "recruiters", "achievers", "team"];
  const labelByTab = isIt
    ? ["Guadagni Globale", "Reclutatori Globale", "Rank Up Globale", "Il mio Team"]
    : ["Earnings Global", "Recruiters Global", "Rank Up Global", "My Team"];
  const valueLabelByTab = isIt
    ? ["guadagni", "reclutati", "rank top", "guadagni team"]
    : ["earnings", "recruits", "top rank", "team earnings"];

  const myPos = data?.my_positions?.[keyByTab[tab]] || {
    position: data?.my_position,
    value: data?.my_earnings,
    unit: "eur",
  };

  const renderValue = () => {
    if (myPos.value == null || myPos.value === 0 || myPos.value === "") {
      return <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#aaa" }}>—</Typography>;
    }
    if (myPos.unit === "eur") return <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: ESPRESSO }}>€{Number(myPos.value).toFixed(0)}</Typography>;
    if (myPos.unit === "count") return <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: ESPRESSO }}>{myPos.value}</Typography>;
    if (myPos.unit === "rank") return <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: ESPRESSO }}>{myPos.value}</Typography>;
    return <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: ESPRESSO }}>{myPos.value}</Typography>;
  };

  return (
    <Stack spacing={2}>
      {/* My position — dinamica in base alla tab */}
      <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${alpha(ORO, 0.2)}`, bgcolor: alpha(ORO, 0.03) }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(ORO, 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:podium-gold" width={28} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO }}>
                {isIt ? "La tua posizione" : "Your position"} — {labelByTab[tab]}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#7A6A5C" }}>{data.month}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center">
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: ORO }}>
                {myPos.position ? `#${myPos.position}` : "—"}
              </Typography>
              <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C" }}>{isIt ? "classifica" : "ranking"}</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              {renderValue()}
              <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C" }}>{valueLabelByTab[tab]}</Typography>
            </Box>
          </Stack>
        </Stack>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile
        sx={{
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.82rem", minHeight: 40, minWidth: "auto", px: 1.5 },
          "& .Mui-selected": { color: ORO },
          "& .MuiTabs-indicator": { bgcolor: ORO, height: 3, borderRadius: 2 },
          "& .MuiTabs-scrollButtons.Mui-disabled": { opacity: 0.3 },
        }}>
        <Tab label={isIt ? "Guadagni Globale" : "Earnings Global"} />
        <Tab label={isIt ? "Reclutatori Globale" : "Recruiters Global"} />
        <Tab label={isIt ? "Rank Up Globale" : "Rank Up Global"} />
        <Tab label={isIt ? "Il mio Team" : "My Team"} />
      </Tabs>

      {/* Content */}
      {tab === 0 && (
        <LeaderboardCard title={isIt ? "Classifica Guadagni — Globale" : "Earnings Ranking — Global"}
          icon="mdi:trophy" items={data.top_earners || []} myId={null}
          emptyText={isIt ? "Nessun dato questo mese" : "No data this month"} />
      )}
      {tab === 1 && (
        <LeaderboardCard title={isIt ? "Classifica Reclutatori — Globale" : "Recruiters Ranking — Global"}
          icon="mdi:account-multiple-plus" items={data.top_recruiters || []} myId={null}
          emptyText={isIt ? "Nessun reclutamento questo mese" : "No recruits this month"} />
      )}
      {tab === 2 && (
        <LeaderboardCard title={isIt ? "Classifica Rank Up — Globale" : "Rank Achievements — Global"}
          icon="mdi:medal" items={data.top_achievers || []} myId={null}
          emptyText={isIt ? "Nessun rank up questo mese" : "No rank ups this month"} />
      )}
      {tab === 3 && (
        <LeaderboardCard title={isIt ? "Classifica del tuo Team" : "Your Team Ranking"}
          icon="mdi:account-group" items={data.team_earners || []} myId={null}
          emptyText={isIt ? "Nessun membro nel team" : "No team members"} />
      )}
    </Stack>
  );
};

export default Leaderboard;
