import { useCallback, useEffect, useState } from "react";
import {
  Autocomplete, Box, Button, Card, Chip, CircularProgress, Stack, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography, Pagination, Tooltip, IconButton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const PRODUCT_LABELS = { black: "Black", mocha: "Mocha", latte: "Latte", greentea: "Green Tea" };
const PROFILE_LABELS = { cold: "Cold Curioso", warm: "Warm Decisore", coffeelover: "Coffee Lover", wellness: "Wellness Seeker" };

const AssignCell = ({ lead, onAssigned }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data: r } = await axiosInstance.get(`api/wp/admin/promoters/search?q=${encodeURIComponent(input)}`);
        setOptions(r?.data || []);
      } catch { /* silent */ }
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [input, open]);

  const handleAssign = async () => {
    if (!selected) return;
    setAssigning(true);
    try {
      await axiosInstance.post(`api/wp/admin/leads/${lead.id}/assign`, { promoter_id: selected.id });
      onAssigned?.(lead.id);
    } catch (e) { /* silent */ }
    setAssigning(false);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Autocomplete
        size="small"
        sx={{ minWidth: 220 }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        getOptionLabel={(o) => o?.username ? `${o.username} (${o.email})` : ""}
        isOptionEqualToValue={(o, v) => o?.id === v?.id}
        onChange={(_, v) => setSelected(v)}
        onInputChange={(_, v) => setInput(v)}
        renderInput={(params) => (
          <TextField {...params} placeholder="Cerca promoter…" size="small"
            InputProps={{ ...params.InputProps, endAdornment: loading ? <CircularProgress size={16} /> : params.InputProps.endAdornment }} />
        )}
      />
      <Button variant="contained" size="small" disabled={!selected || assigning}
        onClick={handleAssign}
        sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none" }}>
        {assigning ? "Assegno…" : "Assegna"}
      </Button>
    </Stack>
  );
};

const LeadOrphans = () => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: r } = await axiosInstance.get(`api/wp/admin/leads/orphans?page=${page}&per_page=50`);
      setData(r?.data || []);
      setMeta(r?.meta || null);
    } catch { /* silent */ }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAssigned = (leadId) => setData((d) => d.filter((l) => l.id !== leadId));

  const totalPages = Math.max(1, Math.ceil((meta?.total || 0) / (meta?.per_page || 50)));

  return (
    <Page title="Lead Orfani · Admin">
      <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: ESPRESSO, mb: 0.5 }}>Lead Orfani</Typography>
        <Typography sx={{ fontSize: "0.85rem", color: MUTED, mb: 2 }}>
          Lead dal quiz senza sponsor assegnato — assegna manualmente a un promoter.
          {meta && <strong style={{ marginLeft: 8 }}>{meta.total} totali</strong>}
        </Typography>

        <Card sx={{ borderRadius: 3, border: "1px solid #f0ece6" }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 5 }}><CircularProgress sx={{ color: ORO }} /></Box>
          ) : data.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5, color: MUTED, fontSize: "0.9rem" }}>
              Nessun lead orfano da assegnare 🎉
            </Box>
          ) : (
            <Box sx={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#FAF6EF" }}>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>Data</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>Nome</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>Email</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>Prodotto</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>Profilo</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>UTM</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }} align="right">Assegna a…</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell sx={{ fontSize: "0.78rem" }}>
                      {lead.completed_at ? new Date(lead.completed_at).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", fontWeight: 600 }}>{lead.name || "—"}</TableCell>
                    <TableCell sx={{ fontSize: "0.78rem" }}>
                      <Tooltip title={lead.email}><span>{lead.email.length > 28 ? lead.email.substring(0, 25) + "…" : lead.email}</span></Tooltip>
                    </TableCell>
                    <TableCell><Chip label={PRODUCT_LABELS[lead.result_product]} size="small" sx={{ bgcolor: alpha(ORO, 0.1), color: ORO, fontWeight: 700, fontSize: "0.7rem" }} /></TableCell>
                    <TableCell sx={{ fontSize: "0.75rem", color: MUTED }}>{PROFILE_LABELS[lead.result_profile]}</TableCell>
                    <TableCell sx={{ fontSize: "0.72rem", color: MUTED }}>{lead.utm_source || "—"}</TableCell>
                    <TableCell align="right">
                      <AssignCell lead={lead} onAssigned={handleAssigned} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </Box>
          )}
        </Card>

        {meta && meta.total > meta.per_page && (
          <Stack direction="row" justifyContent="center" mt={2}>
            <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
          </Stack>
        )}
      </Box>
    </Page>
  );
};

export default LeadOrphans;
