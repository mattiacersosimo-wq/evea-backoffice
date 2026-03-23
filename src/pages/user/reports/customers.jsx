import { Box, Card, Chip, Grid, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B"; const ESPRESSO = "#2C1A0E"; const MUTED = "#7A6A5C";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const CustomerReport = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try { const { data: r } = await axiosInstance.get("api/wp/reports/customers"); setData(r?.data); } catch {} setLoading(false); })(); }, []);

  const totals = data?.totals || {};
  const customers = data?.customers || [];
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <Box>
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {[
          { label: t("evea.report_customers"), value: totals.total, color: "#2196F3", icon: "mdi:account-group" },
          { label: "Smartship", value: totals.smartship, color: "#8BC34A", icon: "mdi:refresh-circle" },
          { label: t("evea.at_risk"), value: totals.at_risk, color: "#E24B4A", icon: "mdi:alert-circle" },
          { label: t("evea.avg_spent"), value: `€${totals.avg_spent || 0}`, color: ORO, icon: "mdi:cash" },
        ].map((c) => (
          <Grid item xs={6} md={3} key={c.label}>
            <Card sx={{ ...cs, p: 2, textAlign: "center" }}>
              <Iconify icon={c.icon} width={24} sx={{ color: c.color, mb: 0.5 }} />
              <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: c.color }}>{c.value}</Typography>
              <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>{c.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ ...cs, p: 2 }}>
        {loading ? <Skeleton height={200} /> : customers.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                {["Username", "Name", "Orders", "Total Spent", "Last Order", "Days Ago", "Smartship", "Status"].map((h) => (
                  <TableCell key={h} sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.user_id} sx={{ bgcolor: c.at_risk ? alpha("#E24B4A", 0.03) : "transparent" }}>
                  <TableCell sx={{ fontSize: "0.78rem", fontWeight: 600 }}>{c.username}</TableCell>
                  <TableCell sx={{ fontSize: "0.78rem" }}>{c.name || "—"}</TableCell>
                  <TableCell sx={{ fontSize: "0.78rem" }}>{c.order_count}</TableCell>
                  <TableCell sx={{ fontSize: "0.78rem", fontWeight: 700, color: ORO }}>{"\u20AC"}{c.total_spent.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", color: MUTED }}>{formatDate(c.last_order)}</TableCell>
                  <TableCell sx={{ fontSize: "0.78rem", color: c.at_risk ? "#E24B4A" : MUTED, fontWeight: c.at_risk ? 700 : 400 }}>{c.days_since_last ?? "—"}</TableCell>
                  <TableCell>{c.smartship ? <Iconify icon="mdi:check-circle" sx={{ color: "#8BC34A" }} width={18} /> : <Iconify icon="mdi:close-circle-outline" sx={{ color: "#ddd" }} width={18} />}</TableCell>
                  <TableCell><Chip label={c.at_risk ? t("evea.at_risk") : "OK"} size="small" sx={{ height: 20, fontSize: "0.6rem", fontWeight: 600, bgcolor: c.at_risk ? alpha("#E24B4A", 0.1) : alpha("#4A5C3A", 0.1), color: c.at_risk ? "#E24B4A" : "#4A5C3A" }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography sx={{ textAlign: "center", py: 3, color: MUTED }}>No customers</Typography>
        )}
      </Card>
    </Box>
  );
};

export default CustomerReport;
