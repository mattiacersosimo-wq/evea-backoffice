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
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";

const RANGE_OPTIONS = [
  { value: "7", label: "Ultimi 7 giorni" },
  { value: "30", label: "Ultimi 30 giorni" },
  { value: "90", label: "Ultimi 90 giorni" },
  { value: "all", label: "Sempre" },
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
    <Page title="Email Analytics">
      <Box>
        <HeaderBreadcrumbs
          heading="Analytics Email transazionali"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Email", href: PATH_DASHBOARD.settings.email_settings.root },
            { name: "Analytics" },
          ]}
          action={
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                component={Link}
                to={PATH_DASHBOARD.settings.email_settings.root}
              >
                Template
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to={PATH_DASHBOARD.settings.email_settings.flow}
              >
                Flusso
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
                <StatCard label="Email inviate" value={totals.sent} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Aperture totali" value={totals.opens_total} sub={`${totals.unique_opens} uniche`} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Open rate" value={`${totals.open_rate_pct}%`} sub="uniche / inviate" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Template attivi" value={perTemplate.length} />
              </Grid>
            </Grid>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Andamento invii / aperture (ultimi 30gg)</Typography>
                {timeline.length === 0 ? (
                  <Typography color="text.secondary">Nessun dato disponibile.</Typography>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sent" name="Inviate" stroke="#2C1A0E" strokeWidth={2} />
                      <Line type="monotone" dataKey="opens" name="Aperture" stroke="#B8963B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Open rate per template</Typography>
                {perTemplate.length === 0 ? (
                  <Typography color="text.secondary">Nessun dato disponibile.</Typography>
                ) : (
                  <ResponsiveContainer width="100%" height={Math.max(300, perTemplate.length * 40)}>
                    <BarChart data={perTemplate} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} unit="%" />
                      <YAxis dataKey="template_key" type="category" width={220} />
                      <Tooltip />
                      <Bar dataKey="open_rate_pct" name="Open rate %" fill="#B8963B" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>Ultimi destinatari</Typography>
                  <TextField
                    select
                    size="small"
                    value={recipientTemplate}
                    onChange={(e) => setRecipientTemplate(e.target.value)}
                    label="Template"
                    sx={{ minWidth: 260 }}
                  >
                    <MenuItem value="">Tutti i template</MenuItem>
                    {perTemplate.map((t) => (
                      <MenuItem key={t.template_key} value={t.template_key}>{t.template_key}</MenuItem>
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
                          <TableCell>Destinatario</TableCell>
                          <TableCell>Template</TableCell>
                          <TableCell>Lingua</TableCell>
                          <TableCell>Inviata il</TableCell>
                          <TableCell>Aperta</TableCell>
                          <TableCell align="right">N° open</TableCell>
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
                              Nessun destinatario nel periodo.
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
                <Typography variant="h6" sx={{ mb: 2 }}>Dettaglio per template</Typography>
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Template</TableCell>
                        <TableCell align="right">Inviate</TableCell>
                        <TableCell align="right">Aperture tot</TableCell>
                        <TableCell align="right">Aperture uniche</TableCell>
                        <TableCell align="right">Open rate</TableCell>
                        <TableCell align="right">Click</TableCell>
                        <TableCell align="right">Unsub</TableCell>
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
                            Nessuna email tracciata nel periodo.
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
