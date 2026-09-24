import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";

const getRangeOptions = (t) => [
  { value: "7", label: t("admin.mail.range_7d", "Ultimi 7 giorni") },
  { value: "30", label: t("admin.mail.range_30d", "Ultimi 30 giorni") },
  { value: "90", label: t("admin.mail.range_90d", "Ultimi 90 giorni") },
  { value: "all", label: t("admin.mail.range_all", "Sempre") },
];

const StatCard = ({ label, value, sub }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, color: "#B8963B", fontFamily: "Georgia, serif" }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {sub}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const EmailAnalytics = () => {
  const { t } = useTranslation();
  const RANGE_OPTIONS = getRangeOptions(t);
  const [range, setRange] = useState("30");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState([]);
  const [recipientsLoading, setRecipientsLoading] = useState(false);
  const [recipientTemplate, setRecipientTemplate] = useState("");

  const fetchData = async (selectedRange) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("api/admin/email/analytics", {
        params: { range: selectedRange },
      });
      setData(res.data?.data || null);
    } catch (e) {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async (template, selectedRange) => {
    setRecipientsLoading(true);
    try {
      const res = await axiosInstance.get("api/admin/email/analytics/recipients", {
        params: { template: template || "", range: selectedRange, limit: 200 },
      });
      setRecipients(res.data?.data || []);
    } catch (e) {
      setRecipients([]);
    } finally {
      setRecipientsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(range);
    fetchRecipients(recipientTemplate, range);
  }, [range]);

  useEffect(() => {
    fetchRecipients(recipientTemplate, range);
  }, [recipientTemplate]);

  const totals = data?.totals || { sent: 0, opens_total: 0, unique_opens: 0, open_rate_pct: 0 };
  const perTemplate = data?.per_template || [];
  const timeline = data?.timeline || [];

  return (
    <Page title={t("admin.mail.analytics_page_title", "Email Analytics")}>
      <Box>
        <HeaderBreadcrumbs
          heading={t("admin.mail.analytics_heading", "Analytics Email transazionali")}
          links={[
            { name: t("admin.mail.crumb_dashboard", "Dashboard"), href: PATH_DASHBOARD.root },
            { name: t("admin.mail.crumb_email", "Email"), href: PATH_DASHBOARD.settings.email_settings.root },
            { name: t("admin.mail.btn_analytics", "Analytics") },
          ]}
          action={
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                component={Link}
                to={PATH_DASHBOARD.settings.email_settings.root}
              >
                {t("admin.mail.btn_templates", "Template")}
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to={PATH_DASHBOARD.settings.email_settings.flow}
              >
                {t("admin.mail.crumb_flow", "Flusso")}
              </Button>
            </Stack>
          }
        />

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            select
            size="small"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {RANGE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label={t("admin.mail.stat_sent", "Email inviate")} value={totals.sent} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label={t("admin.mail.stat_opens_total", "Aperture totali")} value={totals.opens_total} sub={t("admin.mail.stat_unique_suffix", "{{n}} uniche", { n: totals.unique_opens })} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label={t("admin.mail.stat_open_rate", "Open rate")} value={`${totals.open_rate_pct}%`} sub={t("admin.mail.stat_open_rate_sub", "uniche / inviate")} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label={t("admin.mail.stat_active_templates", "Template attivi")} value={perTemplate.length} />
              </Grid>
            </Grid>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>{t("admin.mail.chart_trend_title", "Andamento invii / aperture (ultimi 30gg)")}</Typography>
                {timeline.length === 0 ? (
                  <Typography color="text.secondary">{t("admin.mail.no_data_available", "Nessun dato disponibile.")}</Typography>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sent" name={t("admin.mail.legend_sent", "Inviate")} stroke="#2C1A0E" strokeWidth={2} />
                      <Line type="monotone" dataKey="opens" name={t("admin.mail.legend_opens", "Aperture")} stroke="#B8963B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>{t("admin.mail.chart_open_rate_title", "Open rate per template")}</Typography>
                {perTemplate.length === 0 ? (
                  <Typography color="text.secondary">{t("admin.mail.no_data_available", "Nessun dato disponibile.")}</Typography>
                ) : (
                  <ResponsiveContainer width="100%" height={Math.max(300, perTemplate.length * 40)}>
                    <BarChart data={perTemplate} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} unit="%" />
                      <YAxis dataKey="template_key" type="category" width={220} />
                      <Tooltip />
                      <Bar dataKey="open_rate_pct" name={t("admin.mail.chart_open_rate_bar", "Open rate %")} fill="#B8963B" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>{t("admin.mail.last_recipients_title", "Ultimi destinatari")}</Typography>
                  <TextField
                    select
                    size="small"
                    value={recipientTemplate}
                    onChange={(e) => setRecipientTemplate(e.target.value)}
                    label={t("admin.mail.filter_template", "Template")}
                    sx={{ minWidth: 260 }}
                  >
                    <MenuItem value="">{t("admin.mail.filter_all_templates", "Tutti i template")}</MenuItem>
                    {perTemplate.map((tpl) => (
                      <MenuItem key={tpl.template_key} value={tpl.template_key}>{tpl.template_key}</MenuItem>
                    ))}
                  </TextField>
                </Stack>
                {recipientsLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t("admin.mail.col_recipient", "Destinatario")}</TableCell>
                          <TableCell>{t("admin.mail.filter_template", "Template")}</TableCell>
                          <TableCell>{t("admin.mail.col_language", "Lingua")}</TableCell>
                          <TableCell>{t("admin.mail.col_sent_at", "Inviata il")}</TableCell>
                          <TableCell>{t("admin.mail.col_opened", "Aperta")}</TableCell>
                          <TableCell align="right">{t("admin.mail.col_opens_count", "N° open")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recipients.map((r) => {
                          const opened = !!r.first_open_time;
                          return (
                            <TableRow key={r.id}>
                              <TableCell>
                                <b>{r.recipient_email}</b>
                                {r.user_id ? <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>user #{r.user_id}</Typography> : null}
                              </TableCell>
                              <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>{r.template_key}</TableCell>
                              <TableCell>{r.language || "-"}</TableCell>
                              <TableCell>{r.sent_time ? new Date(r.sent_time.replace(" ", "T")).toLocaleString("it-IT") : "-"}</TableCell>
                              <TableCell>
                                {opened ? (
                                  <span style={{ color: "#4caf50", fontWeight: 600 }}>
                                    ✓ {new Date(r.first_open_time.replace(" ", "T")).toLocaleString("it-IT")}
                                  </span>
                                ) : (
                                  <span style={{ color: "#f44336" }}>—</span>
                                )}
                              </TableCell>
                              <TableCell align="right">{r.opens_count || 0}</TableCell>
                            </TableRow>
                          );
                        })}
                        {recipients.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ color: "text.secondary" }}>
                              {t("admin.mail.no_recipients", "Nessun destinatario nel periodo.")}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>{t("admin.mail.per_template_title", "Dettaglio per template")}</Typography>
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("admin.mail.filter_template", "Template")}</TableCell>
                        <TableCell align="right">{t("admin.mail.col_sent", "Inviate")}</TableCell>
                        <TableCell align="right">{t("admin.mail.col_opens_total", "Aperture tot")}</TableCell>
                        <TableCell align="right">{t("admin.mail.col_unique_opens", "Aperture uniche")}</TableCell>
                        <TableCell align="right">{t("admin.mail.stat_open_rate", "Open rate")}</TableCell>
                        <TableCell align="right">{t("admin.mail.col_clicks", "Click")}</TableCell>
                        <TableCell align="right">{t("admin.mail.col_unsub", "Unsub")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {perTemplate.map((row) => (
                        <TableRow key={row.template_key}>
                          <TableCell>{row.template_key}</TableCell>
                          <TableCell align="right">{row.sent}</TableCell>
                          <TableCell align="right">{row.opens_total}</TableCell>
                          <TableCell align="right">{row.unique_opens}</TableCell>
                          <TableCell align="right">
                            <b style={{ color: row.open_rate_pct >= 30 ? "#4caf50" : row.open_rate_pct >= 15 ? "#B8963B" : "#f44336" }}>
                              {row.open_rate_pct}%
                            </b>
                          </TableCell>
                          <TableCell align="right">{row.clicks_total}</TableCell>
                          <TableCell align="right">{row.unsubscribes}</TableCell>
                        </TableRow>
                      ))}
                      {perTemplate.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ color: "text.secondary" }}>
                            {t("admin.mail.no_emails_tracked", "Nessuna email tracciata nel periodo.")}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Page>
  );
};

export default EmailAnalytics;
