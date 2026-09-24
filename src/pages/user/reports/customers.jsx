import { Box, Card, Chip, Grid, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B"; const ESPRESSO = "#2C1A0E"; const MUTED = "#7A6A5C";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const APP_STORE_URL = "https://apps.apple.com/app/id0";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.evea.backoffice";
const APP_INVITE_MSG = (name, iosUrl, androidUrl, t) =>
  t("reports.customers.invite_msg", { name: name || "", iosUrl, androidUrl });
const normalizePhone = (p) => (p || "").replace(/[^\d+]/g, "");

const AppChip = ({ status, t }) => {
  if (status === "ios+android") return <Chip icon={<Iconify icon="mdi:cellphone" width={12} sx={{ color: "#6A1B9A !important" }} />} label="iOS+Andr." size="small" sx={{ height: 20, fontSize: "0.62rem", fontWeight: 700, bgcolor: alpha("#6A1B9A", 0.1), color: "#6A1B9A" }} />;
  if (status === "ios") return <Chip icon={<Iconify icon="mdi:apple" width={12} sx={{ color: "#4527A0 !important" }} />} label="iOS" size="small" sx={{ height: 20, fontSize: "0.62rem", fontWeight: 700, bgcolor: alpha("#4527A0", 0.1), color: "#4527A0" }} />;
  if (status === "android") return <Chip icon={<Iconify icon="mdi:android" width={12} sx={{ color: "#2E7D32 !important" }} />} label="Android" size="small" sx={{ height: 20, fontSize: "0.62rem", fontWeight: 700, bgcolor: alpha("#2E7D32", 0.1), color: "#2E7D32" }} />;
  return <Chip label={t("reports.customers.no_app")} size="small" sx={{ height: 20, fontSize: "0.62rem", fontWeight: 600, bgcolor: "#f5f5f5", color: "#9e9e9e" }} />;
};

const CustomerReport = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try { const { data: r } = await axiosInstance.get("api/wp/reports/customers"); setData(r?.data); } catch {} setLoading(false); })(); }, []);

  const totals = data?.totals || {};
  const customers = data?.customers || [];
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const inviteToApp = (c) => {
    const msg = APP_INVITE_MSG(c.name || c.username, APP_STORE_URL, PLAY_STORE_URL, t);
    const phone = normalizePhone(c.phone).replace(/^\+/, "");
    const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Box>
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {[
          { label: t("evea.report_customers"), value: totals.total, color: "#2196F3", icon: "mdi:account-group" },
          { label: "Smartship", value: totals.smartship, color: "#8BC34A", icon: "mdi:refresh-circle" },
          { label: t("reports.customers.with_app"), value: totals.has_app ?? 0, color: "#6A1B9A", icon: "mdi:cellphone-check" },
          { label: t("evea.at_risk"), value: totals.at_risk, color: "#E24B4A", icon: "mdi:alert-circle" },
          { label: t("evea.avg_spent"), value: `€${totals.avg_spent || 0}`, color: ORO, icon: "mdi:cash" },
        ].map((c) => (
          <Grid item xs={6} md={2.4} key={c.label}>
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
                {[t("reports.customers.username"), t("common.name"), t("reports.customers.orders"), t("reports.customers.spending"), t("reports.customers.last_order"), t("reports.customers.days"), "Smartship", t("reports.customers.app"), t("reports.customers.action")].map((h) => (
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
                  <TableCell><AppChip status={c.app_status || "none"} t={t} /></TableCell>
                  <TableCell>
                    {!c.has_app ? (
                      <Chip label={t("reports.customers.invite")} size="small" icon={<Iconify icon="mdi:whatsapp" width={12} sx={{ color: "#25D366 !important" }} />}
                        onClick={() => inviteToApp(c)}
                        sx={{ cursor: "pointer", height: 22, fontSize: "0.6rem", fontWeight: 700, bgcolor: alpha("#25D366", 0.1), color: "#25D366", "&:hover": { bgcolor: alpha("#25D366", 0.2) } }} />
                    ) : (
                      <Iconify icon="mdi:check" width={16} sx={{ color: "#4CAF50" }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography sx={{ textAlign: "center", py: 3, color: MUTED }}>{t("reports.customers.no_customers")}</Typography>
        )}
      </Card>
    </Box>
  );
};

export default CustomerReport;
