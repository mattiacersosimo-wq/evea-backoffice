import {
  Alert, Avatar, Box, Button, Card, Chip, CircularProgress, Dialog,
  DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton,
  Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const DANGER = "#E24B4A";
const SUCCESS = "#4A5C3A";

const MoveUser = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [userId, setUserId] = useState("");
  const [newSponsorId, setNewSponsorId] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handlePreview = async () => {
    if (!userId || !newSponsorId) {
      enqueueSnackbar(t("admin.move_user.err_ids_required", "Inserisci entrambi gli ID"), { variant: "warning" });
      return;
    }
    setLoading(true);
    setPreview(null);
    try {
      const { data } = await axiosInstance.get("api/wp/admin/move-user/preview", {
        params: { user_id: userId, new_sponsor_id: newSponsorId },
      });
      setPreview(data?.data);
    } catch (err) {
      enqueueSnackbar(err?.error || err?.message || t("admin.move_user.err_preview", "Errore nel preview"), { variant: "error" });
    }
    setLoading(false);
  };

  const handleMove = async () => {
    setMoving(true);
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("new_sponsor_id", newSponsorId);
      const { data } = await axiosInstance.post("api/wp/admin/move-user", formData);
      enqueueSnackbar(data?.message || t("admin.move_user.move_completed", "Spostamento completato!"), { variant: "success" });
      setConfirmOpen(false);
      setPreview(null);
      setUserId("");
      setNewSponsorId("");
    } catch (err) {
      enqueueSnackbar(err?.error || err?.message || t("admin.move_user.err_move", "Errore nello spostamento"), { variant: "error" });
    }
    setMoving(false);
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    setShowHistory(true);
    try {
      const { data } = await axiosInstance.get("api/wp/admin/move-user/history");
      setHistory(data?.data || []);
    } catch { setHistory([]); }
    setHistoryLoading(false);
  };

  const UserCard = ({ title, user, color }) => (
    <Card sx={{ p: 2.5, bgcolor: alpha(color, 0.04), border: `1px solid ${alpha(color, 0.15)}`, borderRadius: 3 }}>
      <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#7A6A5C", textTransform: "uppercase", mb: 1 }}>{title}</Typography>
      {user ? (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(color, 0.15), color, fontWeight: 700 }}>
            {(user.name || user.username || "?").charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, color: ESPRESSO }}>{user.name || user.username}</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>
              @{user.username}
              {user.type && <Chip label={user.type} size="small" sx={{ ml: 1, height: 18, fontSize: "0.55rem" }} />}
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Typography sx={{ color: "#ccc" }}>—</Typography>
      )}
    </Card>
  );

  return (
    <Page title={t("admin.move_user.page_title", "Sposta Utente")}>
      <Box sx={{ px: 3, pb: 4 }}>
        <HeaderBreadcrumbs heading={t("admin.move_user.page_title", "Sposta Utente")} links={[{ name: t("admin.move_user.bc_dashboard", "Dashboard") }, { name: t("admin.move_user.bc_move_user", "Sposta Utente") }]} />

        {/* Search */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #f0ece6" }}>
          <Typography variant="subtitle1" fontWeight={700} color={ESPRESSO} mb={2}>
            <Iconify icon="mdi:account-switch" width={22} sx={{ mr: 1, verticalAlign: "middle", color: ORO }} />
            {t("admin.move_user.title_move", "Sposta un utente sotto un nuovo sponsor")}
          </Typography>
          <Typography variant="body2" color="#7A6A5C" mb={3}>
            {t("admin.move_user.subtitle", "L'utente e tutto il suo team verranno spostati sotto il nuovo sponsor. Questa operazione è registrata nel log.")}
          </Typography>

          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth size="small" label={t("admin.move_user.field_user_id", "ID o Username utente da spostare")}
                value={userId} onChange={(e) => setUserId(e.target.value)}
                InputProps={{ startAdornment: <Iconify icon="mdi:account" width={18} sx={{ mr: 1, color: "#aaa" }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={1} sx={{ textAlign: "center" }}>
              <Iconify icon="mdi:arrow-right-bold" width={28} sx={{ color: ORO }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth size="small" label={t("admin.move_user.field_new_sponsor_id", "ID o Username nuovo sponsor")}
                value={newSponsorId} onChange={(e) => setNewSponsorId(e.target.value)}
                InputProps={{ startAdornment: <Iconify icon="mdi:account-star" width={18} sx={{ mr: 1, color: "#aaa" }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth variant="contained" onClick={handlePreview} disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <Iconify icon="mdi:eye" />}
                sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none", borderRadius: 2 }}
              >
                {t("admin.move_user.btn_preview", "Anteprima")}
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Preview */}
        {preview && (
          <Card sx={{ p: 3, mb: 3, borderRadius: 3, border: preview.is_circular ? `2px solid ${DANGER}` : `1px solid ${alpha(SUCCESS, 0.3)}` }}>
            <Typography variant="subtitle1" fontWeight={700} color={ESPRESSO} mb={2}>
              <Iconify icon="mdi:file-find" width={20} sx={{ mr: 1, verticalAlign: "middle", color: ORO }} />
              {t("admin.move_user.preview_title", "Anteprima Spostamento")}
            </Typography>

            {preview.is_circular && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                <b>{t("admin.move_user.circular_ref_title", "Riferimento circolare!")}</b> {t("admin.move_user.circular_ref_body", "Il nuovo sponsor è un discendente dell'utente. Spostamento non possibile.")}
              </Alert>
            )}

            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={4}>
                <UserCard title={t("admin.move_user.user_to_move", "Utente da spostare")} user={preview.user} color={ORO} />
              </Grid>
              <Grid item xs={12} md={4}>
                <UserCard title={t("admin.move_user.current_sponsor", "Sponsor attuale")} user={preview.old_sponsor} color="#607D8B" />
              </Grid>
              <Grid item xs={12} md={4}>
                <UserCard title={t("admin.move_user.new_sponsor", "Nuovo sponsor")} user={preview.new_sponsor} color={SUCCESS} />
              </Grid>
            </Grid>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Chip
                icon={<Iconify icon="mdi:account-group" width={16} />}
                label={t("admin.move_user.team_will_move", "{{n}} membri del team verranno spostati insieme", { n: preview.descendants_count })}
                sx={{ bgcolor: alpha(ORO, 0.1), color: ESPRESSO, fontWeight: 600 }}
              />
              <Box sx={{ flex: 1 }} />
              {preview.can_move && (
                <Button
                  variant="contained" color="error" onClick={() => setConfirmOpen(true)}
                  startIcon={<Iconify icon="mdi:account-switch" />}
                  sx={{ fontWeight: 700, textTransform: "none", borderRadius: 2 }}
                >
                  {t("admin.move_user.btn_confirm_move", "Conferma Spostamento")}
                </Button>
              )}
            </Stack>
          </Card>
        )}

        {/* History */}
        <Button
          variant="outlined" onClick={loadHistory} startIcon={<Iconify icon="mdi:history" />}
          sx={{ borderColor: alpha(ORO, 0.3), color: ORO, fontWeight: 600, textTransform: "none", borderRadius: 2 }}
        >
          {showHistory ? t("admin.move_user.btn_refresh_history", "Aggiorna Storico") : t("admin.move_user.btn_show_history", "Mostra Storico Spostamenti")}
        </Button>

        {showHistory && (
          <Card sx={{ mt: 2, borderRadius: 3, border: "1px solid #f0ece6" }}>
            {historyLoading ? (
              <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress size={24} sx={{ color: ORO }} /></Box>
            ) : history.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="#aaa">{t("admin.move_user.no_history", "Nessuno spostamento registrato")}</Typography>
              </Box>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#faf8f5" }}>
                    <TableCell sx={{ fontWeight: 700, color: ESPRESSO }}>{t("admin.move_user.th_date", "Data")}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ESPRESSO }}>{t("admin.move_user.th_user", "Utente")}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ESPRESSO }}>{t("admin.move_user.th_from", "Da")}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ESPRESSO }}>{t("admin.move_user.th_to", "A")}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ESPRESSO }}>{t("admin.move_user.th_admin", "Admin")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell sx={{ fontSize: "0.75rem" }}>
                        {new Date(h.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
                      <TableCell>
                        <Chip label={h.user_username} size="small" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", color: DANGER }}>@{h.old_sponsor_username}</TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", color: SUCCESS, fontWeight: 600 }}>@{h.new_sponsor_username}</TableCell>
                      <TableCell sx={{ fontSize: "0.7rem", color: "#aaa" }}>{h.admin_username || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        )}

        {/* Confirm Dialog */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, color: DANGER }}>
            <Iconify icon="mdi:alert" width={24} sx={{ mr: 1, verticalAlign: "middle" }} />
            {t("admin.move_user.dlg_confirm_title", "Conferma Spostamento")}
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <span dangerouslySetInnerHTML={{ __html: t("admin.move_user.dlg_confirm_warning", "Stai per spostare <b>{{user}}</b> (e {{n}} membri del team) da <b>@{{oldSponsor}}</b> a <b>@{{newSponsor}}</b>.", { user: preview?.user?.username, n: preview?.descendants_count, oldSponsor: preview?.old_sponsor?.username, newSponsor: preview?.new_sponsor?.username, interpolation: { escapeValue: true } }) }} />
              <br /><br />
              <span dangerouslySetInnerHTML={{ __html: t("admin.move_user.dlg_irreversible", "Questa operazione è <b>irreversibile</b> senza un altro spostamento manuale.") }} />
            </Alert>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: "none" }}>{t("admin.move_user.dlg_cancel", "Annulla")}</Button>
            <Button
              variant="contained" color="error" onClick={handleMove} disabled={moving}
              startIcon={moving ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="mdi:check" />}
              sx={{ fontWeight: 700, textTransform: "none" }}
            >
              {moving ? t("admin.move_user.dlg_moving", "Spostando...") : t("admin.move_user.dlg_move_final", "Sposta Definitivamente")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Page>
  );
};

export default MoveUser;
