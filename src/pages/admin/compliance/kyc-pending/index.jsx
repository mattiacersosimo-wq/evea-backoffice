import {
  Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Typography, ToggleButton, ToggleButtonGroup, CircularProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const STATUS_OPTIONS = [
  { value: "pending", label: "In attesa", color: "#FF9800" },
  { value: "approved", label: "Approvati", color: "#4CAF50" },
  { value: "rejected", label: "Rifiutati", color: "#E53935" },
  { value: "all", label: "Tutti", color: "#9E9E9E" },
];

const DocumentPreview = ({ doc, label, emptyText }) => {
  if (!doc?.url) {
    return <Typography sx={{ color: "#9E9E9E", fontSize: "0.8rem" }}>{emptyText}</Typography>;
  }
  const isPdf = (doc.mime || "").toLowerCase().includes("pdf");
  if (isPdf) {
    return (
      <Box sx={{ width: "100%", height: 500, border: "1px solid #ddd", borderRadius: 1, overflow: "hidden" }}>
        <Box component="iframe" src={doc.url} title={label} sx={{ width: "100%", height: "100%", border: 0 }} />
      </Box>
    );
  }
  return (
    <Box
      component="img"
      src={doc.url}
      alt={label}
      sx={{ width: "100%", borderRadius: 1, border: "1px solid #ddd" }}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

const StatusChip = ({ status }) => {
  const cfg = {
    pending: { label: "In attesa", color: "#FF9800" },
    approved: { label: "Approvato", color: "#4CAF50" },
    rejected: { label: "Rifiutato", color: "#E53935" },
  }[status] || { label: status || "—", color: "#9E9E9E" };
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: alpha(cfg.color, 0.12), color: cfg.color,
        fontWeight: 700, fontSize: "0.65rem", height: 22,
      }}
    />
  );
};

const KycPending = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = useState("pending");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [docUrls, setDocUrls] = useState({ front: null, back: null });
  const [docLoading, setDocLoading] = useState(false);

  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`api/wp/compliance/kyc-pending?status=${status}`);
      setRows(res.data.data || []);
    } catch {
      enqueueSnackbar("Errore caricamento", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [status, enqueueSnackbar]);

  useEffect(() => { load(); }, [load]);

  const fetchDocBlob = async (userId, type) => {
    const res = await axiosInstance.get(`api/wp/compliance/document/${userId}/${type}`, { responseType: "blob" });
    return { url: URL.createObjectURL(res.data), mime: res.data.type || "" };
  };

  const openViewer = async (row) => {
    setSelected(row);
    setOpenModal(true);
    setDocLoading(true);
    setDocUrls({ front: null, back: null });
    try {
      const front = await fetchDocBlob(row.id, "front");
      let back = null;
      try { back = await fetchDocBlob(row.id, "back"); } catch (e) { /* back optional */ }
      setDocUrls({ front, back });
    } catch {
      enqueueSnackbar("Errore caricamento documenti", { variant: "error" });
    } finally {
      setDocLoading(false);
    }
  };

  const closeViewer = () => {
    if (docUrls.front?.url) URL.revokeObjectURL(docUrls.front.url);
    if (docUrls.back?.url) URL.revokeObjectURL(docUrls.back.url);
    setDocUrls({ front: null, back: null });
    setSelected(null);
    setOpenModal(false);
    setOpenReject(false);
    setRejectReason("");
  };

  const approve = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axiosInstance.post(`api/wp/compliance/kyc/${selected.id}/approve`);
      enqueueSnackbar("KYC approvato", { variant: "success" });
      closeViewer();
      load();
    } catch {
      enqueueSnackbar("Errore approvazione", { variant: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async () => {
    if (!selected || !rejectReason.trim()) {
      enqueueSnackbar("Motivo obbligatorio", { variant: "warning" });
      return;
    }
    setActionLoading(true);
    try {
      await axiosInstance.post(`api/wp/compliance/kyc/${selected.id}/reject`, { reason: rejectReason });
      enqueueSnackbar("KYC rifiutato — utente notificato", { variant: "success" });
      closeViewer();
      load();
    } catch {
      enqueueSnackbar("Errore rifiuto", { variant: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Page title="KYC Verifica Documenti">
      <Box sx={{ px: 3, pb: 4 }}>
        <HeaderBreadcrumbs
          heading="KYC — Verifica Documenti"
          links={[{ name: "Dashboard" }, { name: "Compliance", href: "/admin/compliance" }, { name: "KYC" }]}
        />

        <Card sx={{ ...cs, p: 2.5, mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={1}>
            <ToggleButtonGroup
              value={status} exclusive size="small"
              onChange={(_, v) => v && setStatus(v)}
              sx={{ "& .MuiToggleButton-root": { textTransform: "none", fontWeight: 700, px: 2 } }}
            >
              {STATUS_OPTIONS.map((s) => (
                <ToggleButton key={s.value} value={s.value} sx={{ "&.Mui-selected": { bgcolor: alpha(s.color, 0.15), color: s.color } }}>
                  {s.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>
              {rows.length} {rows.length === 1 ? "utente" : "utenti"}
            </Typography>
          </Stack>
        </Card>

        <Card sx={{ ...cs }}>
          <Box sx={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: "#f9f6f0" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>Utente</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>CF</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>Tipo doc</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>Caricato</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>Stato</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem", color: ESPRESSO }}>Azione</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress size={24} sx={{ color: ORO }} /></TableCell></TableRow>
              ) : rows.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: "#9E9E9E", fontSize: "0.85rem" }}>Nessun utente con questo stato</TableCell></TableRow>
              ) : rows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Box>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO }}>{r.username}</Typography>
                      <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C" }}>{r.first_name} {r.last_name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>{r.email}</TableCell>
                  <TableCell sx={{ fontSize: "0.7rem", fontFamily: "monospace" }}>{r.codice_fiscale || "—"}</TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", textTransform: "capitalize" }}>
                    {r.id_document_type ? r.id_document_type.replace(/_/g, " ") : "—"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>
                    {r.updated_at ? new Date(r.updated_at).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                  </TableCell>
                  <TableCell><StatusChip status={r.kyc_status} /></TableCell>
                  <TableCell align="right">
                    <Button
                      size="small" variant="contained"
                      startIcon={<Iconify icon="mdi:eye" />}
                      onClick={() => openViewer(r)}
                      sx={{ bgcolor: ORO, "&:hover": { bgcolor: alpha(ORO, 0.85) }, textTransform: "none", fontWeight: 700, borderRadius: 1.5 }}
                    >
                      Verifica
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </Box>
        </Card>
      </Box>

      {/* Modal viewer */}
      <Dialog open={openModal} onClose={closeViewer} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: ESPRESSO }}>
              Verifica documento — {selected?.username}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#7A6A5C" }}>
              {selected?.first_name} {selected?.last_name} · {selected?.email}
            </Typography>
          </Box>
          <IconButton onClick={closeViewer}><Iconify icon="mdi:close" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selected?.kyc_status === "rejected" && selected?.kyc_reject_reason && (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: alpha("#E53935", 0.08), borderRadius: 1, border: "1px solid " + alpha("#E53935", 0.3) }}>
              <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#E53935" }}>Motivo rifiuto precedente:</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: ESPRESSO }}>{selected.kyc_reject_reason}</Typography>
            </Box>
          )}

          {docLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress sx={{ color: ORO }} /></Box>
          ) : (
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>FRONTE</Typography>
                <DocumentPreview doc={docUrls.front} label="Fronte" emptyText="Documento non disponibile" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>RETRO</Typography>
                <DocumentPreview doc={docUrls.back} label="Retro" emptyText="Retro non caricato" />
              </Box>
            </Stack>
          )}

          {openReject && (
            <Box sx={{ mt: 3, p: 2, bgcolor: alpha("#E53935", 0.05), borderRadius: 1 }}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>Motivo del rifiuto (visibile all'utente):</Typography>
              <TextField
                fullWidth multiline rows={3} size="small"
                placeholder="Es. Documento sfocato, data scaduta, immagine ritagliata..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #eee", px: 3, py: 2 }}>
          <Button onClick={closeViewer}>Chiudi</Button>
          {!openReject ? (
            <>
              <Button
                variant="outlined" color="error"
                startIcon={<Iconify icon="mdi:close-circle" />}
                onClick={() => setOpenReject(true)}
                disabled={selected?.kyc_status === "rejected" || actionLoading}
              >
                Rifiuta
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mdi:check-circle" />}
                onClick={approve}
                disabled={selected?.kyc_status === "approved" || actionLoading}
                sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" }, fontWeight: 700, textTransform: "none" }}
              >
                Approva
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => { setOpenReject(false); setRejectReason(""); }}>Annulla</Button>
              <Button
                variant="contained" color="error"
                onClick={reject}
                disabled={!rejectReason.trim() || actionLoading}
                sx={{ fontWeight: 700, textTransform: "none" }}
              >
                Conferma rifiuto
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default KycPending;
