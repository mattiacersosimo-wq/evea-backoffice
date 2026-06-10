import {
  Box, Button, Card, Chip, CircularProgress, IconButton, Stack, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const SUCCESS = "#4CAF50";
const DANGER = "#E53935";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const StatusChip = ({ signed }) => (
  <Chip
    label={signed ? "Firmata" : "Non firmata"}
    size="small"
    icon={<Iconify icon={signed ? "mdi:check-circle" : "mdi:clock-outline"} width={14} />}
    sx={{
      bgcolor: alpha(signed ? SUCCESS : DANGER, 0.12),
      color: signed ? SUCCESS : DANGER,
      fontWeight: 700, fontSize: "0.7rem", height: 24,
      "& .MuiChip-icon": { color: signed ? SUCCESS : DANGER },
    }}
  />
);

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" });
};

const LettereIncarico = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("api/wp/compliance/lettere-incarico");
      setRows(res.data?.data || []);
    } catch (e) {
      enqueueSnackbar("Errore caricamento lettere", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "signed" && !r.signed) return false;
      if (filter === "unsigned" && r.signed) return false;
      if (!q) return true;
      const haystack = `${r.username || ""} ${r.first_name || ""} ${r.last_name || ""} ${r.email || ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, filter, search]);

  const counts = useMemo(() => ({
    all: rows.length,
    signed: rows.filter((r) => r.signed).length,
    unsigned: rows.filter((r) => !r.signed).length,
  }), [rows]);

  const download = async (row) => {
    if (!row.has_pdf) {
      enqueueSnackbar("PDF non disponibile sul disco", { variant: "warning" });
      return;
    }
    setDownloadingId(row.id);
    try {
      const res = await axiosInstance.get(
        `api/wp/compliance/lettere-incarico/${row.id}/download`,
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `lettera_incarico_${row.username || row.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      enqueueSnackbar("Errore download", { variant: "error" });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Page title="Lettere di Incarico">
      <Box sx={{ px: 3, pb: 4 }}>
        <HeaderBreadcrumbs
          heading="Lettere di Incarico Firmate"
          links={[
            { name: "Dashboard", href: "/admin/dashboard" },
            { name: "Compliance", href: "/admin/compliance" },
            { name: "Lettere di Incarico" },
          ]}
        />

        {/* Filtri */}
        <Card sx={{ ...cs, p: 2, mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
            <ToggleButtonGroup
              size="small" exclusive value={filter}
              onChange={(_, v) => v && setFilter(v)}
              sx={{ "& .MuiToggleButton-root": { textTransform: "none", fontWeight: 700, fontSize: "0.75rem", px: 2 },
                "& .Mui-selected": { bgcolor: `${alpha(ORO, 0.15)} !important`, color: `${ORO} !important` } }}
            >
              <ToggleButton value="all">Tutti ({counts.all})</ToggleButton>
              <ToggleButton value="signed">Firmate ({counts.signed})</ToggleButton>
              <ToggleButton value="unsigned">Non firmate ({counts.unsigned})</ToggleButton>
            </ToggleButtonGroup>
            <TextField
              size="small" placeholder="Cerca per username, nome o email…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <Iconify icon="mdi:magnify" width={18} style={{ marginRight: 6, color: "#999" }} /> }}
              sx={{ flex: 1 }}
            />
            <Button startIcon={<Iconify icon="mdi:refresh" />} onClick={load} variant="outlined"
              sx={{ textTransform: "none", borderColor: alpha(ORO, 0.3), color: ORO, fontWeight: 700 }}>
              Aggiorna
            </Button>
          </Stack>
        </Card>

        {/* Tabella */}
        <Card sx={{ ...cs, overflow: "hidden" }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress sx={{ color: ORO }} /></Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Iconify icon="mdi:file-document-outline" width={48} sx={{ color: "#ccc", mb: 1 }} />
              <Typography sx={{ fontSize: "0.85rem", color: "#999" }}>
                Nessun promoter trovato con questi filtri.
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>Promoter</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>Stato</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>Data firma</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>IP firma</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>Azione</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>
                      <Stack>
                        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: ESPRESSO }}>
                          {r.first_name || r.last_name
                            ? `${r.first_name || ""} ${r.last_name || ""}`.trim()
                            : r.username}
                        </Typography>
                        <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C" }}>@{r.username}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem", color: "#3D3229" }}>{r.email}</TableCell>
                    <TableCell><StatusChip signed={r.signed} /></TableCell>
                    <TableCell sx={{ fontSize: "0.72rem", color: "#3D3229" }}>
                      {r.signed ? formatDate(r.signed_at) : "—"}
                      {r.signed && r.versione && (
                        <Typography component="span" sx={{ ml: 0.5, fontSize: "0.6rem", color: "#7A6A5C" }}>
                          v{r.versione}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.7rem", color: "#7A6A5C", fontFamily: "monospace" }}>
                      {r.ip_address || "—"}
                    </TableCell>
                    <TableCell align="right">
                      {r.signed && r.has_pdf ? (
                        <Button
                          size="small" variant="contained" startIcon={
                            downloadingId === r.id
                              ? <CircularProgress size={14} sx={{ color: "#fff" }} />
                              : <Iconify icon="mdi:download" width={16} />
                          }
                          disabled={downloadingId === r.id}
                          onClick={() => download(r)}
                          sx={{ bgcolor: ORO, textTransform: "none", fontWeight: 700,
                            "&:hover": { bgcolor: "#9A7B2F" }, borderRadius: 1.5 }}
                        >
                          PDF
                        </Button>
                      ) : (
                        <Typography sx={{ fontSize: "0.68rem", color: "#bbb", fontStyle: "italic" }}>
                          {r.signed ? "PDF mancante" : "in attesa"}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </Box>
    </Page>
  );
};

export default LettereIncarico;
