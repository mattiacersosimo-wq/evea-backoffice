import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box, Button, Card, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Grid,
  IconButton, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Typography, Tooltip, Pagination
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const STATUS_LABELS = {
  new: { it: "Nuovo", color: ORO },
  contacted: { it: "Contattato", color: "#2196F3" },
  in_progress: { it: "In trattativa", color: "#9C27B0" },
  converted: { it: "Convertito", color: "#4CAF50" },
  lost: { it: "Perso", color: "#9E9E9E" },
};

const PRODUCT_LABELS = {
  black: "Black", mocha: "Mocha", latte: "Latte", greentea: "Green Tea",
};

const PROFILE_LABELS = {
  cold: "Cold Curioso", warm: "Warm Decisore",
  coffeelover: "Coffee Lover", wellness: "Wellness Seeker",
};

// Messaggi WhatsApp pre-compilati per combinazione prodotto+macro-profilo
const WA_TEMPLATES = {
  warm_mocha: "Ciao {name}! Sono {promoter}, Specialista EVEA. Ho visto che hai completato il quiz e che il tuo rituale è Mocha — ottima scelta per chi cerca un caffè avvolgente. Posso raccontarti due dettagli sul prodotto e su come iniziare?",
  warm_black: "Ciao {name}! Sono {promoter}, Specialista EVEA. Hai fatto il quiz e ti è uscito Black — il nostro caffè più intenso. Posso raccontarti due cose sul prodotto e su come iniziare?",
  warm_latte: "Ciao {name}! Sono {promoter}, Specialista EVEA. Hai fatto il quiz e ti è uscito Latte — perfetto per chi ama un caffè cremoso. Posso raccontarti due dettagli?",
  warm_greentea: "Ciao {name}! Sono {promoter}, Specialista EVEA. Hai fatto il quiz e ti è uscito Green Tea — ottimo per chi cerca un'alternativa più dolce alla caffeina. Posso raccontarti come iniziare?",
  cold_mocha: "Ciao {name}, sono {promoter} di EVEA. Hai fatto il quiz e il tuo rituale è uscito Mocha — un caffè ai funghi funzionali, morbido e avvolgente. Posso mandarti un breve video introduttivo?",
  cold_black: "Ciao {name}, sono {promoter} di EVEA. Hai fatto il quiz e il tuo rituale è uscito Black — il nostro caffè ai funghi funzionali più intenso. Posso mandarti un breve video introduttivo?",
  cold_latte: "Ciao {name}, sono {promoter} di EVEA. Hai fatto il quiz e il tuo rituale è uscito Latte — cremoso, leggero, ai funghi funzionali. Posso mandarti un breve video introduttivo?",
  cold_greentea: "Ciao {name}, sono {promoter} di EVEA. Hai fatto il quiz e il tuo rituale è uscito Green Tea — è un'ottima porta d'ingresso al mondo dei funghi funzionali, senza la caffeina forte. Posso mandarti un breve video introduttivo?",
};

const macroFromProfile = (p) => (p === "warm" || p === "coffeelover" ? "warm" : "cold");
const buildWaMessage = (lead, promoterName) => {
  const key = `${macroFromProfile(lead.result_profile)}_${lead.result_product}`;
  const tpl = WA_TEMPLATES[key] || WA_TEMPLATES.cold_mocha;
  return tpl.replace("{name}", lead.name || "").replace("{promoter}", promoterName || "");
};

const StatItem = ({ label, value, color = ESPRESSO }) => (
  <Box sx={{ textAlign: "center", px: 2 }}>
    <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</Typography>
    <Typography sx={{ fontSize: "0.7rem", color: MUTED, mt: 0.5, textTransform: "uppercase", letterSpacing: 1 }}>{label}</Typography>
  </Box>
);

const StatusChip = ({ status, onChange }) => {
  const cfg = STATUS_LABELS[status] || STATUS_LABELS.new;
  if (!onChange) {
    return <Chip label={cfg.it} size="small" sx={{ bgcolor: alpha(cfg.color, 0.15), color: cfg.color, fontWeight: 700, fontSize: "0.7rem" }} />;
  }
  return (
    <TextField select size="small" value={status} onChange={(e) => onChange(e.target.value)}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.8rem", bgcolor: alpha(cfg.color, 0.08), color: cfg.color, fontWeight: 700 } }}>
      {Object.entries(STATUS_LABELS).map(([k, v]) => (
        <MenuItem key={k} value={k} sx={{ fontSize: "0.8rem" }}>{v.it}</MenuItem>
      ))}
    </TextField>
  );
};

const LeadDetailModal = ({ open, onClose, lead, promoterUsername, onUpdate }) => {
  const [status, setStatus] = useState(lead?.status || "new");
  const [notes, setNotes] = useState(lead?.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    setStatus(lead?.status || "new");
    setNotes(lead?.notes || "");
  }, [lead?.id]);

  // Auto-save note con debounce
  useEffect(() => {
    if (!lead) return;
    if (notes === (lead.notes || "")) return;
    const t = setTimeout(async () => {
      setSavingNotes(true);
      try {
        await axiosInstance.patch(`api/wp/promoter/me/leads/${lead.id}`, { notes });
        onUpdate?.({ ...lead, notes });
      } catch (e) { /* silent */ }
      setSavingNotes(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [notes]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeStatus = async (newStatus) => {
    setStatus(newStatus);
    try {
      await axiosInstance.patch(`api/wp/promoter/me/leads/${lead.id}`, { status: newStatus });
      onUpdate?.({ ...lead, status: newStatus });
    } catch (e) { /* silent */ }
  };

  if (!lead) return null;

  const waMessage = encodeURIComponent(buildWaMessage(lead, promoterUsername));
  const mailtoSubject = encodeURIComponent(`EVEA · Il tuo rituale ${PRODUCT_LABELS[lead.result_product] || ""}`);
  const mailtoBody = encodeURIComponent(buildWaMessage(lead, promoterUsername));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: "1px solid #f0ece6", pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography sx={{ fontSize: "1.3rem", fontWeight: 700, color: ESPRESSO }}>
              {lead.name || lead.email}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: MUTED }}>{lead.email}</Typography>
          </Box>
          <StatusChip status={status} onChange={changeStatus} />
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>Prodotto</Typography>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ORO }}>{PRODUCT_LABELS[lead.result_product]}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>Profilo</Typography>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>{PROFILE_LABELS[lead.result_profile]}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>Completato</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO }}>
              {lead.completed_at ? new Date(lead.completed_at).toLocaleString("it-IT") : "—"}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>Sponsor code</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO }}>{lead.sponsor_code || "—"}</Typography>
          </Grid>
          {(lead.utm_source || lead.utm_medium || lead.utm_campaign) && (
            <Grid item xs={12}>
              <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>UTM</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: ESPRESSO }}>
                {[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" · ")}
              </Typography>
            </Grid>
          )}
        </Grid>

        {Array.isArray(lead.answers) && lead.answers.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>Risposte del quiz</Typography>
            <Box sx={{ bgcolor: "#FAF6EF", borderRadius: 2, p: 1.5, fontSize: "0.78rem", color: ESPRESSO }}>
              {lead.answers.map((a, i) => (
                <Box key={i} sx={{ mb: 0.5 }}>
                  <strong>Domanda {a.question_index ?? i + 1}:</strong> opzione #{a.option_index ?? "?"}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO }}>Note personali</Typography>
            {savingNotes && <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Salvataggio…</Typography>}
          </Stack>
          <TextField multiline rows={4} fullWidth size="small" value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Aggiungi note sul lead, esito chiamata, prossimi step…"
            sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.85rem", bgcolor: "#FFF" } }} />
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button variant="contained" startIcon={<Iconify icon="mdi:whatsapp" />}
            href={`https://wa.me/?text=${waMessage}`} target="_blank" rel="noreferrer"
            sx={{ bgcolor: "#25D366", "&:hover": { bgcolor: "#1ebe5d" }, textTransform: "none", fontWeight: 700 }}>
            WhatsApp
          </Button>
          <Button variant="outlined" startIcon={<Iconify icon="mdi:email-outline" />}
            href={`mailto:${lead.email}?subject=${mailtoSubject}&body=${mailtoBody}`}
            sx={{ borderColor: ORO, color: ORO, textTransform: "none" }}>
            Email
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const MyLeads = () => {
  const today = new Date();
  const isoDay = (d) => d.toISOString().slice(0, 10);
  const [from] = useState(isoDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30)));
  const [to] = useState(isoDay(today));
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [promoterUsername, setPromoterUsername] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "25", from, to });
      if (status !== "all") params.set("status", status);
      if (search) params.set("search", search);
      const { data: r } = await axiosInstance.get(`api/wp/promoter/me/leads?${params.toString()}`);
      setData(r?.data || []);
      setMeta(r?.meta || null);
    } catch { /* silent */ }
    setLoading(false);
  }, [page, status, search, from, to]);

  useEffect(() => {
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/user/me");
        setPromoterUsername(r?.data?.username || r?.username || "");
      } catch { /* silent */ }
    })();
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const stats = meta?.stats || {};
  const totalPages = useMemo(() => Math.max(1, Math.ceil((meta?.total || 0) / (meta?.per_page || 25))), [meta]);

  return (
    <Page title="I miei Lead">
      <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: ESPRESSO, mb: 0.5 }}>I miei Lead</Typography>
        <Typography sx={{ fontSize: "0.85rem", color: MUTED, mb: 3 }}>
          Lead generati dal quiz "Trova il tuo rituale" su myevea.com
        </Typography>

        {/* Stats - scroll orizzontale su mobile (5 items non ci stanno in 380px) */}
        <Card
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            border: "1px solid #f0ece6",
            overflow: "hidden",
            position: "relative",
            // Gradient fade a destra su mobile per suggerire lo scroll disponibile
            "&::after": {
              content: '""',
              display: { xs: "block", sm: "none" },
              position: "absolute",
              top: 0,
              right: 0,
              width: 40,
              height: "100%",
              pointerEvents: "none",
              background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)",
              zIndex: 2,
            },
          }}
        >
          {/* Freccia scroll indicator (solo mobile) */}
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              position: "absolute",
              top: "50%",
              right: 6,
              transform: "translateY(-50%)",
              zIndex: 3,
              color: ORO,
              pointerEvents: "none",
              alignItems: "center",
              animation: "leadArrowPulse 1.5s ease-in-out infinite",
              "@keyframes leadArrowPulse": {
                "0%, 100%": { transform: "translateY(-50%) translateX(0)", opacity: 0.7 },
                "50%": { transform: "translateY(-50%) translateX(3px)", opacity: 1 },
              },
            }}
          >
            <Iconify icon="mdi:chevron-right" width={22} />
          </Box>
          <Box
            sx={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Stack
              direction="row"
              divider={<Box sx={{ width: "1px", bgcolor: "#f0ece6", flexShrink: 0 }} />}
              justifyContent={{ xs: "flex-start", sm: "space-around" }}
              sx={{ minWidth: { xs: "max-content", sm: "auto" }, pr: { xs: 4, sm: 0 } }}
            >
              <Box sx={{ minWidth: { xs: 90, sm: "auto" }, flex: { sm: 1 }, px: { xs: 1.5, sm: 0 } }}>
                <StatItem label="questo mese" value={stats.total_this_month ?? 0} color={ORO} />
              </Box>
              <Box sx={{ minWidth: { xs: 90, sm: "auto" }, flex: { sm: 1 }, px: { xs: 1.5, sm: 0 } }}>
                <StatItem label="nuovi" value={stats.new ?? 0} color={STATUS_LABELS.new.color} />
              </Box>
              <Box sx={{ minWidth: { xs: 90, sm: "auto" }, flex: { sm: 1 }, px: { xs: 1.5, sm: 0 } }}>
                <StatItem label="contattati" value={stats.contacted ?? 0} color={STATUS_LABELS.contacted.color} />
              </Box>
              <Box sx={{ minWidth: { xs: 100, sm: "auto" }, flex: { sm: 1 }, px: { xs: 1.5, sm: 0 } }}>
                <StatItem label="in trattativa" value={stats.in_progress ?? 0} color={STATUS_LABELS.in_progress.color} />
              </Box>
              <Box sx={{ minWidth: { xs: 90, sm: "auto" }, flex: { sm: 1 }, px: { xs: 1.5, sm: 0 } }}>
                <StatItem label="convertiti" value={stats.converted ?? 0} color={STATUS_LABELS.converted.color} />
              </Box>
            </Stack>
          </Box>
        </Card>

        {/* Filters */}
        <Card sx={{ p: 2, mb: 2, borderRadius: 3, border: "1px solid #f0ece6" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField select size="small" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} label="Stato" sx={{ width: { md: 180 } }}>
              <MenuItem value="all">Tutti</MenuItem>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <MenuItem key={k} value={k}>{v.it}</MenuItem>)}
            </TextField>
            <TextField size="small" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cerca email/nome…" sx={{ flex: 1 }} />
            <Button variant="outlined" startIcon={<Iconify icon="mdi:refresh" />} onClick={fetchData} sx={{ borderColor: ORO, color: ORO }}>
              Aggiorna
            </Button>
          </Stack>
        </Card>

        {/* Table */}
        <Card sx={{ borderRadius: 3, border: "1px solid #f0ece6", overflow: "hidden" }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 5 }}><CircularProgress sx={{ color: ORO }} /></Box>
          ) : data.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5, color: MUTED, fontSize: "0.9rem" }}>
              Nessun lead trovato per i filtri impostati
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#FAF6EF" }}>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>Data</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>Nome</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>Email</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>Prodotto</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>Profilo</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>Stato</TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }} align="right">Azioni</TableCell>
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
                    <TableCell><StatusChip status={lead.status} /></TableCell>
                    <TableCell align="right">
                      <Tooltip title="WhatsApp">
                        <IconButton size="small" component="a" target="_blank" rel="noreferrer"
                          href={`https://wa.me/?text=${encodeURIComponent(buildWaMessage(lead, promoterUsername))}`}>
                          <Iconify icon="mdi:whatsapp" width={18} sx={{ color: "#25D366" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Dettaglio">
                        <IconButton size="small" onClick={() => setSelected(lead)}>
                          <Iconify icon="mdi:eye-outline" width={18} sx={{ color: ORO }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {meta && meta.total > meta.per_page && (
          <Stack direction="row" justifyContent="center" mt={2}>
            <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
          </Stack>
        )}

        <LeadDetailModal
          open={!!selected}
          onClose={() => setSelected(null)}
          lead={selected}
          promoterUsername={promoterUsername}
          onUpdate={(updated) => {
            setData((d) => d.map((l) => (l.id === updated.id ? { ...l, ...updated } : l)));
            setSelected(updated);
          }}
        />
      </Box>
    </Page>
  );
};

export default MyLeads;
