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
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import useAuth from "src/hooks/useAuth";
import { PATH_USER } from "src/routes/paths";
import axiosInstance from "src/utils/axios";

const YEARS = [2024, 2025, 2026];

const headers = [
  "N° Fattura",
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

const StatCard = ({ label, value }) => (
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
      sx={{ color: "#B8963B", fontWeight: 700, mt: 0.5 }}
    >
      {value}
    </Typography>
  </Box>
);

const Autofatture = () => {
  const { user } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axiosInstance.get(
          `api/wp/autofatture/${user.id}`,
          { params: { anno: year } }
        );
        if (!cancelled) {
          const list = res.data?.data || res.data || [];
          setData(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(true);
          setData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [user?.id, year]);

  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return { lordo: 0, netto: 0, count: 0 };
    }
    const lordo = data.reduce(
      (sum, row) => sum + (parseFloat(row.lordo) || 0),
      0
    );
    const netto = data.reduce(
      (sum, row) => sum + (parseFloat(row.netto) || 0),
      0
    );
    return { lordo, netto, count: data.length };
  }, [data]);

  const handleDownloadXml = useCallback(async (id) => {
    try {
      const res = await axiosInstance.get(
        `api/wp/autofatture/${id}/xml`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `autofattura_${id}.xml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download XML failed:", err);
    }
  }, []);

  const dataProps = {
    loading,
    error,
    isArrayEmpty: data.length === 0,
  };

  return (
    <div>
      <Page title="Le Mie Autofatture">
        <HeaderBreadcrumbs
          heading="Le Mie Autofatture"
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            { name: "Le Mie Autofatture" },
          ]}
        />

        {/* Year selector */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
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
        </Box>

        {/* Summary cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              label="Totale Lordo"
              value={`€${stats.lordo.toFixed(2)}`}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              label="Totale Netto"
              value={`€${stats.netto.toFixed(2)}`}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard label="N° Fatture" value={stats.count} />
          </Grid>
        </Grid>

        {/* Table */}
        <Card sx={{ pt: 1 }}>
          <Scrollbar>
            <DataHandlerTable
              name="autofatture-table"
              headers={headers}
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
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>{row.numero}</TableCell>
                      <TableCell>{row.data}</TableCell>
                      <TableCell>€{parseFloat(row.lordo || 0).toFixed(2)}</TableCell>
                      <TableCell>€{parseFloat(row.imponibile || 0).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: "#C0392B" }}>
                        −€{parseFloat(row.ritenuta || 0).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: "#B8963B", fontWeight: 700 }}>
                        €{parseFloat(row.netto || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusCfg.label}
                          color={statusCfg.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleDownloadXml(row.id)}
                          sx={{
                            color: "#B8963B",
                            borderColor: "#B8963B",
                            "&:hover": {
                              borderColor: "#967A2F",
                              backgroundColor: "rgba(184, 150, 59, 0.04)",
                            },
                          }}
                        >
                          XML
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
      </Page>
    </div>
  );
};

export default Autofatture;
