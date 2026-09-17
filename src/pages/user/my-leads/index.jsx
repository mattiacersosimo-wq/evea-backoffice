import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Button, Card, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Grid,
  IconButton, MenuItem, Stack, TextField, Typography, Tooltip, Pagination, Snackbar,
  Avatar, Divider,
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

const SOURCE_CONFIG = {
  quiz: { label: "Quiz", icon: "mdi:brain", color: "#1976D2", bg: "#E3F2FD" },
  "landing-prodotto": { label: "Prodotto", icon: "mdi:package-variant", color: "#2E7D32", bg: "#E8F5E9" },
  "landing-opportunita": { label: "Opportunita", icon: "mdi:rocket-launch", color: ORO, bg: alpha(ORO, 0.12) },
};

const HEAT_BUCKETS = {
  hot: { min: 70, label: "caldi", icon: "🔥", color: "#D32F2F", bg: "#FFEBEE" },
  warm: { min: 40, max: 69, label: "tiepidi", icon: "☀️", color: "#F57C00", bg: "#FFF3E0" },
  cold: { max: 39, label: "freddi", icon: "❄️", color: "#0277BD", bg: "#E1F5FE" },
};

// Messaggi WhatsApp pre-compilati per combinazione prodotto+macro-profilo (quiz)
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

const WA_GENERIC = {
  "landing-prodotto": "Ciao {name}, sono {promoter} di EVEA. Ho visto che hai lasciato il tuo contatto sulla pagina prodotto. Posso raccontarti brevemente come iniziamo?",
  "landing-opportunita": "Ciao {name}, sono {promoter} di EVEA. Hai lasciato il tuo contatto sulla pagina Opportunita — mi piacerebbe spiegarti in 2 minuti come funziona e capire se puo interessarti. Ti va se ci sentiamo?",
};

const macroFromProfile = (p) => (p === "warm" || p === "coffeelover" ? "warm" : "cold");
const buildWaMessage = (lead, promoterName) => {
  if (lead.source === "quiz") {
    const key = `${macroFromProfile(lead.result_profile)}_${lead.result_product}`;
    const tpl = WA_TEMPLATES[key] || WA_TEMPLATES.cold_mocha;
    return tpl.replace("{name}", lead.name || "").replace("{promoter}", promoterName || "");
  }
  const tpl = WA_GENERIC[lead.source] || WA_GENERIC["landing-prodotto"];
  return tpl.replace("{name}", lead.name || "").replace("{promoter}", promoterName || "");
};

const normalizePhone = (p) => (p || "").replace(/[^\d+]/g, "");
const waLink = (phone, msg) => {
  const encoded = encodeURIComponent(msg);
  const cleaned = normalizePhone(phone).replace(/^\+/, "");
  return cleaned ? `https://wa.me/${cleaned}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
};

const initials = (name, email) => {
  const src = (name || email || "?").trim();
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.substring(0, 2).toUpperCase();
};

const fuzzyDate = (iso) => {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "—";
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (min < 1) return "adesso";
  if (min < 60) return `${min} min fa`;
  const hrs = Math.round(min / 60);
  if (hrs < 24) return `${hrs}h fa`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}g fa`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} mesi fa`;
  return new Date(iso).toLocaleDateString("it-IT");
};

const heatBucket = (heat) => {
  const n = Number(heat) || 0;
  if (n >= HEAT_BUCKETS.hot.min) return "hot";
  if (n >= HEAT_BUCKETS.warm.min) return "warm";
  return "cold";
};

// --- Sub-components ---

const HeatPill = ({ heat }) => {
  const bucket = heatBucket(heat);
  const cfg = HEAT_BUCKETS[bucket];
  const flames = bucket === "hot" ? "🔥🔥🔥" : bucket === "warm" ? "🔥🔥" : "🔥";
  return (
    <Box sx={{
      display: "inline-flex", flexDirection: "column", alignItems: "center",
      minWidth: 52, px: 1, py: 0.5, borderRadius: 2,
      bgcolor: cfg.bg, border: `1px solid ${alpha(cfg.color, 0.3)}`,
    }}>
      <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: cfg.color, lineHeight: 1 }}>
        {Math.round(Number(heat) || 0)}
      </Typography>
      <Typography sx={{ fontSize: "0.7rem", lineHeight: 1, mt: 0.2 }}>{flames}</Typography>
    </Box>
  );
};

const SourceBadge = ({ source }) => {
  const cfg = SOURCE_CONFIG[source] || SOURCE_CONFIG.quiz;
  return (
    <Chip
      icon={<Iconify icon={cfg.icon} width={14} sx={{ color: `${cfg.color} !important` }} />}
      label={cfg.label}
      size="small"
      sx={{
        height: 22, fontSize: "0.7rem", fontWeight: 700,
        bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${alpha(cfg.color, 0.25)}`,
      }}
    />
  );
};

const VideoBadge = ({ video, source }) => {
  if (source === "quiz") return null;
  if (!video || video.status === "not_available") return null;
  if (video.status === "ended") {
    return <Tooltip title="Video finito"><Chip icon={<Iconify icon="mdi:check-circle" width={14} sx={{ color: "#2E7D32 !important" }} />} label="Video ✓" size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#E8F5E9", color: "#2E7D32" }} /></Tooltip>;
  }
  if (video.status === "started") {
    return <Tooltip title={`Video iniziato ${fuzzyDate(video.started_at)}`}><Chip icon={<Iconify icon="mdi:play-circle" width={14} sx={{ color: "#F57C00 !important" }} />} label="Video in corso" size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#FFF3E0", color: "#F57C00" }} /></Tooltip>;
  }
  return <Tooltip title="Non ha ancora visto il video"><Chip icon={<Iconify icon="mdi:pause-circle-outline" width={14} sx={{ color: "#757575 !important" }} />} label="No video" size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#F5F5F5", color: "#757575" }} /></Tooltip>;
};

const AppBadge = ({ app }) => {
  if (!app) return null;
  const hasIos = !!app.has_ios;
  const hasAndroid = !!app.has_android;
  const platform = app.platform || "unknown";
  const choice = app.scarica_app_choice;

  if (hasIos && hasAndroid) {
    return <Tooltip title="Ha installato iOS e Android"><Chip icon={<Iconify icon="mdi:cellphone" width={14} sx={{ color: "#6A1B9A !important" }} />} label="iOS + Android" size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#F3E5F5", color: "#6A1B9A" }} /></Tooltip>;
  }
  if (hasIos) {
    return <Tooltip title="Ha installato iOS"><Chip icon={<Iconify icon="mdi:apple" width={14} sx={{ color: "#4527A0 !important" }} />} label="iOS" size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#EDE7F6", color: "#4527A0" }} /></Tooltip>;
  }
  if (hasAndroid) {
    return <Tooltip title="Ha installato Android"><Chip icon={<Iconify icon="mdi:android" width={14} sx={{ color: "#2E7D32 !important" }} />} label="Android" size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#E8F5E9", color: "#2E7D32" }} /></Tooltip>;
  }
  if (platform === "web" || choice === "browser") {
    return <Tooltip title="Sta usando solo browser"><Chip icon={<Iconify icon="mdi:web" width={14} sx={{ color: "#616161 !important" }} />} label="Browser" size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#F5F5F5", color: "#616161" }} /></Tooltip>;
  }
  return null;
};

const LeadRow = ({ lead, promoterName, onOpen, onCopyEmail, onOpenWa }) => {
  const src = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG.quiz;
  const isQuiz = lead.source === "quiz";

  return (
    <Card
      sx={{
        p: { xs: 1.25, md: 1.75 },
        borderRadius: 2.5,
        border: "1px solid #f0ece6",
        transition: "all 0.15s",
        "&:hover": { boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderColor: alpha(ORO, 0.4) },
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ md: "center" }}>
        {/* Left: avatar + name + email + phone */}
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
          <Avatar
            sx={{
              bgcolor: alpha(src.color, 0.15), color: src.color,
              width: 42, height: 42, fontSize: "0.9rem", fontWeight: 800,
              border: `2px solid ${alpha(src.color, 0.3)}`,
            }}
          >
            {initials(lead.name, lead.email)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 0.5 }}>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mr: 0.5 }}>
                {lead.name || lead.email?.split("@")[0] || "—"}
              </Typography>
              <SourceBadge source={lead.source} />
              <VideoBadge video={lead.video} source={lead.source} />
              <AppBadge app={lead.app} />
            </Stack>
            <Typography sx={{ fontSize: "0.72rem", color: MUTED, mt: 0.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {lead.email}
              {lead.phone ? ` · ${lead.phone}` : ""}
            </Typography>
            <Typography sx={{ fontSize: "0.68rem", color: alpha(MUTED, 0.85), mt: 0.15 }}>
              Iscritto {fuzzyDate(lead.created_at)}
              {lead.last_seen_at ? ` · Ultima attivita ${fuzzyDate(lead.last_seen_at)}` : ""}
              {lead.sponsor_username ? ` · Sponsor @${lead.sponsor_username}` : ""}
            </Typography>
          </Box>
        </Stack>

        {/* Right: heat + actions */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
          <HeatPill heat={lead.heat} />
          <Stack direction="row" spacing={0.25}>
            <Tooltip title={lead.phone ? "WhatsApp diretto" : "WhatsApp"}>
              <IconButton
                size="small"
                onClick={() => onOpenWa?.(lead)}
              >
                <Iconify icon="mdi:whatsapp" width={20} sx={{ color: "#25D366" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copia email">
              <IconButton size="small" onClick={() => onCopyEmail?.(lead.email)}>
                <Iconify icon="mdi:email-outline" width={20} sx={{ color: ORO }} />
              </IconButton>
            </Tooltip>
            {isQuiz && (
              <Tooltip title="Dettaglio / Note">
                <IconButton size="small" onClick={() => onOpen?.(lead)}>
                  <Iconify icon="mdi:note-edit-outline" width={20} sx={{ color: ESPRESSO }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

const SummaryChip = ({ icon, label, count, color, bg, active, onClick }) => (
  <Chip
    onClick={onClick}
    label={
      <Stack direction="row" spacing={0.5} alignItems="center">
        <span style={{ fontSize: "0.9rem" }}>{icon}</span>
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, color }}>{count}</Typography>
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: alpha(color, 0.85) }}>{label}</Typography>
      </Stack>
    }
    sx={{
      height: 30, cursor: "pointer", px: 0.5,
      bgcolor: active ? bg : alpha(bg, 0.5),
      border: `1px solid ${active ? color : alpha(color, 0.3)}`,
      transition: "all 0.15s",
      "&:hover": { bgcolor: bg },
      "& .MuiChip-label": { px: 1 },
    }}
  />
);

// --- Detail modal (only for quiz leads: PATCH status + notes) ---

const LeadDetailModal = ({ open, onClose, lead, promoterUsername, onUpdate }) => {
  const [status, setStatus] = useState(lead?.status || "new");
  const [notes, setNotes] = useState(lead?.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const originalNotes = useRef(lead?.notes || "");

  useEffect(() => {
    setStatus(lead?.status || "new");
    setNotes(lead?.notes || "");
    originalNotes.current = lead?.notes || "";
  }, [lead?.id]);

  useEffect(() => {
    if (!lead || lead.source !== "quiz") return;
    if (notes === originalNotes.current) return;
    const t = setTimeout(async () => {
      setSavingNotes(true);
      try {
        const rawId = String(lead.id).replace(/^quiz-/, "");
        await axiosInstance.patch(`api/wp/promoter/me/leads/${rawId}`, { notes });
        originalNotes.current = notes;
        onUpdate?.({ ...lead, notes });
      } catch (e) { /* silent */ }
      setSavingNotes(false);
    }, 1500);
    return () => clearTimeout(t);
  }, [notes]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeStatus = async (newStatus) => {
    setStatus(newStatus);
    if (!lead || lead.source !== "quiz") return;
    try {
      const rawId = String(lead.id).replace(/^quiz-/, "");
      await axiosInstance.patch(`api/wp/promoter/me/leads/${rawId}`, { status: newStatus });
      onUpdate?.({ ...lead, status: newStatus });
    } catch (e) { /* silent */ }
  };

  if (!lead) return null;
  const isQuiz = lead.source === "quiz";

  const mailtoSubject = encodeURIComponent(`EVEA · ${isQuiz && lead.result_product ? `Il tuo rituale ${PRODUCT_LABELS[lead.result_product]}` : "Ciao da eVea"}`);
  const mailtoBody = encodeURIComponent(buildWaMessage(lead, promoterUsername));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: "1px solid #f0ece6", pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: "1.3rem", fontWeight: 700, color: ESPRESSO }}>
                {lead.name || lead.email}
              </Typography>
              <SourceBadge source={lead.source} />
            </Stack>
            <Typography sx={{ fontSize: "0.85rem", color: MUTED }}>{lead.email}</Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <HeatPill heat={lead.heat} />
            {isQuiz && (
              <TextField select size="small" value={status} onChange={(e) => changeStatus(e.target.value)}
                sx={{ minWidth: 140, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.8rem", fontWeight: 700 } }}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <MenuItem key={k} value={k} sx={{ fontSize: "0.8rem" }}>{v.it}</MenuItem>
                ))}
              </TextField>
            )}
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {isQuiz && (
            <>
              <Grid item xs={6} md={3}>
                <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>Prodotto</Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ORO }}>{PRODUCT_LABELS[lead.result_product] || "—"}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>Profilo</Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>{PROFILE_LABELS[lead.result_profile] || "—"}</Typography>
              </Grid>
            </>
          )}
          <Grid item xs={6} md={3}>
            <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>Iscritto</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO }}>
              {lead.created_at ? new Date(lead.created_at).toLocaleString("it-IT") : "—"}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>Ultima attivita</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO }}>
              {lead.last_seen_at ? fuzzyDate(lead.last_seen_at) : "—"}
            </Typography>
          </Grid>
          {lead.phone && (
            <Grid item xs={6} md={3}>
              <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>Telefono</Typography>
              <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO }}>{lead.phone}</Typography>
            </Grid>
          )}
          {lead.sponsor_username && (
            <Grid item xs={6} md={3}>
              <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>Sponsor</Typography>
              <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO }}>@{lead.sponsor_username}</Typography>
            </Grid>
          )}
        </Grid>

        {(lead.video || lead.app) && (
          <Box sx={{ mb: 3, p: 1.5, borderRadius: 2, bgcolor: "#FAF6EF", border: "1px solid #f0ece6" }}>
            <Typography sx={{ fontSize: "0.72rem", color: MUTED, textTransform: "uppercase", mb: 0.75, fontWeight: 700 }}>
              Attivita
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 0.75 }}>
              <VideoBadge video={lead.video} source={lead.source} />
              <AppBadge app={lead.app} />
            </Stack>
          </Box>
        )}

        {isQuiz && (
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO }}>Note personali</Typography>
              {savingNotes && <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Salvataggio…</Typography>}
            </Stack>
            <TextField multiline rows={4} fullWidth size="small" value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Aggiungi note sul lead, esito chiamata, prossimi step…"
              sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.85rem", bgcolor: "#FFF" } }} />
          </Box>
        )}

        <Stack direction="row" spacing={1.5}>
          <Button variant="contained" startIcon={<Iconify icon="mdi:whatsapp" />}
            href={waLink(lead.phone, buildWaMessage(lead, promoterUsername))} target="_blank" rel="noreferrer"
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

// --- Main ---

const MyLeads = () => {
  const [source, setSource] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("-heat");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [promoterUsername, setPromoterUsername] = useState("");
  const [snackbar, setSnackbar] = useState(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, source, sort]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: "25",
        source,
        sort,
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const { data: r } = await axiosInstance.get(`api/wp/promoter/me/leads/all?${params.toString()}`);
      setData(r?.data || []);
      setMeta(r?.meta || null);
    } catch (e) {
      // silent
    }
    setLoading(false);
  }, [page, source, sort, debouncedSearch]);

  useEffect(() => {
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/user/me");
        setPromoterUsername(r?.data?.username || r?.username || "");
      } catch { /* silent */ }
    })();
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((meta?.total || 0) / (meta?.per_page || 25))),
    [meta]
  );

  const byHeat = meta?.by_heat || { hot: 0, warm: 0, cold: 0 };
  const bySource = meta?.by_source || { quiz: 0, "landing-prodotto": 0, "landing-opportunita": 0 };

  const hotLeads = useMemo(() => data.filter((l) => heatBucket(l.heat) === "hot"), [data]);
  const showHotSection = page === 1 && hotLeads.length > 0 && sort === "-heat";
  const nonHotLeads = showHotSection ? data.filter((l) => heatBucket(l.heat) !== "hot") : data;

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      setSnackbar("Email copiata");
    } catch {
      setSnackbar("Copia non riuscita");
    }
  };

  const openWa = (lead) => {
    const url = waLink(lead.phone, buildWaMessage(lead, promoterUsername));
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Page title="I miei Lead">
      <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: ESPRESSO, mb: 0.5 }}>
          I miei Lead
        </Typography>
        <Typography sx={{ fontSize: "0.85rem", color: MUTED, mb: 2.5 }}>
          Lead da quiz, pagina prodotto e pagina opportunita — ordinati per priorita di chiamata
        </Typography>

        {/* Heat summary chips */}
        <Card sx={{ p: 1.5, mb: 1.5, borderRadius: 3, border: "1px solid #f0ece6" }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1, alignItems: "center" }}>
            <SummaryChip
              icon={HEAT_BUCKETS.hot.icon} label={HEAT_BUCKETS.hot.label}
              count={byHeat.hot || 0} color={HEAT_BUCKETS.hot.color} bg={HEAT_BUCKETS.hot.bg}
              active={sort === "-heat"} onClick={() => setSort("-heat")}
            />
            <SummaryChip
              icon={HEAT_BUCKETS.warm.icon} label={HEAT_BUCKETS.warm.label}
              count={byHeat.warm || 0} color={HEAT_BUCKETS.warm.color} bg={HEAT_BUCKETS.warm.bg}
              active={sort === "-heat"} onClick={() => setSort("-heat")}
            />
            <SummaryChip
              icon={HEAT_BUCKETS.cold.icon} label={HEAT_BUCKETS.cold.label}
              count={byHeat.cold || 0} color={HEAT_BUCKETS.cold.color} bg={HEAT_BUCKETS.cold.bg}
              active={sort === "-heat"} onClick={() => setSort("-heat")}
            />
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <SummaryChip
              icon="🧠" label="Quiz"
              count={bySource.quiz || 0} color={SOURCE_CONFIG.quiz.color} bg={SOURCE_CONFIG.quiz.bg}
              active={source === "quiz"} onClick={() => setSource(source === "quiz" ? "all" : "quiz")}
            />
            <SummaryChip
              icon="📦" label="Prodotto"
              count={bySource["landing-prodotto"] || 0} color={SOURCE_CONFIG["landing-prodotto"].color} bg={SOURCE_CONFIG["landing-prodotto"].bg}
              active={source === "landing-prodotto"} onClick={() => setSource(source === "landing-prodotto" ? "all" : "landing-prodotto")}
            />
            <SummaryChip
              icon="🚀" label="Opportunita"
              count={bySource["landing-opportunita"] || 0} color={SOURCE_CONFIG["landing-opportunita"].color} bg={SOURCE_CONFIG["landing-opportunita"].bg}
              active={source === "landing-opportunita"} onClick={() => setSource(source === "landing-opportunita" ? "all" : "landing-opportunita")}
            />
          </Stack>
        </Card>

        {/* Filters */}
        <Card sx={{ p: 1.5, mb: 2, borderRadius: 3, border: "1px solid #f0ece6" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.25}>
            <TextField
              size="small" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca nome / email / username…"
              InputProps={{ startAdornment: <Iconify icon="mdi:magnify" width={18} sx={{ color: MUTED, mr: 1 }} /> }}
              sx={{ flex: 1 }}
            />
            <TextField select size="small" value={source} onChange={(e) => setSource(e.target.value)} label="Fonte" sx={{ width: { md: 180 } }}>
              <MenuItem value="all">Tutte le fonti</MenuItem>
              <MenuItem value="quiz">Quiz</MenuItem>
              <MenuItem value="landing-prodotto">Landing Prodotto</MenuItem>
              <MenuItem value="landing-opportunita">Landing Opportunita</MenuItem>
            </TextField>
            <TextField select size="small" value={sort} onChange={(e) => setSort(e.target.value)} label="Ordinamento" sx={{ width: { md: 180 } }}>
              <MenuItem value="-heat">Piu caldi</MenuItem>
              <MenuItem value="heat">Meno caldi</MenuItem>
              <MenuItem value="-created_at">Piu recenti</MenuItem>
              <MenuItem value="created_at">Piu vecchi</MenuItem>
            </TextField>
          </Stack>
        </Card>

        {/* Hot leads section on top (only page 1, sorted by heat, and if any hot) */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}><CircularProgress sx={{ color: ORO }} /></Box>
        ) : data.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px dashed #E0DDD6" }}>
            <Iconify icon="mdi:account-search-outline" width={48} sx={{ color: alpha(ORO, 0.5), mb: 1 }} />
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: ESPRESSO, mb: 0.5 }}>
              Nessun lead per ora
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: MUTED, mb: 2 }}>
              Condividi il tuo link personale per iniziare a raccogliere lead.
            </Typography>
            {promoterUsername && (
              <Button
                variant="contained"
                startIcon={<Iconify icon="mdi:share-variant" />}
                onClick={() => {
                  const link = `https://myevea.com/scopri/${promoterUsername}`;
                  navigator.clipboard.writeText(link).then(() => setSnackbar("Link copiato"));
                }}
                sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, textTransform: "none", fontWeight: 700 }}
              >
                Copia il tuo link /scopri/{promoterUsername}
              </Button>
            )}
          </Card>
        ) : (
          <Stack spacing={1.25}>
            {showHotSection && (
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, pl: 0.5 }}>
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: HEAT_BUCKETS.hot.color, textTransform: "uppercase", letterSpacing: 1 }}>
                    🔥 Da chiamare oggi ({hotLeads.length})
                  </Typography>
                </Stack>
                <Box sx={{
                  p: 1, borderRadius: 3,
                  bgcolor: alpha(HEAT_BUCKETS.hot.color, 0.04),
                  border: `1px solid ${alpha(HEAT_BUCKETS.hot.color, 0.15)}`,
                }}>
                  <Stack spacing={1}>
                    {hotLeads.map((lead) => (
                      <LeadRow
                        key={lead.id}
                        lead={lead}
                        promoterName={promoterUsername}
                        onOpen={setSelected}
                        onCopyEmail={copyEmail}
                        onOpenWa={openWa}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            )}

            {nonHotLeads.length > 0 && (
              <Box>
                {showHotSection && (
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: 1, mb: 1, pl: 0.5 }}>
                    Altri lead ({nonHotLeads.length})
                  </Typography>
                )}
                <Stack spacing={1}>
                  {nonHotLeads.map((lead) => (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      promoterName={promoterUsername}
                      onOpen={setSelected}
                      onCopyEmail={copyEmail}
                      onOpenWa={openWa}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}

        {meta && meta.total > (meta.per_page || 25) && (
          <Stack direction="row" justifyContent="center" mt={3}>
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

        <Snackbar
          open={!!snackbar}
          autoHideDuration={2000}
          onClose={() => setSnackbar(null)}
          message={snackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Box>
    </Page>
  );
};

export default MyLeads;
