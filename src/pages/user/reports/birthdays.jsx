import { Box, Card, Chip, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B"; const ESPRESSO = "#2C1A0E"; const MUTED = "#7A6A5C";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const BirthdayCard = ({ member, highlight }) => {
  const dobDate = member.date_of_birth ? new Date(member.date_of_birth) : null;
  const day = dobDate ? dobDate.getDate() : "?";
  const month = dobDate ? dobDate.toLocaleDateString("it-IT", { month: "short" }) : "";

  return (
    <Card sx={{
      ...cs, p: 2, display: "flex", alignItems: "center", gap: 2,
      ...(highlight && { border: `2px solid ${ORO}`, bgcolor: alpha(ORO, 0.03) }),
    }}>
      <Box sx={{
        width: 50, height: 50, borderRadius: 2, textAlign: "center",
        bgcolor: highlight ? alpha(ORO, 0.1) : "#f5f5f5",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: highlight ? ORO : ESPRESSO, lineHeight: 1 }}>{day}</Typography>
        <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: MUTED, textTransform: "uppercase" }}>{month}</Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: ESPRESSO }}>{member.name || member.username}</Typography>
        <Stack direction="row" spacing={0.8} alignItems="center">
          <Typography sx={{ fontSize: "0.72rem", color: MUTED }}>@{member.username}</Typography>
          <Chip label={member.type === "promoter" ? "Promoter" : "Customer"} size="small"
            sx={{ height: 18, fontSize: "0.55rem", fontWeight: 600, bgcolor: member.type === "promoter" ? alpha(ORO, 0.1) : alpha("#2196F3", 0.1), color: member.type === "promoter" ? ORO : "#2196F3" }} />
          {member.age && <Typography sx={{ fontSize: "0.68rem", color: MUTED }}>{member.age} years</Typography>}
        </Stack>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        {member.is_today ? (
          <Chip label="TODAY!" size="small" sx={{ bgcolor: alpha("#E91E63", 0.1), color: "#E91E63", fontWeight: 700, fontSize: "0.7rem" }} />
        ) : (
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: member.is_this_week ? ORO : MUTED }}>
            {member.days_until === 1 ? "Tomorrow" : `${member.days_until} days`}
          </Typography>
        )}
      </Box>
    </Card>
  );
};

const BirthdaySection = ({ title, icon, color, members }) => {
  if (!members || !members.length) return null;
  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
        <Iconify icon={icon} width={20} sx={{ color }} />
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>{title}</Typography>
        <Chip label={members.length} size="small" sx={{ height: 22, fontWeight: 700, bgcolor: alpha(color, 0.1), color }} />
      </Stack>
      <Stack spacing={1}>
        {members.map((m) => <BirthdayCard key={m.user_id} member={m} highlight={m.is_today || m.is_this_week} />)}
      </Stack>
    </Box>
  );
};

const BirthdaysReport = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const { data: r } = await axiosInstance.get("api/wp/reports/birthdays"); setData(r?.data); }
      catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const today = data?.today || [];
  const thisWeek = data?.this_week || [];
  const thisMonth = data?.this_month || [];
  const all = data?.all || [];

  return (
    <Box>
      {loading ? <Skeleton height={200} /> : (
        <>
          {today.length === 0 && thisWeek.length === 0 && thisMonth.length === 0 && all.length === 0 && (
            <Card sx={{ ...cs, p: 4, textAlign: "center" }}>
              <Iconify icon="mdi:cake-variant-outline" width={48} sx={{ color: "#ddd", mb: 1 }} />
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: MUTED }}>
                No birthdays registered yet
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#aaa", mt: 0.5 }}>
                Team members can add their birthday in their profile
              </Typography>
            </Card>
          )}

          <BirthdaySection title="Today!" icon="mdi:party-popper" color="#E91E63" members={today} />
          <BirthdaySection title="This Week" icon="mdi:calendar-week" color={ORO} members={thisWeek} />
          <BirthdaySection title="This Month" icon="mdi:calendar-month" color="#4CAF50" members={thisMonth} />

          {all.length > 0 && (today.length > 0 || thisWeek.length > 0 || thisMonth.length > 0) && (
            <Box sx={{ mt: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <Iconify icon="mdi:cake-variant" width={20} sx={{ color: MUTED }} />
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>All Upcoming</Typography>
              </Stack>
              <Stack spacing={1}>
                {all.filter((m) => !m.is_today && !m.is_this_week && !m.is_this_month).slice(0, 20).map((m) => (
                  <BirthdayCard key={m.user_id} member={m} highlight={false} />
                ))}
              </Stack>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default BirthdaysReport;
