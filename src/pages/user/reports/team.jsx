import { Box, Card, Chip, Grid, MenuItem, Select, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const TeamReport = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState("all");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data: r } = await axiosInstance.get("api/wp/reports/team", { params: { level, status } });
      setData(r?.data);
    } catch { /* silent */ }
    setLoading(false);
  }, [level, status]);

  useEffect(() => { fetch(); }, [fetch]);

  const totals = data?.totals || {};
  const members = data?.members || [];
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <Box>
      {/* Filters */}
      <Stack direction="row" spacing={1.5} mb={2}>
        <Select size="small" value={level} onChange={(e) => setLevel(e.target.value)}
          sx={{ minWidth: 130, bgcolor: "#fff", borderRadius: 2, "& .MuiSelect-select": { py: 0.8, fontSize: "0.82rem" } }}>
          <MenuItem value={0}>All Levels</MenuItem>
          <MenuItem value={1}>1st Line</MenuItem>
          <MenuItem value={2}>1st + 2nd</MenuItem>
          <MenuItem value={3}>1st-3rd</MenuItem>
        </Select>
        <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: 120, bgcolor: "#fff", borderRadius: 2, "& .MuiSelect-select": { py: 0.8, fontSize: "0.82rem" } }}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </Stack>

      {/* Summary */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {[
          { label: t("evea.total"), value: totals.total, icon: "mdi:account-group", color: ESPRESSO },
          { label: t("evea.active"), value: totals.active, icon: "mdi:account-check", color: "#4A5C3A" },
          { label: t("evea.inactive"), value: totals.inactive, icon: "mdi:account-clock", color: "#EF9F27" },
          { label: "Promoters", value: totals.promoters, icon: "mdi:account-tie", color: ORO },
          { label: t("evea.report_customers"), value: totals.customers, icon: "mdi:account", color: "#2196F3" },
          { label: "Smartship", value: totals.smartship, icon: "mdi:refresh-circle", color: "#8BC34A" },
        ].map((c) => (
          <Grid item xs={4} md={2} key={c.label}>
            <Card sx={{ ...cs, p: 1.5, textAlign: "center" }}>
              <Iconify icon={c.icon} width={22} sx={{ color: c.color, mb: 0.3 }} />
              <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: c.color }}>{c.value || 0}</Typography>
              <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>{c.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table */}
      <Card sx={{ ...cs, p: 2 }}>
        {loading ? <Skeleton height={200} /> : members.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                {["Username", "Name", "Type", "Rank", "QV Month", "Last Order", "Status"].map((h) => (
                  <TableCell key={h} sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.user_id}>
                  <TableCell sx={{ fontSize: "0.78rem", fontWeight: 600 }}>{m.username}</TableCell>
                  <TableCell sx={{ fontSize: "0.78rem" }}>{m.name || "—"}</TableCell>
                  <TableCell><Chip label={m.type} size="small" sx={{ height: 20, fontSize: "0.6rem", fontWeight: 600, bgcolor: m.type === "promoter" ? alpha(ORO, 0.1) : alpha("#2196F3", 0.1), color: m.type === "promoter" ? ORO : "#2196F3" }} /></TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>{m.rank}</TableCell>
                  <TableCell sx={{ fontSize: "0.78rem", fontWeight: 700, color: m.qv_month > 0 ? ORO : "#ccc" }}>{m.qv_month}</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", color: MUTED }}>{formatDate(m.last_order)}</TableCell>
                  <TableCell><Chip label={m.active ? "Active" : "Inactive"} size="small" sx={{ height: 20, fontSize: "0.6rem", fontWeight: 600, bgcolor: m.active ? alpha("#4A5C3A", 0.1) : alpha("#EF9F27", 0.1), color: m.active ? "#4A5C3A" : "#EF9F27" }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography sx={{ textAlign: "center", py: 3, color: MUTED }}>No team members</Typography>
        )}
      </Card>
    </Box>
  );
};

export default TeamReport;
