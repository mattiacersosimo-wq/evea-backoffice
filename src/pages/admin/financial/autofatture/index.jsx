import {
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";
import Iconify from "src/components/Iconify";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import UsersSearch from "src/components/autoComplete/users";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import { escapeHtml } from "src/utils/safeHtml";

const YEARS = [2024, 2025, 2026];

const HEADERS = [
  "Promoter",
  "N\u00B0 Fattura",
  "Data",
  "Lordo",
  "Imponibile",
  "Ritenuta",
  "Netto",
  "Stato",
  "Azioni",
];

const STATUS_CONFIG = {
  generata: { label: "Generata", color: "success" },
  in_attesa: { label: "In attesa", color: "warning" },
};

const StatCard = ({ label, value, highlight }) => (
  <Box
    sx={{
      p: "16px",
      backgroundColor: "#FAF6EF",
      border: "1px solid #E8DDCA",
      borderRadius: "8px",
      textAlign: "center",
    }}
  >
    <Typography
      sx={{
        color: "#7A6A5C",
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="h5"
      sx={{
        color: highlight === "error" ? "#C0392B" : "#B8963B",
        fontWeight: 700,
        mt: 0.5,
      }}
    >
      {value}
    </Typography>
  </Box>
);

const exportCSV = (data) => {
  if (!data || data.length === 0) return;
  const csvHeaders = [
    "Promoter",
    "N\u00B0 Fattura",
    "Data",
    "Lordo",
    "Imponibile",
    "Ritenuta",
    "Netto",
    "Stato",
  ];
  const rows = data.map((row) => [
    row.user?.username || row.promoter || "",
    row.numero || "",
    row.data || "",
    parseFloat(row.lordo || 0).toFixed(2),
    parseFloat(row.imponibile || 0).toFixed(2),
    parseFloat(row.ritenuta || 0).toFixed(2),
    parseFloat(row.netto || 0).toFixed(2),
    STATUS_CONFIG[row.stato]?.label || row.stato || "",
  ]);
  const csv = [csvHeaders, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "autofatture.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportPDF = (data, stats) => {
  if (!data || data.length === 0) return;
  const printWindow = window.open("", "_blank");
  const rows = data
    .map(
      (row) =>
        "<tr>" +
        "<td>" + escapeHtml(row.user?.username || row.promoter || "") + "</td>" +
        "<td>" + escapeHtml(row.numero) + "</td>" +
        "<td>" + escapeHtml(row.data) + "</td>" +
        "<td>\u20AC" + parseFloat(row.lordo || 0).toFixed(2) + "</td>" +
        "<td>\u20AC" + parseFloat(row.imponibile || 0).toFixed(2) + "</td>" +
        '<td style="color:#C0392B">\u2212\u20AC' + parseFloat(row.ritenuta || 0).toFixed(2) + "</td>" +
        '<td style="color:#B8963B;font-weight:700">\u20AC' + parseFloat(row.netto || 0).toFixed(2) + "</td>" +
        "<td>" + escapeHtml(STATUS_CONFIG[row.stato]?.label || row.stato || "") + "</td>" +
        "</tr>"
    )
    .join("");
  printWindow.document.write(
    "<html><head><title>Autofatture</title>" +
    "<style>" +
    "body { font-family: Arial, sans-serif; padding: 20px; }" +
    "table { width: 100%; border-collapse: collapse; margin-top: 20px; }" +
    "th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }" +
    "th { background-color: #FAF6EF; color: #7A6A5C; }" +
    ".total-row { font-weight: bold; background-color: #FAF6EF; }" +
    "</style></head><body>" +
    "<h2>Autofatture</h2>" +
    "<table><thead><tr>" +
    "<th>Promoter</th><th>N\u00B0 Fattura</th><th>Data</th><th>Lordo</th><th>Imponibile</th><th>Ritenuta</th><th>Netto</th><th>Stato</th>" +
    "</tr></thead><tbody>" +
    rows +
    '<tr class="total-row">' +
    "<td colspan=\"3\">Totale</td>" +
    "<td>\u20AC" + stats.lordo.toFixed(2) + "</td><td></td><td></td>" +
    '<td style="color:#B8963B">\u20AC' + stats.netto.toFixed(2) + "</td><td></td>" +
    "</tr></tbody></table></body></html>"
  );
  printWindow.document.close();
  printWindow.print();
};

const AdminAutofatture = () => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({ defaultValues: { user_id: "" } });
  const selectedUserId = methods.watch("user_id");

  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [monthExport, setMonthExport] = useState(new Date().getMonth() + 1);

  const handleExportMensile = useCallback(async () => {
    try {
      const res = await axiosInstance.get("api/wp/nota-compensi/export-monthly", {
        params: { month: monthExport, year },
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payout_export_${year}_${monthExport}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      enqueueSnackbar("Export fallito", { variant: "error" });
    }
  }, [monthExport, year, enqueueSnackbar]);

  const handleCuAnnuale = useCallback(async () => {
    try {
      const params = { year };
      if (selectedUserId) params.user_id = selectedUserId;
      const { data: res } = await axiosInstance.get("api/wp/nota-compensi/cu-annuale", { params });
      const d = res?.data;
      if (!d) return;
      const lines = [
        `RIEPILOGO ANNUALE CU ${d.anno}`,
        ``,
        `Totale Lordo:          EUR ${parseFloat(d.lordo).toFixed(2)}`,
        `Totale Imponibile:     EUR ${parseFloat(d.imponibile).toFixed(2)}`,
        `Totale Ritenute:       EUR ${parseFloat(d.ritenuta).toFixed(2)}`,
        `INPS Quota Promoter:   EUR ${parseFloat(d.inps_promoter).toFixed(2)}`,
        `INPS Quota Azienda:    EUR ${parseFloat(d.inps_evea).toFixed(2)}`,
        `Totale Bolli:          EUR ${parseFloat(d.bollo).toFixed(2)}`,
        `Totale Netto:          EUR ${parseFloat(d.netto).toFixed(2)}`,
        `N. Payout:             ${d.num_payout}`,
      ];
      const blob = new Blob([lines.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cu_annuale_${d.anno}${selectedUserId ? "_user" + selectedUserId : ""}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      enqueueSnackbar("Export CU fallito", { variant: "error" });
    }
  }, [year, selectedUserId, enqueueSnackbar]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = { anno: year };
      if (selectedUserId) {
        params.user_id = selectedUserId;
      }
      const res = await axiosInstance.get("api/wp/autofatture", { params });
      const list = res.data?.autofatture || res.data?.data || res.data || [];
      setData(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedUserId, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownloadPdf = useCallback(async (id) => {
    try {
      const res = await axiosInstance.get("api/wp/nota-compensi/" + id + "/pdf", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "nota_compensi_" + id + ".pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      enqueueSnackbar("Download PDF fallito", { variant: "error" });
    }
  }, [enqueueSnackbar]);

  const stats = useMemo(() => {
    if (!data.length)
      return { lordo: 0, netto: 0, count: 0, ritenute: 0 };
    return {
      lordo: data.reduce((s, r) => s + (parseFloat(r.lordo) || 0), 0),
      netto: data.reduce((s, r) => s + (parseFloat(r.netto) || 0), 0),
      count: data.length,
      ritenute: data.reduce((s, r) => s + (parseFloat(r.ritenuta) || 0), 0),
    };
  }, [data]);

  const dataProps = {
    loading,
    error,
    isArrayEmpty: data.length === 0,
  };

  return (
    <div>
      <Page title="Note di Compenso">
        <HeaderBreadcrumbs
          heading="Note di Compenso"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "Note di Compenso" },
          ]}
        />

        {/* Filters */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <FormProvider {...methods}>
              <Box sx={{ minWidth: 300 }}>
                <UsersSearch
                  name="user_id"
                  inputProps={{ size: "small", placeholder: "Filtra per promoter (opzionale)" }}
                />
              </Box>
            </FormProvider>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Anno</InputLabel>
              <Select
                value={year}
                label="Anno"
                onChange={(e) => setYear(e.target.value)}
              >
                {YEARS.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedUserId && (
              <Button
                size="small"
                variant="text"
                onClick={() => methods.setValue("user_id", "")}
                sx={{ color: "#C0392B" }}
              >
                Rimuovi filtro promoter
              </Button>
            )}

            {data.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => exportCSV(data)}
                  sx={{
                    color: "#B8963B",
                    borderColor: "#B8963B",
                    "&:hover": {
                      borderColor: "#967A2F",
                      backgroundColor: "rgba(184, 150, 59, 0.04)",
                    },
                  }}
                >
                  CSV
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => exportPDF(data, stats)}
                  sx={{
                    color: "#B8963B",
                    borderColor: "#B8963B",
                    "&:hover": {
                      borderColor: "#967A2F",
                      backgroundColor: "rgba(184, 150, 59, 0.04)",
                    },
                  }}
                >
                  PDF
                </Button>
              </Stack>
            )}
          </Box>
        </Card>

        {/* Report Commercialista */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
            <Iconify icon="mdi:file-document-outline" width={20} sx={{ color: "#B8963B" }} />
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#2C1A0E" }}>Report Commercialista</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Mese</InputLabel>
              <Select value={monthExport} label="Mese" onChange={(e) => setMonthExport(e.target.value)}>
                {["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"].map((m, i) => (
                  <MenuItem key={i + 1} value={i + 1}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button size="small" variant="outlined" startIcon={<Iconify icon="mdi:download" width={16} />} onClick={handleExportMensile}
              sx={{ color: "#B8963B", borderColor: "#B8963B", "&:hover": { borderColor: "#967A2F", bgcolor: "rgba(184,150,59,0.04)" } }}>
              Export Mensile CSV
            </Button>
            <Divider orientation="vertical" flexItem />
            <Button size="small" variant="contained" startIcon={<Iconify icon="mdi:certificate-outline" width={16} />} onClick={handleCuAnnuale}
              sx={{ bgcolor: "#4A5C3A", "&:hover": { bgcolor: "#3A4A2E" } }}>
              CU Annuale {year}
            </Button>
          </Stack>
        </Card>

        {/* Summary */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Totale Lordo"
              value={"\u20AC" + stats.lordo.toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Totale Netto"
              value={"\u20AC" + stats.netto.toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label={"N\u00B0 Fatture"} value={stats.count} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label={"Ritenute"}
              value={"\u20AC" + stats.ritenute.toFixed(2)}
            />
          </Grid>
        </Grid>

        {/* Table */}
        <Card sx={{ pt: 1 }}>
          <Scrollbar>
            <DataHandlerTable
              name="admin-all-autofatture"
              headers={HEADERS}
              dataProps={dataProps}
            >
              <Map
                list={data}
                render={(row, i) => {
                  const statusCfg =
                    STATUS_CONFIG[row.stato] || STATUS_CONFIG.in_attesa;

                  return (
                    <TableRow
                      key={row.id || i}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell>
                        {row.user?.username || row.promoter || "\u2014"}
                      </TableCell>
                      <TableCell>{row.numero_fattura || row.numero}</TableCell>
                      <TableCell>{row.data_fattura || row.data}</TableCell>
                      <TableCell>
                        {"\u20AC"}{parseFloat(row.lordo || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {"\u20AC"}{parseFloat(row.imponibile || 0).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: "#C0392B" }}>
                        {"\u2212\u20AC"}{parseFloat(row.ritenuta || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        sx={{ color: "#B8963B", fontWeight: 700 }}
                      >
                        {"\u20AC"}{parseFloat(row.netto || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusCfg.label}
                          color={statusCfg.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Scarica nota di compenso PDF">
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleDownloadPdf(row.id)}
                            sx={{ bgcolor: "#E24B4A", "&:hover": { bgcolor: "#C0392B" }, fontWeight: 700, fontSize: "0.7rem" }}
                          >
                            PDF
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                }}
              />
              {data && data.length > 0 && (
                <TableRow
                  sx={{
                    backgroundColor: "#FAF6EF",
                    "& td": { fontWeight: 700 },
                  }}
                >
                  <TableCell colSpan={3} sx={{ color: "#7A6A5C" }}>
                    Totale
                  </TableCell>
                  <TableCell>{"\u20AC"}{stats.lordo.toFixed(2)}</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell sx={{ color: "#B8963B" }}>
                    {"\u20AC"}{stats.netto.toFixed(2)}
                  </TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
              )}
            </DataHandlerTable>
          </Scrollbar>
        </Card>
      </Page>
    </div>
  );
};

export default AdminAutofatture;
