import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Button, Card, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid,
  IconButton, MenuItem, Stack, TextField, Typography, Tooltip, Pagination, Snackbar,
  Avatar, Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const STATUS_META = {
  new: { color: ORO },
  contacted: { color: "#2196F3" },
  in_progress: { color: "#9C27B0" },
  converted: { color: "#4CAF50" },
  lost: { color: "#9E9E9E" },
};

const PRODUCT_LABELS = {
  black: "Black", mocha: "Mocha", latte: "Latte", greentea: "Green Tea",
};

const PROFILE_LABELS = {
  cold: "Cold Curioso", warm: "Warm Decisore",
  coffeelover: "Coffee Lover", wellness: "Wellness Seeker",
};

// Status label helper (respects current i18n language via t function)
const statusLabel = (t, key) => t(`my_leads.status.${key}`, {
  new: "Nuovo", contacted: "Contattato", in_progress: "In trattativa",
  converted: "Convertito", lost: "Perso",
}[key] || key);

// Source config: static styling; label resolved via t()
const SOURCE_META = {
  quiz: { icon: "mdi:brain", color: "#1976D2", bg: "#E3F2FD" },
  "landing-prodotto": { icon: "mdi:package-variant", color: "#2E7D32", bg: "#E8F5E9" },
  "landing-opportunita": { icon: "mdi:rocket-launch", color: ORO, bg: alpha(ORO, 0.12) },
  manual: { icon: "mdi:account-plus", color: "#6A1B9A", bg: "#F3E5F5" },
};

const sourceLabel = (t, key) => t(`my_leads.source.${key}`, {
  quiz: "Quiz", "landing-prodotto": "Prodotto",
  "landing-opportunita": "Opportunita", manual: "Manuale",
}[key] || key);

const HEAT_BUCKETS = {
  hot: { min: 70, icon: "🔥", color: "#D32F2F", bg: "#FFEBEE" },
  warm: { min: 40, max: 69, icon: "☀️", color: "#F57C00", bg: "#FFF3E0" },
  cold: { max: 39, icon: "❄️", color: "#0277BD", bg: "#E1F5FE" },
};

const heatLabel = (t, key) => t(`my_leads.heat.${key}`, { hot: "caldi", warm: "tiepidi", cold: "freddi" }[key] || key);

// WhatsApp templates: keys point to i18n; each locale has full text with {{name}} and {{promoter}} placeholders.
const buildWaMessage = (t, lead, promoterName) => {
  const macro = (p) => (p === "warm" || p === "coffeelover" ? "warm" : "cold");
  if (lead.source === "quiz") {
    const key = `${macro(lead.result_profile)}_${lead.result_product || "mocha"}`;
    return t(`my_leads.template.${key}`, "", { name: lead.name || "", promoter: promoterName || "" });
  }
  if (lead.source === "manual") {
    return t("my_leads.template.manual", "Ciao {{name}}! Sono {{promoter}} di eVea. Volevo salutarti dopo il nostro incontro{{whereMetSuffix}} e se ti fa piacere raccontarti qualcosa in più sui nostri prodotti / opportunità.", {
      name: lead.name || "",
      promoter: promoterName || "",
      whereMetSuffix: lead.where_met ? ` a ${lead.where_met}` : "",
    });
  }
  const vs = lead.video?.status || "not_started";
  const key = `${lead.source}_${vs}`;
  return t(`my_leads.template.${key}`, "", { name: lead.name || "", promoter: promoterName || "" });
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

const fuzzyDate = (t, iso) => {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "—";
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (min < 1) return t("my_leads.fuzzy.now", "adesso");
  if (min < 60) return t("my_leads.fuzzy.min_ago", "{{n}} min fa", { n: min });
  const hrs = Math.round(min / 60);
  if (hrs < 24) return t("my_leads.fuzzy.hours_ago", "{{n}}h fa", { n: hrs });
  const days = Math.round(hrs / 24);
  if (days < 30) return t("my_leads.fuzzy.days_ago_short", "{{n}}g fa", { n: days });
  const months = Math.round(days / 30);
  if (months < 12) return t("my_leads.fuzzy.months_ago", "{{n}} mesi fa", { n: months });
  return new Date(iso).toLocaleDateString();
};

const isToday = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
};

const isPast = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return d.getTime() < t.getTime();
};

const heatBucket = (heat) => {
  const n = Number(heat) || 0;
  if (n >= HEAT_BUCKETS.hot.min) return "hot";
  if (n >= HEAT_BUCKETS.warm.min) return "warm";
  return "cold";
};

// Spiega perché il heat è quello (dai fattori del backend computeHeatForGuest)
const heatExplain = (t, lead) => {
  const factors = [];
  const vs = lead.video?.status;
  if (vs === "ended") factors.push({ pts: 40, txt: t("my_leads.heat_factor.video_ended", "Ha finito il video (+40)") });
  else if (vs === "started") factors.push({ pts: 15, txt: t("my_leads.heat_factor.video_started", "Ha iniziato il video (+15)") });
  const app = lead.app || {};
  if (app.has_ios || app.has_android) factors.push({ pts: 30, txt: t("my_leads.heat_factor.app_installed", "Ha l'app installata (+30)") });
  if (["ios", "android"].includes(app.scarica_app_choice)) factors.push({ pts: 15, txt: t("my_leads.heat_factor.chose_app", "Ha scelto di scaricare l'app (+15)") });
  else if (app.scarica_app_choice === "browser") factors.push({ pts: 5, txt: t("my_leads.heat_factor.chose_browser", "Ha scelto browser (+5)") });
  if (lead.last_seen_at) {
    const days = (Date.now() - new Date(lead.last_seen_at).getTime()) / 86400000;
    if (days <= 7) factors.push({ pts: 20, txt: t("my_leads.heat_factor.active_7d", "Attivo negli ultimi 7 giorni (+20)") });
  }
  if (lead.created_at) {
    const days = (Date.now() - new Date(lead.created_at).getTime()) / 86400000;
    if (days <= 3) factors.push({ pts: 10, txt: t("my_leads.heat_factor.new_3d", "Iscritto negli ultimi 3 giorni (+10)") });
  }
  return factors;
};

// --- Sub-components ---

const HeatPill = ({ heat, lead }) => {
  const { t } = useTranslation();
  const bucket = heatBucket(heat);
  const cfg = HEAT_BUCKETS[bucket];
  const flames = bucket === "hot" ? "🔥🔥🔥" : bucket === "warm" ? "🔥🔥" : "🔥";
  const factors = lead ? heatExplain(t, lead) : [];
  const bucketAdj = t(`my_leads.heat_adj.${bucket}`, { hot: "caldo", warm: "tiepido", cold: "freddo" }[bucket] || bucket);
  const tooltip = factors.length > 0
    ? (<Box><Typography sx={{ fontSize: "0.72rem", fontWeight: 700, mb: 0.5 }}>{t("my_leads.heat_why", "Perché è {{adj}} ({{score}}):", { adj: bucketAdj, score: Math.round(heat) })}</Typography>{factors.map((f, i) => <Typography key={i} sx={{ fontSize: "0.7rem" }}>{f.txt}</Typography>)}</Box>)
    : "";
  return (
    <Tooltip title={tooltip} arrow>
      <Box sx={{
        display: "inline-flex", flexDirection: "column", alignItems: "center",
        minWidth: 52, px: 1, py: 0.5, borderRadius: 2, cursor: "help",
        bgcolor: cfg.bg, border: `1px solid ${alpha(cfg.color, 0.3)}`,
      }}>
        <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: cfg.color, lineHeight: 1 }}>
          {Math.round(Number(heat) || 0)}
        </Typography>
        <Typography sx={{ fontSize: "0.7rem", lineHeight: 1, mt: 0.2 }}>{flames}</Typography>
      </Box>
    </Tooltip>
  );
};

const SourceBadge = ({ source }) => {
  const { t } = useTranslation();
  const cfg = SOURCE_META[source] || SOURCE_META.quiz;
  return (
    <Chip
      icon={<Iconify icon={cfg.icon} width={14} sx={{ color: `${cfg.color} !important` }} />}
      label={sourceLabel(t, source)}
      size="small"
      sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700, bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${alpha(cfg.color, 0.25)}` }}
    />
  );
};

const StatusChip = ({ status }) => {
  const { t } = useTranslation();
  const key = status && STATUS_META[status] ? status : "new";
  const cfg = STATUS_META[key];
  return <Chip label={statusLabel(t, key)} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: alpha(cfg.color, 0.14), color: cfg.color }} />;
};

const VideoBadge = ({ video, source }) => {
  const { t } = useTranslation();
  if (source === "quiz" || !video || video.status === "not_available") return null;
  if (video.status === "ended") return <Tooltip title={t("my_leads.video.finished_tooltip", "Video finito")}><Chip icon={<Iconify icon="mdi:check-circle" width={14} sx={{ color: "#2E7D32 !important" }} />} label={t("my_leads.video.finished_label", "Video ✓")} size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#E8F5E9", color: "#2E7D32" }} /></Tooltip>;
  if (video.status === "started") return <Tooltip title={t("my_leads.video.started_tooltip", "Video iniziato {{when}}", { when: fuzzyDate(t, video.started_at) })}><Chip icon={<Iconify icon="mdi:play-circle" width={14} sx={{ color: "#F57C00 !important" }} />} label={t("my_leads.video.in_progress", "Video in corso")} size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#FFF3E0", color: "#F57C00" }} /></Tooltip>;
  return <Tooltip title={t("my_leads.video.no_video_tooltip", "Non ha ancora visto il video")}><Chip icon={<Iconify icon="mdi:pause-circle-outline" width={14} sx={{ color: "#757575 !important" }} />} label={t("my_leads.video.no_video_label", "No video")} size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#F5F5F5", color: "#757575" }} /></Tooltip>;
};

const AppBadge = ({ app }) => {
  const { t } = useTranslation();
  if (!app) return null;
  if (app.has_ios && app.has_android) return <Chip icon={<Iconify icon="mdi:cellphone" width={14} sx={{ color: "#6A1B9A !important" }} />} label="iOS + Android" size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#F3E5F5", color: "#6A1B9A" }} />;
  if (app.has_ios) return <Chip icon={<Iconify icon="mdi:apple" width={14} sx={{ color: "#4527A0 !important" }} />} label="iOS" size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#EDE7F6", color: "#4527A0" }} />;
  if (app.has_android) return <Chip icon={<Iconify icon="mdi:android" width={14} sx={{ color: "#2E7D32 !important" }} />} label="Android" size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#E8F5E9", color: "#2E7D32" }} />;
  if (app.platform === "web" || app.scarica_app_choice === "browser") return <Chip icon={<Iconify icon="mdi:web" width={14} sx={{ color: "#616161 !important" }} />} label={t("my_leads.badge.browser", "Browser")} size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#F5F5F5", color: "#616161" }} />;
  return null;
};

const LeadRow = ({ lead, onOpen, onCopyEmail, onOpenWa, onDelete }) => {
  const { t } = useTranslation();
  const src = SOURCE_META[lead.source] || SOURCE_META.quiz;
  const hasFollowUpToday = isToday(lead.follow_up_at);
  const hasFollowUpPast = isPast(lead.follow_up_at) && lead.status !== "converted" && lead.status !== "lost";

  return (
    <Card sx={{
      p: { xs: 1.25, md: 1.5 }, borderRadius: 2.5,
      border: hasFollowUpPast ? `1px solid ${alpha("#D32F2F", 0.35)}` : "1px solid #f0ece6",
      bgcolor: hasFollowUpPast ? alpha("#D32F2F", 0.02) : "#fff",
      transition: "all 0.15s",
      "&:hover": { boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderColor: alpha(ORO, 0.4) },
    }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ md: "center" }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
          <Avatar sx={{ bgcolor: alpha(src.color, 0.15), color: src.color, width: 42, height: 42, fontSize: "0.9rem", fontWeight: 800, border: `2px solid ${alpha(src.color, 0.3)}` }}>
            {initials(lead.name, lead.email)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 0.5 }}>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mr: 0.5 }}>
                {lead.name || lead.email?.split("@")[0] || "—"}
              </Typography>
              <SourceBadge source={lead.source} />
              <StatusChip status={lead.status || "new"} />
              <VideoBadge video={lead.video} source={lead.source} />
              <AppBadge app={lead.app} />
              {hasFollowUpToday && (
                <Chip label={t("my_leads.chip.today", "📅 Oggi")} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: "#FFF3E0", color: "#F57C00" }} />
              )}
              {hasFollowUpPast && (
                <Chip label={t("my_leads.chip.overdue", "⚠️ Ritardo")} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: "#FFEBEE", color: "#D32F2F" }} />
              )}
              {lead.duplicates && lead.duplicates.length > 0 && (
                <Tooltip title={t("my_leads.duplicates_tooltip", "Stesso contatto anche in altre {{n}} fonti", { n: lead.duplicates.length })}>
                  <Chip icon={<Iconify icon="mdi:link-variant" width={11} sx={{ color: "#F57C00 !important" }} />} label={`+${lead.duplicates.length}`} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: "#FFF3E0", color: "#F57C00" }} />
                </Tooltip>
              )}
            </Stack>
            <Typography sx={{ fontSize: "0.72rem", color: MUTED, mt: 0.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {lead.email}{lead.phone ? ` · ${lead.phone}` : ""}
            </Typography>
            <Typography sx={{ fontSize: "0.68rem", color: alpha(MUTED, 0.85), mt: 0.15 }}>
              {t("my_leads.registered_prefix", "Iscritto")} {fuzzyDate(t, lead.created_at)}
              {lead.contacted_at ? ` · ${t("my_leads.contacted_prefix", "Contattato")} ${fuzzyDate(t, lead.contacted_at)}` : ""}
              {lead.follow_up_at && !hasFollowUpPast && !hasFollowUpToday ? ` · ${t("my_leads.recontact_prefix", "Ricontatta")} ${new Date(lead.follow_up_at).toLocaleDateString()}` : ""}
              {lead.notes ? ` · ${t("my_leads.notes_marker", "📝 Note")}` : ""}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
          <HeatPill heat={lead.heat} lead={lead} />
          <Stack direction="row" spacing={0.25}>
            {lead.phone && (
              <Tooltip title={t("my_leads.tooltip.call", "Chiama")}>
                <IconButton size="small" href={`tel:${normalizePhone(lead.phone)}`}>
                  <Iconify icon="mdi:phone" width={20} sx={{ color: "#4CAF50" }} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={lead.phone ? t("my_leads.tooltip.whatsapp_direct", "WhatsApp diretto") : t("my_leads.tooltip.whatsapp", "WhatsApp")}>
              <IconButton size="small" onClick={() => onOpenWa?.(lead)}>
                <Iconify icon="mdi:whatsapp" width={20} sx={{ color: "#25D366" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("my_leads.tooltip.copy_email", "Copia email")}>
              <IconButton size="small" onClick={() => onCopyEmail?.(lead.email)}>
                <Iconify icon="mdi:email-outline" width={20} sx={{ color: ORO }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("my_leads.tooltip.detail_notes", "Dettaglio / Note")}>
              <IconButton size="small" onClick={() => onOpen?.(lead)}>
                <Iconify icon="mdi:note-edit-outline" width={20} sx={{ color: ESPRESSO }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={lead.source === "manual" ? t("my_leads.tooltip.delete_lead", "Cancella lead") : t("my_leads.tooltip.hide_lead", "Nascondi lead (segna come perso)")}>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete?.(lead); }}>
                <Iconify icon="mdi:close" width={18} sx={{ color: alpha("#D32F2F", 0.7) }} />
              </IconButton>
            </Tooltip>
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
    sx={{ height: 30, cursor: "pointer", px: 0.5, bgcolor: active ? bg : alpha(bg, 0.5), border: `1px solid ${active ? color : alpha(color, 0.3)}`, transition: "all 0.15s", "&:hover": { bgcolor: bg }, "& .MuiChip-label": { px: 1 } }}
  />
);

const StatsBar = ({ stats }) => {
  const { t } = useTranslation();
  if (!stats) return null;
  const items = [
    { label: t("my_leads.stats.month", "Lead mese"), value: stats.month?.total_leads ?? 0, color: ORO, icon: "mdi:account-multiple" },
    { label: t("my_leads.stats.contacted", "Contattati"), value: stats.contacted ?? 0, color: "#2196F3", icon: "mdi:phone" },
    { label: t("my_leads.stats.converted", "Convertiti"), value: stats.converted ?? 0, color: "#4CAF50", icon: "mdi:trophy" },
    { label: t("my_leads.stats.conversion", "CONVERSION"), value: `${stats.conversion_rate ?? 0}%`, color: "#9C27B0", icon: "mdi:chart-line" },
    { label: t("my_leads.stats.follow_up_today", "FOLLOW-UP OGGI"), value: stats.today_follow_ups ?? 0, color: "#F57C00", icon: "mdi:bell-ring" },
  ];
  return (
    <Card sx={{ p: 1.5, mb: 1.5, borderRadius: 3, border: "1px solid #f0ece6" }}>
      <Grid container spacing={1}>
        {items.map((it) => (
          <Grid item xs={6} sm={2.4} key={it.label}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1, borderRadius: 2, bgcolor: alpha(it.color, 0.05), border: `1px solid ${alpha(it.color, 0.15)}`, height: "100%" }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha(it.color, 0.15), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Iconify icon={it.icon} width={18} sx={{ color: it.color }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: ESPRESSO, lineHeight: 1 }}>{it.value}</Typography>
                <Typography sx={{ fontSize: "0.65rem", color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{it.label}</Typography>
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>
      {stats.best_source && (
        <Typography sx={{ fontSize: "0.72rem", color: MUTED, mt: 1, textAlign: "center" }}>
          {t("my_leads.best_source_prefix", "🏆 Fonte con più conversioni:")} <strong style={{ color: ESPRESSO }}>{sourceLabel(t, stats.best_source) || stats.best_source}</strong>
        </Typography>
      )}
    </Card>
  );
};

// --- Detail modal (con note+status+follow-up per TUTTI i lead) ---

const LeadDetailModal = ({ open, onClose, lead, promoterUsername, onUpdate, notify }) => {
  const { t } = useTranslation();
  const ACTIVITY_LABELS = {
    created: { icon: "mdi:account-plus", color: ORO, label: (d) => t("my_leads.activity.created", "Lead creato{{suffix}}", { suffix: d?.where_met ? ` (${d.where_met})` : "" }) },
    status_changed: { icon: "mdi:swap-horizontal", color: "#2196F3", label: (d) => t("my_leads.activity.status_changed", "Stato: {{from}} → {{to}}", { from: statusLabel(t, d?.from), to: statusLabel(t, d?.to) }) },
    note_updated: { icon: "mdi:note-edit", color: "#9C27B0", label: () => t("my_leads.activity.note_updated", "Note aggiornate") },
    followup_set: { icon: "mdi:calendar-plus", color: "#F57C00", label: (d) => t("my_leads.activity.followup_set", "Follow-up impostato per {{date}}", { date: d?.date ? new Date(d.date).toLocaleDateString() : "—" }) },
    followup_cleared: { icon: "mdi:calendar-remove", color: "#757575", label: () => t("my_leads.activity.followup_cleared", "Follow-up rimosso") },
    contacted: { icon: "mdi:phone-check", color: "#4CAF50", label: () => t("my_leads.activity.contacted", "Contattato") },
  };
  const [status, setStatus] = useState(lead?.status || "new");
  const [notes, setNotes] = useState(lead?.notes || "");
  const [followUpAt, setFollowUpAt] = useState(lead?.follow_up_at || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const originalNotes = useRef(lead?.notes || "");
  const originalFollowUp = useRef(lead?.follow_up_at || "");

  useEffect(() => {
    setStatus(lead?.status || "new");
    setNotes(lead?.notes || "");
    setFollowUpAt(lead?.follow_up_at ? new Date(lead.follow_up_at).toISOString().split("T")[0] : "");
    originalNotes.current = lead?.notes || "";
    originalFollowUp.current = lead?.follow_up_at || "";
  }, [lead?.id]);

  const patch = useCallback(async (payload, opts = {}) => {
    if (!lead) return false;
    try {
      await axiosInstance.patch(`api/wp/promoter/me/leads/${lead.id}`, payload);
      onUpdate?.({ ...lead, ...payload });
      if (opts.silent !== true) notify?.(t("my_leads.toast.saved", "Salvato ✓"), "success");
      return true;
    } catch (e) {
      const msg = e?.response?.data?.message || t("my_leads.toast.save_error", "Errore salvataggio");
      notify?.(msg, "error");
      return false;
    }
  }, [lead, onUpdate, notify]);

  // Timeline attività
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  useEffect(() => {
    if (!open || !lead) return;
    let cancelled = false;
    (async () => {
      setLoadingActivity(true);
      try {
        const { data: r } = await axiosInstance.get(`api/wp/promoter/me/leads/${lead.id}/activity`);
        if (!cancelled) setActivity(r?.data || []);
      } catch { if (!cancelled) setActivity([]); }
      setLoadingActivity(false);
    })();
    return () => { cancelled = true; };
  }, [open, lead?.id]);

  const flushNotes = useCallback(async () => {
    if (!lead) return;
    if (notes === originalNotes.current) return;
    setSavingNotes(true);
    const ok = await patch({ notes });
    if (ok) {
      originalNotes.current = notes;
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 1200);
    }
    setSavingNotes(false);
  }, [lead, notes, patch]);

  useEffect(() => {
    if (!lead) return;
    if (notes === originalNotes.current) return;
    const t = setTimeout(() => { flushNotes(); }, 800);
    return () => clearTimeout(t);
  }, [notes]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeStatus = async (newStatus) => {
    setStatus(newStatus);
    await patch({ status: newStatus });
  };

  const saveFollowUp = async () => {
    const ok = await patch(followUpAt ? { follow_up_at: followUpAt } : { clear_follow_up: true });
    if (ok) originalFollowUp.current = followUpAt;
  };

  const closeAndFlush = async () => {
    if (notes !== originalNotes.current) {
      await flushNotes();
    }
    onClose?.();
  };

  if (!lead) return null;
  const isQuiz = lead.source === "quiz";
  const mailtoSubject = encodeURIComponent(`EVEA · ${isQuiz && lead.result_product ? t("my_leads.mail.subject_ritual", "Il tuo rituale {{product}}", { product: PRODUCT_LABELS[lead.result_product] }) : t("my_leads.mail.subject_hello", "Ciao da eVea")}`);
  const mailtoBody = encodeURIComponent(buildWaMessage(t, lead, promoterUsername));

  return (
    <Dialog open={open} onClose={closeAndFlush} maxWidth="md" fullWidth>
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
            <HeatPill heat={lead.heat} lead={lead} />
            <TextField select size="small" value={status} onChange={(e) => changeStatus(e.target.value)} sx={{ minWidth: 140, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.8rem", fontWeight: 700 } }}>
              {Object.keys(STATUS_META).map((k) => (
                <MenuItem key={k} value={k} sx={{ fontSize: "0.8rem" }}>{statusLabel(t, k)}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {isQuiz && (
            <>
              <Grid item xs={6} md={3}>
                <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>{t("my_leads.detail.product", "Prodotto")}</Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ORO }}>{PRODUCT_LABELS[lead.result_product] || "—"}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>{t("my_leads.detail.profile", "Profilo")}</Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>{PROFILE_LABELS[lead.result_profile] || "—"}</Typography>
              </Grid>
            </>
          )}
          <Grid item xs={6} md={3}>
            <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>{t("my_leads.detail.registered", "Iscritto")}</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO }}>{lead.created_at ? new Date(lead.created_at).toLocaleString() : "—"}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>{t("my_leads.detail.last_activity", "Ultima attività")}</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO }}>{lead.last_seen_at ? fuzzyDate(t, lead.last_seen_at) : "—"}</Typography>
          </Grid>
          {lead.phone && (
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>{t("my_leads.detail.phone", "Telefono")}</Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO, fontWeight: 600 }}>{lead.phone}</Typography>
                <Tooltip title={t("my_leads.tooltip.call", "Chiama")}>
                  <IconButton size="small" href={`tel:${normalizePhone(lead.phone)}`} sx={{ color: "#4CAF50" }}>
                    <Iconify icon="mdi:phone" width={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("my_leads.tooltip.copy_number", "Copia numero")}>
                  <IconButton size="small" onClick={() => { navigator.clipboard.writeText(lead.phone); notify?.(t("my_leads.toast.number_copied", "Numero copiato")); }} sx={{ color: MUTED }}>
                    <Iconify icon="mdi:content-copy" width={16} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          )}
          {lead.email && (
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>{t("my_leads.detail.email_click_copy", "Email — click per copiare")}</Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO, fontWeight: 600, wordBreak: "break-all" }}>{lead.email}</Typography>
                <Tooltip title={t("my_leads.tooltip.copy_email", "Copia email")}>
                  <IconButton size="small" onClick={() => { navigator.clipboard.writeText(lead.email); notify?.(t("my_leads.toast.email_copied", "Email copiata")); }} sx={{ color: MUTED }}>
                    <Iconify icon="mdi:content-copy" width={16} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          )}
          {lead.where_met && (
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>{t("my_leads.detail.where_met", "Dove ci siamo incontrati")}</Typography>
              <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO }}>{lead.where_met}</Typography>
            </Grid>
          )}
          {lead.duplicates && lead.duplicates.length > 0 && (
            <Grid item xs={12}>
              <Chip icon={<Iconify icon="mdi:link-variant" width={14} />} label={t("my_leads.detail.same_contact_sources", "Stesso contatto in {{n}} altra fonte", { n: lead.duplicates.length, count: lead.duplicates.length })} size="small" sx={{ bgcolor: "#FFF3E0", color: "#F57C00", fontWeight: 700, fontSize: "0.7rem" }} />
            </Grid>
          )}
          {lead.contacted_at && (
            <Grid item xs={6} md={3}>
              <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase" }}>{t("my_leads.detail.contacted", "Contattato")}</Typography>
              <Typography sx={{ fontSize: "0.85rem", color: ESPRESSO }}>{fuzzyDate(t, lead.contacted_at)}</Typography>
            </Grid>
          )}
        </Grid>

        {/* Follow-up scheduler */}
        <Card sx={{ p: 1.5, mb: 2, borderRadius: 2, bgcolor: "#FFF8E1", border: "1px solid #F9A825" }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Iconify icon="mdi:calendar-clock" width={18} sx={{ color: "#F57C00" }} />
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO }}>{t("my_leads.detail.next_followup", "Prossimo follow-up")}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField type="date" size="small" value={followUpAt} onChange={(e) => setFollowUpAt(e.target.value)} sx={{ flex: 1 }} InputLabelProps={{ shrink: true }} />
            <Button variant="contained" size="small" onClick={saveFollowUp} sx={{ bgcolor: "#F57C00", "&:hover": { bgcolor: "#E65100" }, textTransform: "none", fontWeight: 700 }}>
              {t("my_leads.button.save", "Salva")}
            </Button>
            {lead.follow_up_at && (
              <Button variant="outlined" size="small" onClick={() => { setFollowUpAt(""); patch({ clear_follow_up: true }); }} sx={{ textTransform: "none" }}>
                {t("my_leads.button.remove", "Rimuovi")}
              </Button>
            )}
          </Stack>
        </Card>

        {(lead.video || lead.app) && (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, bgcolor: "#FAF6EF", border: "1px solid #f0ece6" }}>
            <Typography sx={{ fontSize: "0.72rem", color: MUTED, textTransform: "uppercase", mb: 0.75, fontWeight: 700 }}>{t("my_leads.detail.activity", "Attività")}</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 0.75 }}>
              <VideoBadge video={lead.video} source={lead.source} />
              <AppBadge app={lead.app} />
            </Stack>
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO }}>{t("my_leads.detail.personal_notes", "Note personali")}</Typography>
            {savingNotes && <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>{t("my_leads.detail.saving", "Salvataggio…")}</Typography>}
            {savedTick && !savingNotes && <Typography sx={{ fontSize: "0.7rem", color: "#4CAF50", fontWeight: 700 }}>{t("my_leads.detail.saved_check", "✓ Salvato")}</Typography>}
          </Stack>
          <TextField multiline rows={4} fullWidth size="small" value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={flushNotes} placeholder={t("my_leads.detail.notes_placeholder", "Aggiungi note sul lead, esito chiamata, prossimi step…")} sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.85rem", bgcolor: "#FFF" } }} />
        </Box>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ rowGap: 1 }}>
          <Button variant="contained" startIcon={<Iconify icon="mdi:whatsapp" />}
            href={waLink(lead.phone, buildWaMessage(t, lead, promoterUsername))} target="_blank" rel="noreferrer"
            onClick={async () => { if ((lead.status || "new") === "new") await patch({ status: "contacted" }, { silent: true }); }}
            sx={{ bgcolor: "#25D366", "&:hover": { bgcolor: "#1ebe5d" }, textTransform: "none", fontWeight: 700 }}>
            {t("my_leads.button.whatsapp", "WhatsApp")}
          </Button>
          {lead.phone && (
            <Button variant="contained" startIcon={<Iconify icon="mdi:phone" />}
              href={`tel:${normalizePhone(lead.phone)}`}
              onClick={async () => { if ((lead.status || "new") === "new") await patch({ status: "contacted" }, { silent: true }); }}
              sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" }, textTransform: "none", fontWeight: 700 }}>
              {t("my_leads.button.call", "Chiama")}
            </Button>
          )}
          <Button variant="outlined" startIcon={<Iconify icon="mdi:email-outline" />}
            href={`mailto:${lead.email}?subject=${mailtoSubject}&body=${mailtoBody}`}
            sx={{ borderColor: ORO, color: ORO, textTransform: "none" }}>
            {t("my_leads.button.email", "Email")}
          </Button>
        </Stack>

        {/* Timeline attivita' */}
        <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #f0ece6" }}>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.6, mb: 1.5 }}>
            {t("my_leads.detail.timeline", "📜 Timeline")}
          </Typography>
          {loadingActivity ? (
            <Typography sx={{ fontSize: "0.8rem", color: MUTED }}>{t("my_leads.detail.loading", "Caricamento…")}</Typography>
          ) : activity.length === 0 ? (
            <Typography sx={{ fontSize: "0.8rem", color: MUTED, fontStyle: "italic" }}>{t("my_leads.detail.no_activity", "Nessuna attività registrata (le azioni future compariranno qui).")}</Typography>
          ) : (
            <Stack spacing={0.75}>
              {activity.map((a) => {
                const cfg = ACTIVITY_LABELS[a.event_type] || { icon: "mdi:circle-small", color: MUTED, label: () => a.event_type };
                return (
                  <Stack key={a.id} direction="row" spacing={1} alignItems="center" sx={{ p: 0.75, borderRadius: 1.5, bgcolor: alpha(cfg.color, 0.05), border: `1px solid ${alpha(cfg.color, 0.15)}` }}>
                    <Box sx={{ width: 24, height: 24, borderRadius: 12, bgcolor: alpha(cfg.color, 0.15), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Iconify icon={cfg.icon} width={14} sx={{ color: cfg.color }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: "0.78rem", color: ESPRESSO, fontWeight: 600 }}>{cfg.label(a.event_data)}</Typography>
                      <Typography sx={{ fontSize: "0.68rem", color: MUTED }}>{fuzzyDate(t, a.created_at)}</Typography>
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// --- Add Manual Lead Modal ---

const AddLeadModal = ({ open, onClose, onCreated, notify }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", where_met: "", notes: "", follow_up_at: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm({ name: "", email: "", phone: "", where_met: "", notes: "", follow_up_at: "" });
  }, [open]);

  const submit = async () => {
    if (!form.name.trim()) { notify?.(t("my_leads.add.name_required", "Il nome è obbligatorio")); return; }
    setSaving(true);
    try {
      const payload = {};
      Object.entries(form).forEach(([k, v]) => { if (v !== "") payload[k] = v; });
      const { data: r } = await axiosInstance.post("api/wp/promoter/me/leads/manual", payload);
      notify?.(t("my_leads.add.added_ok", "Lead aggiunto ✓"));
      onCreated?.(r?.data);
      onClose?.();
    } catch (e) {
      const msg = e?.response?.data?.message || t("my_leads.add.create_error", "Errore creazione lead");
      notify?.(msg);
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: "1px solid #f0ece6" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="mdi:account-plus" width={22} sx={{ color: "#6A1B9A" }} />
          <Typography sx={{ fontSize: "1.15rem", fontWeight: 700, color: ESPRESSO }}>{t("my_leads.add.title", "Aggiungi lead manuale")}</Typography>
        </Stack>
        <Typography sx={{ fontSize: "0.8rem", color: MUTED, mt: 0.5 }}>{t("my_leads.add.subtitle", "Persona incontrata a un evento, chiacchierata, contatto informale.")}</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField autoFocus label={t("my_leads.add.name_label", "Nome e cognome *")} fullWidth size="small" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={t("my_leads.add.phone_label", "Telefono")} fullWidth size="small" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+39..." />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={t("my_leads.add.email_label", "Email")} fullWidth size="small" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
          </Grid>
          <Grid item xs={12}>
            <TextField label={t("my_leads.add.where_met_label", "Dove vi siete incontrati")} fullWidth size="small" value={form.where_met} onChange={(e) => setForm({ ...form, where_met: e.target.value })} placeholder={t("my_leads.add.where_met_placeholder", "Evento X, palestra, bar…")} />
          </Grid>
          <Grid item xs={12}>
            <TextField label={t("my_leads.add.notes_label", "Note (facoltative)")} fullWidth multiline rows={3} size="small" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={t("my_leads.add.notes_placeholder", "Interessato a…, ha figli, va in palestra, ha detto che…")} />
          </Grid>
          <Grid item xs={12}>
            <TextField label={t("my_leads.add.followup_label", "Prossimo follow-up")} type="date" fullWidth size="small" value={form.follow_up_at} onChange={(e) => setForm({ ...form, follow_up_at: e.target.value })} InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: MUTED }}>{t("my_leads.button.cancel", "Annulla")}</Button>
        <Button variant="contained" onClick={submit} disabled={saving || !form.name.trim()} sx={{ bgcolor: "#6A1B9A", "&:hover": { bgcolor: "#4A148C" }, textTransform: "none", fontWeight: 700 }}>
          {saving ? t("my_leads.button.saving", "Salvo…") : t("my_leads.button.add_lead", "Aggiungi lead")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// --- Kanban view ---

const KANBAN_COLS = [
  { key: "new", labelKey: "my_leads.kanban.new", labelFallback: "Nuovi", color: ORO, bg: alpha(ORO, 0.08) },
  { key: "contacted", labelKey: "my_leads.kanban.contacted", labelFallback: "Contattati", color: "#2196F3", bg: alpha("#2196F3", 0.08) },
  { key: "in_progress", labelKey: "my_leads.kanban.in_progress", labelFallback: "In trattativa", color: "#9C27B0", bg: alpha("#9C27B0", 0.08) },
  { key: "converted", labelKey: "my_leads.kanban.converted", labelFallback: "Convertiti", color: "#4CAF50", bg: alpha("#4CAF50", 0.08) },
];

const KanbanCard = ({ lead, onOpen }) => {
  const { t } = useTranslation();
  const src = SOURCE_META[lead.source] || SOURCE_META.quiz;
  const hasFollowUpToday = isToday(lead.follow_up_at);
  const hasFollowUpPast = isPast(lead.follow_up_at) && lead.status !== "converted" && lead.status !== "lost";
  return (
    <Card onClick={() => onOpen?.(lead)} sx={{
      p: 1.25, borderRadius: 2, cursor: "pointer",
      border: hasFollowUpPast ? `1px solid ${alpha("#D32F2F", 0.4)}` : "1px solid #f0ece6",
      "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)", transform: "translateY(-1px)" },
      transition: "all 0.15s",
    }}>
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Avatar sx={{ bgcolor: alpha(src.color, 0.15), color: src.color, width: 28, height: 28, fontSize: "0.7rem", fontWeight: 800 }}>
            {initials(lead.name, lead.email)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: ESPRESSO, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {lead.name || lead.email?.split("@")[0] || "—"}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>{sourceLabel(t, lead.source)}</Typography>
          </Box>
          <Box sx={{ px: 0.75, py: 0.15, borderRadius: 1, bgcolor: alpha(HEAT_BUCKETS[heatBucket(lead.heat)].color, 0.15), color: HEAT_BUCKETS[heatBucket(lead.heat)].color, fontSize: "0.7rem", fontWeight: 800 }}>
            {Math.round(Number(lead.heat) || 0)}
          </Box>
        </Stack>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ rowGap: 0.4 }}>
          {hasFollowUpToday && <Chip label={t("my_leads.chip.today", "📅 Oggi")} size="small" sx={{ height: 18, fontSize: "0.6rem", fontWeight: 700, bgcolor: "#FFF3E0", color: "#F57C00" }} />}
          {hasFollowUpPast && <Chip label="⚠️" size="small" sx={{ height: 18, fontSize: "0.6rem", fontWeight: 700, bgcolor: "#FFEBEE", color: "#D32F2F" }} />}
          {lead.phone && <Chip icon={<Iconify icon="mdi:phone" width={10} sx={{ color: "#4CAF50 !important" }} />} label={t("my_leads.kanban.tel", "tel")} size="small" sx={{ height: 18, fontSize: "0.6rem", bgcolor: alpha("#4CAF50", 0.1), color: "#4CAF50" }} />}
          {lead.video?.status === "ended" && <Chip label="🎥✓" size="small" sx={{ height: 18, fontSize: "0.6rem", bgcolor: "#E8F5E9", color: "#2E7D32" }} />}
        </Stack>
      </Stack>
    </Card>
  );
};

const KanbanView = ({ leads, onOpen }) => {
  const { t } = useTranslation();
  const byStatus = useMemo(() => {
    const g = { new: [], contacted: [], in_progress: [], converted: [] };
    leads.forEach((l) => {
      const s = l.status || "new";
      if (g[s]) g[s].push(l);
    });
    return g;
  }, [leads]);

  return (
    <Grid container spacing={1.5}>
      {KANBAN_COLS.map((col) => (
        <Grid item xs={12} sm={6} md={3} key={col.key}>
          <Box sx={{ borderRadius: 3, bgcolor: col.bg, border: `1px solid ${alpha(col.color, 0.2)}`, p: 1, minHeight: 200 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, px: 0.5 }}>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: col.color, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {t(col.labelKey, col.labelFallback)}
              </Typography>
              <Chip label={byStatus[col.key].length} size="small" sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700, bgcolor: alpha(col.color, 0.2), color: col.color }} />
            </Stack>
            <Stack spacing={0.75}>
              {byStatus[col.key].length === 0 ? (
                <Typography sx={{ fontSize: "0.72rem", color: MUTED, textAlign: "center", py: 2, fontStyle: "italic" }}>{t("my_leads.kanban.empty", "Nessun lead")}</Typography>
              ) : (
                byStatus[col.key].map((l) => <KanbanCard key={l.id} lead={l} onOpen={onOpen} />)
              )}
            </Stack>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

// --- Main ---

const MyLeads = () => {
  const { t } = useTranslation();
  const [source, setSource] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("-heat");
  const [quickFilter, setQuickFilter] = useState("all"); // all|with_phone|not_contacted|video_ended
  const [view, setView] = useState("list"); // list|kanban
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [promoterUsername, setPromoterUsername] = useState("");
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, source, sort, quickFilter]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "50", source, sort });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const { data: r } = await axiosInstance.get(`api/wp/promoter/me/leads/all?${params.toString()}`);
      setData(r?.data || []);
      setMeta(r?.meta || null);
    } catch (e) { /* silent */ }
    setLoading(false);
  }, [page, source, sort, debouncedSearch]);

  const fetchStats = useCallback(async () => {
    try {
      const { data: r } = await axiosInstance.get("api/wp/promoter/me/leads/stats");
      setStats(r?.data || null);
    } catch (e) { /* silent */ }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/user/me");
        setPromoterUsername(r?.data?.username || r?.username || "");
      } catch { /* silent */ }
    })();
  }, []);

  useEffect(() => { fetchData(); fetchStats(); }, [fetchData, fetchStats]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil((meta?.total || 0) / (meta?.per_page || 50))), [meta]);

  // Apply quick filters client-side (over already loaded page)
  const [showLost, setShowLost] = useState(false);
  const filteredData = useMemo(() => {
    let d = showLost ? data : data.filter((l) => l.status !== "lost");
    if (quickFilter === "all") return d;
    return d.filter((l) => {
      if (quickFilter === "with_phone") return !!l.phone;
      if (quickFilter === "not_contacted") return !l.status || l.status === "new";
      if (quickFilter === "video_ended") return l.video?.status === "ended";
      return true;
    });
  }, [data, quickFilter, showLost]);

  // Follow-up sections
  const followUpToday = useMemo(() => filteredData.filter((l) => isToday(l.follow_up_at) && l.status !== "converted" && l.status !== "lost"), [filteredData]);
  const followUpOverdue = useMemo(() => filteredData.filter((l) => isPast(l.follow_up_at) && !isToday(l.follow_up_at) && l.status !== "converted" && l.status !== "lost"), [filteredData]);
  const hotLeads = useMemo(() => filteredData.filter((l) => heatBucket(l.heat) === "hot" && !isToday(l.follow_up_at) && !isPast(l.follow_up_at)), [filteredData]);
  const showHotSection = page === 1 && hotLeads.length > 0 && sort === "-heat";
  const excludeIds = new Set([...followUpToday.map(l => l.id), ...followUpOverdue.map(l => l.id), ...(showHotSection ? hotLeads.map(l => l.id) : [])]);
  const restLeads = filteredData.filter((l) => !excludeIds.has(l.id));

  const byHeat = meta?.by_heat || { hot: 0, warm: 0, cold: 0 };
  const bySource = meta?.by_source || { quiz: 0, "landing-prodotto": 0, "landing-opportunita": 0 };

  const copyEmail = async (email) => {
    try { await navigator.clipboard.writeText(email); setSnackbar(t("my_leads.toast.email_copied", "Email copiata")); }
    catch { setSnackbar(t("my_leads.toast.copy_failed", "Copia non riuscita")); }
  };

  const openWa = async (lead) => {
    const url = waLink(lead.phone, buildWaMessage(t, lead, promoterUsername));
    window.open(url, "_blank", "noopener,noreferrer");
    // Auto-status: se non ancora contattato, marca come "contacted"
    if (!lead.status || lead.status === "new") {
      try {
        await axiosInstance.patch(`api/wp/promoter/me/leads/${lead.id}`, { status: "contacted" });
        setData((d) => d.map((x) => x.id === lead.id ? { ...x, status: "contacted", contacted_at: new Date().toISOString() } : x));
        fetchStats();
      } catch (e) { /* silent */ }
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const doDelete = async (lead) => {
    try {
      if (lead.source === "manual") {
        await axiosInstance.delete(`api/wp/promoter/me/leads/${lead.id}`);
        setSnackbar(t("my_leads.toast.lead_deleted", "Lead cancellato"));
      } else {
        await axiosInstance.patch(`api/wp/promoter/me/leads/${lead.id}`, { status: "lost" });
        setSnackbar(t("my_leads.toast.lead_hidden", "Lead nascosto (segnato come perso)"));
      }
      setData((d) => d.filter((x) => x.id !== lead.id));
      fetchStats();
    } catch (e) {
      const msg = e?.response?.data?.message || t("my_leads.toast.delete_error", "Errore cancellazione");
      setSnackbar(msg);
    }
    setDeleteConfirm(null);
  };

  const exportCsv = () => {
    if (filteredData.length === 0) { setSnackbar(t("my_leads.toast.nothing_to_export", "Nessun lead da esportare")); return; }
    const headers = [
      t("my_leads.csv.name", "Nome"),
      t("my_leads.csv.email", "Email"),
      t("my_leads.csv.phone", "Telefono"),
      t("my_leads.csv.source", "Fonte"),
      t("my_leads.csv.heat", "Heat"),
      t("my_leads.csv.status", "Stato"),
      t("my_leads.csv.video", "Video"),
      t("my_leads.csv.app", "App"),
      t("my_leads.csv.registered", "Iscritto"),
      t("my_leads.csv.last_activity", "Ultima attività"),
      t("my_leads.csv.contacted", "Contattato"),
      t("my_leads.csv.followup", "Follow-up"),
      t("my_leads.csv.notes", "Note"),
    ];
    const rows = filteredData.map((l) => [
      l.name || "",
      l.email || "",
      l.phone || "",
      sourceLabel(t, l.source) || l.source,
      l.heat ?? "",
      statusLabel(t, l.status || "new"),
      l.video?.status || "",
      l.app?.platform || "",
      l.created_at ? new Date(l.created_at).toLocaleString() : "",
      l.last_seen_at ? new Date(l.last_seen_at).toLocaleString() : "",
      l.contacted_at ? new Date(l.contacted_at).toLocaleString() : "",
      l.follow_up_at ? new Date(l.follow_up_at).toLocaleDateString() : "",
      (l.notes || "").replace(/"/g, '""'),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evea-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSnackbar(t("my_leads.toast.exported", "Esportati {{n}} lead", { n: filteredData.length }));
  };

  return (
    <Page title={t("my_leads.title", "I miei Lead")}>
      <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: ESPRESSO }}>{t("my_leads.title", "I miei Lead")}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack direction="row" sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #E0DDD6" }}>
              <Button size="small" onClick={() => setView("list")} sx={{ textTransform: "none", minWidth: 0, px: 1.25, py: 0.5, borderRadius: 0, bgcolor: view === "list" ? alpha(ORO, 0.15) : "transparent", color: view === "list" ? ORO : MUTED, fontWeight: 700 }}>
                <Iconify icon="mdi:format-list-bulleted" width={16} sx={{ mr: 0.5 }} /> {t("my_leads.view.list", "Lista")}
              </Button>
              <Button size="small" onClick={() => setView("kanban")} sx={{ textTransform: "none", minWidth: 0, px: 1.25, py: 0.5, borderRadius: 0, bgcolor: view === "kanban" ? alpha(ORO, 0.15) : "transparent", color: view === "kanban" ? ORO : MUTED, fontWeight: 700 }}>
                <Iconify icon="mdi:view-column" width={16} sx={{ mr: 0.5 }} /> {t("my_leads.view.kanban", "Kanban")}
              </Button>
            </Stack>
            <Button size="small" variant="contained" startIcon={<Iconify icon="mdi:account-plus" />} onClick={() => setAddOpen(true)} sx={{ bgcolor: "#6A1B9A", "&:hover": { bgcolor: "#4A148C" }, textTransform: "none", fontWeight: 700 }}>
              {t("my_leads.button.add_lead", "Aggiungi lead")}
            </Button>
            <Button size="small" startIcon={<Iconify icon="mdi:download" />} onClick={exportCsv} sx={{ textTransform: "none", color: MUTED }}>
              {t("my_leads.button.csv", "CSV")}
            </Button>
          </Stack>
        </Stack>
        <Typography sx={{ fontSize: "0.85rem", color: MUTED, mb: 2.5 }}>
          {t("my_leads.subtitle", "Lead da quiz, pagina prodotto e pagina opportunità — ordinati per priorità di chiamata")}
        </Typography>

        <StatsBar stats={stats} />

        <Card sx={{ p: 1.5, mb: 1.5, borderRadius: 3, border: "1px solid #f0ece6" }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1, alignItems: "center" }}>
            <SummaryChip icon={HEAT_BUCKETS.hot.icon} label={heatLabel(t, "hot")} count={byHeat.hot || 0} color={HEAT_BUCKETS.hot.color} bg={HEAT_BUCKETS.hot.bg} active={sort === "-heat"} onClick={() => setSort("-heat")} />
            <SummaryChip icon={HEAT_BUCKETS.warm.icon} label={heatLabel(t, "warm")} count={byHeat.warm || 0} color={HEAT_BUCKETS.warm.color} bg={HEAT_BUCKETS.warm.bg} active={sort === "-heat"} onClick={() => setSort("-heat")} />
            <SummaryChip icon={HEAT_BUCKETS.cold.icon} label={heatLabel(t, "cold")} count={byHeat.cold || 0} color={HEAT_BUCKETS.cold.color} bg={HEAT_BUCKETS.cold.bg} active={sort === "-heat"} onClick={() => setSort("-heat")} />
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <SummaryChip icon="🧠" label={sourceLabel(t, "quiz")} count={bySource.quiz || 0} color={SOURCE_META.quiz.color} bg={SOURCE_META.quiz.bg} active={source === "quiz"} onClick={() => setSource(source === "quiz" ? "all" : "quiz")} />
            <SummaryChip icon="📦" label={sourceLabel(t, "landing-prodotto")} count={bySource["landing-prodotto"] || 0} color={SOURCE_META["landing-prodotto"].color} bg={SOURCE_META["landing-prodotto"].bg} active={source === "landing-prodotto"} onClick={() => setSource(source === "landing-prodotto" ? "all" : "landing-prodotto")} />
            <SummaryChip icon="🚀" label={t("my_leads.source_full.landing_opportunita", "Opportunità")} count={bySource["landing-opportunita"] || 0} color={SOURCE_META["landing-opportunita"].color} bg={SOURCE_META["landing-opportunita"].bg} active={source === "landing-opportunita"} onClick={() => setSource(source === "landing-opportunita" ? "all" : "landing-opportunita")} />
            {(bySource.manual || 0) > 0 && (
              <SummaryChip icon="✍️" label={t("my_leads.source_plural.manual", "Manuali")} count={bySource.manual} color={SOURCE_META.manual.color} bg={SOURCE_META.manual.bg} active={source === "manual"} onClick={() => setSource(source === "manual" ? "all" : "manual")} />
            )}
          </Stack>
        </Card>

        <Card sx={{ p: 1.5, mb: 1.5, borderRadius: 3, border: "1px solid #f0ece6" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.25}>
            <TextField size="small" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("my_leads.search_placeholder", "Cerca nome / email / telefono / note…")} InputProps={{ startAdornment: <Iconify icon="mdi:magnify" width={18} sx={{ color: MUTED, mr: 1 }} /> }} sx={{ flex: 1 }} />
            <TextField select size="small" value={sort} onChange={(e) => setSort(e.target.value)} label={t("my_leads.sort.label", "Ordina per")} sx={{ width: { md: 220 } }}>
              <MenuItem value="-heat">{t("my_leads.sort.hottest", "🔥 Più caldi")}</MenuItem>
              <MenuItem value="follow_up_at">{t("my_leads.sort.next_followup", "📞 Prossimi follow-up")}</MenuItem>
              <MenuItem value="-created_at">{t("my_leads.sort.newest", "🕒 Più recenti")}</MenuItem>
              <MenuItem value="created_at">{t("my_leads.sort.oldest", "Più vecchi")}</MenuItem>
            </TextField>
            {source !== "all" && (
              <Button size="small" variant="text" onClick={() => setSource("all")} startIcon={<Iconify icon="mdi:close-circle" width={16} />} sx={{ textTransform: "none", color: MUTED }}>
                {t("my_leads.show_all_sources", "Mostra tutte le fonti")}
              </Button>
            )}
          </Stack>
          {/* Quick filters */}
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", rowGap: 0.75 }}>
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED, alignSelf: "center", mr: 0.5 }}>{t("my_leads.quick_filters", "Filtri veloci:")}</Typography>
            {[
              { k: "all", l: t("my_leads.filter.all", "Tutti") },
              { k: "with_phone", l: t("my_leads.filter.with_phone", "📞 Con telefono") },
              { k: "not_contacted", l: t("my_leads.filter.not_contacted", "⏳ Da contattare") },
              { k: "video_ended", l: t("my_leads.filter.video_ended", "🎥 Video finito") },
            ].map((f) => (
              <Chip key={f.k} label={f.l} size="small" onClick={() => setQuickFilter(f.k)}
                sx={{ cursor: "pointer", fontWeight: 600, fontSize: "0.7rem", bgcolor: quickFilter === f.k ? alpha(ORO, 0.15) : "#f5f5f5", color: quickFilter === f.k ? ORO : MUTED, border: quickFilter === f.k ? `1px solid ${alpha(ORO, 0.4)}` : "1px solid transparent" }} />
            ))}
            <Chip label={showLost ? t("my_leads.filter.lost_visible", "👁 Persi visibili") : t("my_leads.filter.show_lost", "🚫 Mostra persi")} size="small" onClick={() => setShowLost(!showLost)}
              sx={{ cursor: "pointer", fontWeight: 600, fontSize: "0.7rem", bgcolor: showLost ? alpha("#D32F2F", 0.15) : "#f5f5f5", color: showLost ? "#D32F2F" : MUTED, border: showLost ? `1px solid ${alpha("#D32F2F", 0.4)}` : "1px solid transparent" }} />
          </Stack>
        </Card>

        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}><CircularProgress sx={{ color: ORO }} /></Box>
        ) : view === "kanban" ? (
          <KanbanView leads={filteredData} onOpen={setSelected} />
        ) : data.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px dashed #E0DDD6" }}>
            <Iconify icon="mdi:account-search-outline" width={48} sx={{ color: alpha(ORO, 0.5), mb: 1 }} />
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: ESPRESSO, mb: 0.5 }}>{t("my_leads.empty.title", "Nessun lead per ora")}</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: MUTED, mb: 2 }}>{t("my_leads.empty.subtitle", "Condividi il tuo link personale per iniziare a raccogliere lead.")}</Typography>
            {promoterUsername && (
              <Button variant="contained" startIcon={<Iconify icon="mdi:share-variant" />}
                onClick={() => { const link = `https://myevea.com/scopri/${promoterUsername}`; navigator.clipboard.writeText(link).then(() => setSnackbar(t("my_leads.toast.link_copied", "Link copiato"))); }}
                sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, textTransform: "none", fontWeight: 700 }}>
                {t("my_leads.empty.copy_link", "Copia il tuo link /scopri/{{username}}", { username: promoterUsername })}
              </Button>
            )}
          </Card>
        ) : (
          <Stack spacing={1.25}>
            {/* Overdue follow-ups */}
            {followUpOverdue.length > 0 && (
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, pl: 0.5 }}>
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: "#D32F2F", textTransform: "uppercase", letterSpacing: 1 }}>
                    {t("my_leads.section.overdue", "⚠️ Follow-up in ritardo ({{n}})", { n: followUpOverdue.length })}
                  </Typography>
                </Stack>
                <Box sx={{ p: 1, borderRadius: 3, bgcolor: alpha("#D32F2F", 0.04), border: `1px solid ${alpha("#D32F2F", 0.15)}` }}>
                  <Stack spacing={1}>
                    {followUpOverdue.map((l) => <LeadRow key={l.id} lead={l} onOpen={setSelected} onCopyEmail={copyEmail} onOpenWa={openWa} onDelete={setDeleteConfirm} />)}
                  </Stack>
                </Box>
              </Box>
            )}

            {/* Today follow-ups */}
            {followUpToday.length > 0 && (
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, pl: 0.5 }}>
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: "#F57C00", textTransform: "uppercase", letterSpacing: 1 }}>
                    {t("my_leads.section.today", "📅 Follow-up di oggi ({{n}})", { n: followUpToday.length })}
                  </Typography>
                </Stack>
                <Box sx={{ p: 1, borderRadius: 3, bgcolor: alpha("#F57C00", 0.04), border: `1px solid ${alpha("#F57C00", 0.15)}` }}>
                  <Stack spacing={1}>
                    {followUpToday.map((l) => <LeadRow key={l.id} lead={l} onOpen={setSelected} onCopyEmail={copyEmail} onOpenWa={openWa} onDelete={setDeleteConfirm} />)}
                  </Stack>
                </Box>
              </Box>
            )}

            {/* Hot leads */}
            {showHotSection && (
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, pl: 0.5 }}>
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: HEAT_BUCKETS.hot.color, textTransform: "uppercase", letterSpacing: 1 }}>
                    {t("my_leads.section.hot", "🔥 Da chiamare oggi ({{n}})", { n: hotLeads.length })}
                  </Typography>
                </Stack>
                <Box sx={{ p: 1, borderRadius: 3, bgcolor: alpha(HEAT_BUCKETS.hot.color, 0.04), border: `1px solid ${alpha(HEAT_BUCKETS.hot.color, 0.15)}` }}>
                  <Stack spacing={1}>
                    {hotLeads.map((l) => <LeadRow key={l.id} lead={l} onOpen={setSelected} onCopyEmail={copyEmail} onOpenWa={openWa} onDelete={setDeleteConfirm} />)}
                  </Stack>
                </Box>
              </Box>
            )}

            {/* Rest */}
            {restLeads.length > 0 && (
              <Box>
                {(followUpOverdue.length > 0 || followUpToday.length > 0 || showHotSection) && (
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: 1, mb: 1, pl: 0.5 }}>
                    {t("my_leads.section.other", "Altri lead ({{n}})", { n: restLeads.length })}
                  </Typography>
                )}
                <Stack spacing={1}>
                  {restLeads.map((l) => <LeadRow key={l.id} lead={l} onOpen={setSelected} onCopyEmail={copyEmail} onOpenWa={openWa} onDelete={setDeleteConfirm} />)}
                </Stack>
              </Box>
            )}
          </Stack>
        )}

        {meta && meta.total > (meta.per_page || 50) && (
          <Stack direction="row" justifyContent="center" mt={3}>
            <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
          </Stack>
        )}

        <LeadDetailModal
          open={!!selected}
          onClose={() => setSelected(null)}
          lead={selected}
          promoterUsername={promoterUsername}
          notify={(msg) => setSnackbar(msg)}
          onUpdate={(updated) => {
            setData((d) => d.map((l) => (l.id === updated.id ? { ...l, ...updated } : l)));
            setSelected(updated);
            fetchStats();
          }}
        />

        <AddLeadModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          notify={(msg) => setSnackbar(msg)}
          onCreated={() => { fetchData(); fetchStats(); }}
        />

        <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, color: ESPRESSO }}>
            {deleteConfirm?.source === "manual" ? t("my_leads.delete_dialog.title_manual", "Cancellare lead manuale?") : t("my_leads.delete_dialog.title_hide", "Nascondere lead?")}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ fontSize: "0.9rem", color: MUTED }}>
              {deleteConfirm?.source === "manual" ? (
                <>{t("my_leads.delete_dialog.body_manual_prefix", "Il lead")} <strong>{deleteConfirm?.name || deleteConfirm?.email}</strong> {t("my_leads.delete_dialog.body_manual_suffix", "verrà cancellato definitivamente insieme a note e follow-up. Non recuperabile.")}</>
              ) : (
                <>{t("my_leads.delete_dialog.body_hide_prefix", "Il lead")} <strong>{deleteConfirm?.name || deleteConfirm?.email}</strong> {t("my_leads.delete_dialog.body_hide_suffix", "verrà segnato come \"perso\" e nascosto dalla lista. Puoi rivederlo attivando \"Mostra persi\".")}</>
              )}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteConfirm(null)} sx={{ textTransform: "none", color: MUTED }}>{t("my_leads.button.cancel", "Annulla")}</Button>
            <Button variant="contained" onClick={() => doDelete(deleteConfirm)} sx={{ bgcolor: "#D32F2F", "&:hover": { bgcolor: "#B71C1C" }, textTransform: "none", fontWeight: 700 }}>
              {deleteConfirm?.source === "manual" ? t("my_leads.button.delete", "Cancella") : t("my_leads.button.hide", "Nascondi")}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={!!snackbar} autoHideDuration={2000} onClose={() => setSnackbar(null)} message={snackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />
      </Box>
    </Page>
  );
};

export default MyLeads;
