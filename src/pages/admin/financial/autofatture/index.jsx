import { LoadingButton } from "@mui/lab";
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
} from "@mui/material";
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
  in_attesa: { label: "In attesa", color: "warning" },
  inviata: { label: "Inviata", color: "success" },
  errore_sdi: { label: "Errore SDI", color: "error" },
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
        "<td>" + (row.user?.username || row.promoter || "") + "</td>" +
        "<td>" + (row.numero || "") + "</td>" +
        "<td>" + (row.data || "") + "</td>" +
        "<td>\u20AC" + parseFloat(row.lordo || 0).toFixed(2) + "</td>" +
        "<td>\u20AC" + parseFloat(row.imponibile || 0).toFixed(2) + "</td>" +
        '<td style="color:#C0392B">\u2212\u20AC' + parseFloat(row.ritenuta || 0).toFixed(2) + "</td>" +
        '<td style="color:#B8963B;font-weight:700">\u20AC' + parseFloat(row.netto || 0).toFixed(2) + "</td>" +
        "<td>" + (STATUS_CONFIG[row.stato]?.label || row.stato || "") + "</td>" +
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
  const [reinviaLoading, setReinviaLoading] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = { anno: year };
      if (selectedUserId) {
        params.user_id = selectedUserId;
      }
      const res = await axiosInstance.get("api/wp/autofatture", { params });
      const list = res.data?.data || res.data || [];
      setData(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setError(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedUserId, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownloadXml = useCallback(async (id) => {
    try {
      const res = await axiosInstance.get("api/wp/autofatture/" + id + "/xml", {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "autofattura_" + id + ".xml";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download XML failed:", err);
      enqueueSnackbar("Download XML fallito", { variant: "error" });
    }
  }, [enqueueSnackbar]);

  const handleReinvia = useCallback(
    async (id) => {
      setReinviaLoading(id);
      try {
        const { status, data: res } = await axiosInstance.post(
          "api/wp/autofatture/" + id + "/reinvia"
        );
        if (status === 200) {
          enqueueSnackbar(res.message || "Reinvio avviato");
          fetchData();
        }
      } catch (err) {
        enqueueSnackbar("Errore nel reinvio", { variant: "error" });
      } finally {
        setReinviaLoading(null);
      }
    },
    [fetchData, enqueueSnackbar]
  );

  const stats = useMemo(() => {
    if (!data.length)
      return { lordo: 0, netto: 0, count: 0, errori: 0 };
    return {
      lordo: data.reduce((s, r) => s + (parseFloat(r.lordo) || 0), 0),
      netto: data.reduce((s, r) => s + (parseFloat(r.netto) || 0), 0),
      count: data.length,
      errori: data.filter((r) => r.stato === "errore_sdi").length,
    };
  }, [data]);

  const dataProps = {
    loading,
    error,
    isArrayEmpty: data.length === 0,
  };

  return (
    <div>
      <Page title="Autofatture">
        <HeaderBreadcrumbs
          heading="Autofatture"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "Autofatture" },
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
              label={"N\u00B0 Errori SDI"}
              value={stats.errori}
              highlight={stats.errori > 0 ? "error" : undefined}
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
                  const canReinvia =
                    row.stato === "errore_sdi" ||
                    row.stato === "in_attesa";

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
                      <TableCell>{row.numero}</TableCell>
                      <TableCell>{row.data}</TableCell>
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
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Scarica XML">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleDownloadXml(row.id)}
                              sx={{
                                color: "#B8963B",
                                borderColor: "#B8963B",
                                "&:hover": {
                                  borderColor: "#967A2F",
                                  backgroundColor:
                                    "rgba(184, 150, 59, 0.04)",
                                },
                              }}
                            >
                              XML
                            </Button>
                          </Tooltip>
                          {canReinvia && (
                            <Tooltip title="Reinvia al Sistema di Interscambio">
                              <LoadingButton
                                size="small"
                                variant="outlined"
                                color="warning"
                                loading={reinviaLoading === row.id}
                                onClick={() => handleReinvia(row.id)}
                              >
                                Reinvia SDI
                              </LoadingButton>
                            </Tooltip>
                          )}
                        </Stack>
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
