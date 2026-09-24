import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar, Box, Button, Card, Chip, CircularProgress, Divider,
  Grid, IconButton, Snackbar, Stack, Tooltip, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const RISK_LABEL_META = {
  cancellation_scheduled: { key: "smartship_report.risk_cancellation_scheduled", fallback: "🔴 Cancellazione programmata", color: "#D32F2F" },
  card_expiring: { key: "smartship_report.risk_card_expiring", fallback: "Carta scade <30g", color: "#F57C00" },
  app_inactive: { key: "smartship_report.risk_app_inactive", fallback: "Non apre app 30+g", color: "#9C27B0" },
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

const fuzzyDate = (iso, t) => {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  if (isNaN(d)) return "—";
  const diff = Date.now() - d;
  const days = Math.round(diff / 86400000);
  if (days === 0) return t ? t("smartship_report.today", "oggi") : "oggi";
  if (days === 1) return t ? t("smartship_report.yesterday", "ieri") : "ieri";
  if (days < 30) return t ? t("smartship_report.days_ago", "{{n}}g fa", { n: days }) : `${days}g fa`;
  const m = Math.round(days / 30);
  if (m < 12) return t ? t("smartship_report.months_ago", "{{n}} mesi fa", { n: m }) : `${m} mesi fa`;
  return new Date(iso).toLocaleDateString("it-IT");
};

const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString("it-IT") : "—";
const daysUntil = (iso) => {
  if (!iso) return null;
  const d = new Date(iso).getTime();
  if (isNaN(d)) return null;
  return Math.ceil((d - Date.now()) / 86400000);
};

// WA templates (i18n)
const cancelledTemplate = (reason, name, product, t) => {
  const r = (reason || "").toLowerCase();
  if (r.includes("articoli") || r.includes("prodott") || r.includes("gusto")) {
    return t("smartship_report.wa_cancelled_product", "Ciao {{name}}! Ho visto che hai fermato lo SmartShip. Il prodotto ({{product}}) non ti convinceva? Posso aiutarti a scegliere il rituale più adatto — abbiamo Black, Latte, Mocha e Green Tea, uno diverso può fare la differenza. Ti va se ci sentiamo 5 min?", { name, product: product || "" });
  }
  if (r.includes("caro") || r.includes("prezzo") || r.includes("costa")) {
    return t("smartship_report.wa_cancelled_price", "Ciao {{name}}! Capisco che il prezzo può pesare in questo periodo. Se vuoi possiamo pensare a un piano diverso (magari 1 busta invece di più) così mantieni comunque lo sconto SmartShip senza impegnarti troppo. Che ne dici?", { name });
  }
  if (r.includes("tempo") || r.includes("uso") || r.includes("consumo")) {
    return t("smartship_report.wa_cancelled_time", "Ciao {{name}}! Se non riesci a consumarlo, possiamo dilazionare la spedizione (ogni 2 mesi invece che 1). Così hai sempre lo sconto SmartShip senza accumulo. Ti va se lo sistemiamo insieme?", { name });
  }
  return t("smartship_report.wa_cancelled_generic", "Ciao {{name}}! Ho visto che hai fermato lo SmartShip. Posso capire se c'è qualcosa che non ha funzionato? Se il prodotto non era quello giusto per te lo cambiamo, e ti mantengo lo sconto fedeltà. Ci sentiamo?", { name });
};
const pausedTemplate = (name, t) => t("smartship_report.wa_paused", "Ciao {{name}}! Ho visto che hai messo in pausa lo SmartShip. Se serve possiamo trovare insieme un ritmo diverso — anche 1 busta ogni 2 mesi. Fammi sapere!", { name });
const activateTemplate = (name, promoterName, t) => t("smartship_report.wa_activate", "Ciao {{name}}! Sono {{promoter}} di eVea. Se ti va possiamo attivare lo SmartShip: risparmi il 10% ogni mese e riceviamo il caffè a casa senza pensarci. Ti spiego in 2 min?", { name, promoter: promoterName || "" });

// Card lead
const UserRow = ({ member, badges, footer, actions, accentColor = "#f0ece6" }) => (
  <Card sx={{ p: 1.25, borderRadius: 2, border: `1px solid ${accentColor}`, bgcolor: "#fff", "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" } }}>
    <Stack direction={{ xs: "column", md: "row" }} spacing={1.25} alignItems={{ md: "center" }}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
        <Avatar src={member.profile_pic} sx={{ bgcolor: alpha(ORO, 0.15), color: ORO, width: 40, height: 40, fontSize: "0.85rem", fontWeight: 800 }}>
          {initials(member.display_name, member.email)}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" sx={{ rowGap: 0.4 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>{member.display_name || member.username}</Typography>
            {member.is_promoter && <Chip label="Promoter" size="small" sx={{ height: 18, fontSize: "0.62rem", fontWeight: 700, bgcolor: alpha(ORO, 0.12), color: ORO }} />}
            {badges}
          </Stack>
          {footer}
        </Box>
      </Stack>
      <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
        {actions}
      </Stack>
    </Stack>
  </Card>
);

const KpiTile = ({ label, value, color, icon, sub }) => (
  <Card sx={{ p: 1.5, borderRadius: 2.5, border: `1px solid ${alpha(color, 0.2)}`, bgcolor: alpha(color, 0.04), height: "100%" }}>
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(color, 0.15), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Iconify icon={icon} width={22} sx={{ color }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: ESPRESSO, lineHeight: 1 }}>{value}</Typography>
        <Typography sx={{ fontSize: "0.68rem", color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</Typography>
        {sub && <Typography sx={{ fontSize: "0.68rem", color: MUTED, mt: 0.2 }}>{sub}</Typography>}
      </Box>
    </Stack>
  </Card>
);

const SectionHeader = ({ icon, title, count, color, subtitle }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
    <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: alpha(color, 0.15), display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Iconify icon={icon} width={16} sx={{ color }} />
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: ESPRESSO }}>{title} <Box component="span" sx={{ color, ml: 0.5 }}>({count})</Box></Typography>
      {subtitle && <Typography sx={{ fontSize: "0.72rem", color: MUTED }}>{subtitle}</Typography>}
    </Box>
  </Stack>
);

const SmartshipReport = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoterName, setPromoterName] = useState("");
  const [snackbar, setSnackbar] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: r } = await axiosInstance.get("api/wp/promoter/me/smartship-report");
      setData(r?.data || null);
    } catch (e) { setSnackbar(t("smartship_report.load_error", "Errore caricamento report")); }
    setLoading(false);
  }, [t]);

  useEffect(() => {
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/user/me");
        const u = r?.data || r;
        setPromoterName(u?.username || "");
      } catch {}
    })();
    fetchData();
  }, [fetchData]);

  const logContact = useCallback(async (userId, channel) => {
    try {
      await axiosInstance.post("api/wp/promoter/me/smartship-report/contact-log", { user_id: userId, channel });
    } catch {}
  }, []);

  const stats = data?.stats;
  const s = data?.sections;
  const timeline = data?.timeline || [];

  const renderCancelledActions = (m) => (
    <>
      <Tooltip title={t("smartship_report.tooltip_wa_precompiled", "WhatsApp con messaggio pre-compilato")}>
        <IconButton size="small" onClick={() => logContact(m.user_id, "whatsapp")}
          href={waLink(m.phone, cancelledTemplate(m.reason, m.display_name, m.product, t))} target="_blank" rel="noreferrer">
          <Iconify icon="mdi:whatsapp" width={22} sx={{ color: "#25D366" }} />
        </IconButton>
      </Tooltip>
      {m.phone && (
        <Tooltip title={t("smartship_report.tooltip_call", "Chiama")}>
          <IconButton size="small" href={`tel:${normalizePhone(m.phone)}`} onClick={() => logContact(m.user_id, "call")}>
            <Iconify icon="mdi:phone" width={22} sx={{ color: "#4CAF50" }} />
          </IconButton>
        </Tooltip>
      )}
      {m.email && (
        <Tooltip title={t("smartship_report.tooltip_email", "Email")}>
          <IconButton size="small" href={`mailto:${m.email}`} onClick={() => logContact(m.user_id, "email")}>
            <Iconify icon="mdi:email-outline" width={22} sx={{ color: ORO }} />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  const renderActivateActions = (m) => (
    <>
      <Tooltip title={t("smartship_report.tooltip_wa_propose", "Proponi SmartShip via WhatsApp")}>
        <IconButton size="small" onClick={() => logContact(m.user_id, "whatsapp")}
          href={waLink(m.phone, activateTemplate(m.display_name, promoterName, t))} target="_blank" rel="noreferrer">
          <Iconify icon="mdi:whatsapp" width={22} sx={{ color: "#25D366" }} />
        </IconButton>
      </Tooltip>
      {m.phone && (
        <Tooltip title={t("smartship_report.tooltip_call", "Chiama")}>
          <IconButton size="small" href={`tel:${normalizePhone(m.phone)}`}>
            <Iconify icon="mdi:phone" width={22} sx={{ color: "#4CAF50" }} />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  const renderNeutralActions = (m) => (
    <>
      {m.phone && (
        <Tooltip title={t("smartship_report.tooltip_call", "Chiama")}>
          <IconButton size="small" href={`tel:${normalizePhone(m.phone)}`}>
            <Iconify icon="mdi:phone" width={22} sx={{ color: "#4CAF50" }} />
          </IconButton>
        </Tooltip>
      )}
      {m.email && (
        <Tooltip title={t("smartship_report.tooltip_copy_email", "Copia email")}>
          <IconButton size="small" onClick={() => { navigator.clipboard.writeText(m.email); setSnackbar(t("smartship_report.email_copied", "Email copiata")); }}>
            <Iconify icon="mdi:content-copy" width={20} sx={{ color: MUTED }} />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  return (
    <Page title={t("smartship_report.page_title", "Report SmartShip")}>
      <Box sx={{ px: { xs: 2, md: 3 }, py: 3, bgcolor: "#FAF6EF", minHeight: "100vh" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: ESPRESSO }}>{t("smartship_report.header_title", "Report SmartShip Team")}</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: MUTED }}>{t("smartship_report.header_subtitle", "Chi ha attivato, cancellato, pausato — con azioni pronte per contattarli")}</Typography>
          </Box>
          <Button size="small" startIcon={<Iconify icon="mdi:refresh" />} onClick={fetchData} sx={{ textTransform: "none", color: MUTED }}>
            {t("smartship_report.refresh", "Aggiorna")}
          </Button>
        </Stack>
        {data?.synced_at && (
          <Typography sx={{ fontSize: "0.7rem", color: MUTED, mb: 2 }}>{t("smartship_report.last_seal_sync", "Ultimo sync Seal:")} {fuzzyDate(data.synced_at, t)}</Typography>
        )}

        {loading ? (
          <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress sx={{ color: ORO }} /></Box>
        ) : !data ? (
          <Typography sx={{ color: MUTED }}>{t("smartship_report.no_data_available", "Nessun dato disponibile")}</Typography>
        ) : (
          <>
            {/* KPI */}
            <Grid container spacing={1.5} mb={2}>
              <Grid item xs={6} md={2.4}><KpiTile icon="mdi:check-circle" label={t("smartship_report.kpi_active", "Attivi")} value={stats.active} color="#4CAF50" /></Grid>
              <Grid item xs={6} md={2.4}><KpiTile icon="mdi:close-circle" label={t("smartship_report.kpi_cancelled_30d", "Cancellati 30gg")} value={stats.cancelled_30d} color="#D32F2F" /></Grid>
              <Grid item xs={6} md={2.4}><KpiTile icon="mdi:pause-circle" label={t("smartship_report.kpi_paused", "In pausa")} value={stats.paused} color="#607D8B" /></Grid>
              <Grid item xs={6} md={2.4}><KpiTile icon="mdi:alert" label={t("smartship_report.kpi_at_risk", "A rischio")} value={stats.at_risk} color="#F57C00" /></Grid>
              <Grid item xs={12} md={2.4}><KpiTile icon="mdi:cash-multiple" label={t("smartship_report.kpi_mrr_team", "MRR team")} value={`€${stats.mrr_monthly}`} color={ORO} sub={t("smartship_report.kpi_mrr_sub", "valore mensile ricorrente")} /></Grid>
            </Grid>

            <Stack spacing={2.5}>
              {/* Cancellati */}
              {s.cancelled.length > 0 && (
                <Box>
                  <SectionHeader icon="mdi:close-circle" title={t("smartship_report.section_cancelled_recent", "Cancellati recenti")} count={s.cancelled.length} color="#D32F2F" subtitle={t("smartship_report.section_cancelled_sub", "Priorità #1 — contattali per riattivare")} />
                  <Stack spacing={1}>
                    {s.cancelled.map((m) => (
                      <UserRow key={m.user_id} member={m}
                        accentColor={alpha("#D32F2F", 0.25)}
                        badges={<>
                          {m.days_since_cancel !== null && <Chip label={t("smartship_report.chip_days_ago", "{{n}}g fa", { n: m.days_since_cancel })} size="small" sx={{ height: 18, fontSize: "0.62rem", bgcolor: alpha("#D32F2F", 0.12), color: "#D32F2F", fontWeight: 700 }} />}
                          {m.months_before_cancel && <Chip label={t("smartship_report.chip_months_before", "{{n}} mesi prima", { n: m.months_before_cancel })} size="small" sx={{ height: 18, fontSize: "0.62rem", bgcolor: "#f5f5f5", color: MUTED }} />}
                        </>}
                        footer={<>
                          <Typography sx={{ fontSize: "0.72rem", color: MUTED, mt: 0.3 }}>
                            {t("smartship_report.cancelled_on_line", "📅 Cancellato {{date}} · {{product}}", { date: formatDate(m.cancelled_on), product: m.product })}
                          </Typography>
                          {m.reason && (
                            <Typography sx={{ fontSize: "0.72rem", color: "#D32F2F", fontStyle: "italic", mt: 0.2 }}>
                              «{m.reason}»
                            </Typography>
                          )}
                          {m.last_contact_at && (
                            <Typography sx={{ fontSize: "0.65rem", color: "#4CAF50", mt: 0.2, fontWeight: 700 }}>
                              {t("smartship_report.already_contacted", "✓ Già contattato {{when}}", { when: fuzzyDate(m.last_contact_at, t) })}
                            </Typography>
                          )}
                        </>}
                        actions={renderCancelledActions(m)}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Paused */}
              {s.paused.length > 0 && (
                <Box>
                  <SectionHeader icon="mdi:pause-circle" title={t("smartship_report.section_paused", "In pausa")} count={s.paused.length} color="#607D8B" subtitle={t("smartship_report.section_paused_sub", "Riprendili prima che si dimentichino")} />
                  <Stack spacing={1}>
                    {s.paused.map((m) => (
                      <UserRow key={m.user_id} member={m}
                        accentColor={alpha("#607D8B", 0.2)}
                        badges={<Chip label={m.days_paused ? t("smartship_report.chip_paused_for", "Pausa da {{n}}g", { n: m.days_paused }) : t("smartship_report.chip_paused", "In pausa")} size="small" sx={{ height: 18, fontSize: "0.62rem", bgcolor: alpha("#607D8B", 0.12), color: "#607D8B", fontWeight: 700 }} />}
                        footer={<Typography sx={{ fontSize: "0.72rem", color: MUTED, mt: 0.3 }}>{t("smartship_report.paused_line", "{{product}} · pausato {{date}}", { product: m.product, date: formatDate(m.paused_on) })}</Typography>}
                        actions={
                          <>
                            <Tooltip title={t("smartship_report.tooltip_wa_reactivate", "Riattiva insieme via WhatsApp")}>
                              <IconButton size="small" onClick={() => logContact(m.user_id, "whatsapp")}
                                href={waLink(m.phone, pausedTemplate(m.display_name, t))} target="_blank" rel="noreferrer">
                                <Iconify icon="mdi:whatsapp" width={22} sx={{ color: "#25D366" }} />
                              </IconButton>
                            </Tooltip>
                            {renderNeutralActions(m)}
                          </>
                        }
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* At risk */}
              {s.at_risk.length > 0 && (
                <Box>
                  <SectionHeader icon="mdi:alert" title={t("smartship_report.section_at_risk", "A rischio churn")} count={s.at_risk.length} color="#F57C00" subtitle={t("smartship_report.section_at_risk_sub", "Contattali per fidelizzarli prima che cancellino")} />
                  <Stack spacing={1}>
                    {s.at_risk.map((m) => (
                      <UserRow key={m.user_id} member={m}
                        accentColor={alpha("#F57C00", 0.25)}
                        badges={<>
                          {(m.risks || []).map((r) => {
                            const cfg = RISK_LABEL_META[r];
                            const label = cfg ? t(cfg.key, cfg.fallback) : r;
                            const color = cfg ? cfg.color : MUTED;
                            return <Chip key={r} label={label} size="small" sx={{ height: 18, fontSize: "0.62rem", bgcolor: alpha(color, 0.12), color, fontWeight: 700 }} />;
                          })}
                        </>}
                        footer={<>
                          <Typography sx={{ fontSize: "0.72rem", color: MUTED, mt: 0.3 }}>
                            {t("smartship_report.at_risk_line", "{{product}} · €{{value}}/mese · {{months}} mesi attivo", { product: m.product, value: m.total_value, months: m.months_active })}
                            {m.next_charge_at && ` · ${t("smartship_report.next_colon", "Prossimo:")} ${formatDate(m.next_charge_at)}`}
                            {m.card_expiry && ` · ${t("smartship_report.card_expires_on", "Carta scade {{when}}", { when: m.card_expiry })}`}
                          </Typography>
                          {m.cancellation_scheduled_for && (
                            <Typography sx={{ fontSize: "0.72rem", color: "#D32F2F", mt: 0.3, fontWeight: 700 }}>
                              {t("smartship_report.will_cancel_on", "⚠️ Cancellerà il {{date}} — CONTATTALO SUBITO", { date: formatDate(m.cancellation_scheduled_for) })}
                            </Typography>
                          )}
                        </>}
                        actions={renderNeutralActions(m)}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Solid */}
              {s.solid.length > 0 && (
                <Box>
                  <SectionHeader icon="mdi:trophy" title={t("smartship_report.section_solid", "Attivi solidi")} count={s.solid.length} color="#4CAF50" subtitle={t("smartship_report.section_solid_sub", "I tuoi campioni — coccolali")} />
                  <Stack spacing={1}>
                    {s.solid.slice(0, 15).map((m) => {
                      const nextDays = daysUntil(m.next_charge_at);
                      const monthsLabel = m.months_active === 1
                        ? t("smartship_report.month_singular_chip", "{{n}} mese", { n: m.months_active })
                        : t("smartship_report.month_plural_chip", "{{n}} mesi", { n: m.months_active });
                      return (
                        <UserRow key={m.user_id} member={m}
                          accentColor={alpha("#4CAF50", 0.15)}
                          badges={<>
                            <Chip label={monthsLabel} size="small" sx={{ height: 18, fontSize: "0.62rem", bgcolor: alpha("#4CAF50", 0.12), color: "#2E7D32", fontWeight: 700 }} />
                            {nextDays !== null && nextDays >= 0 && nextDays <= 7 && (
                              <Chip label={t("smartship_report.chip_in_days", "📦 fra {{n}}g", { n: nextDays })} size="small" sx={{ height: 18, fontSize: "0.62rem", bgcolor: alpha(ORO, 0.12), color: ORO, fontWeight: 700 }} />
                            )}
                          </>}
                          footer={<Typography sx={{ fontSize: "0.72rem", color: MUTED, mt: 0.3 }}>
                            {t("smartship_report.solid_line", "{{product}} · €{{value}}/mese", { product: m.product, value: m.total_value })}
                            {m.next_charge_at && ` · ${t("smartship_report.next_delivery", "Prossima consegna {{date}}", { date: formatDate(m.next_charge_at) })}`}
                          </Typography>}
                          actions={renderNeutralActions(m)}
                        />
                      );
                    })}
                    {s.solid.length > 15 && (
                      <Typography sx={{ fontSize: "0.72rem", color: MUTED, textAlign: "center", py: 1 }}>
                        {t("smartship_report.more_active", "+ altri {{n}} attivi", { n: s.solid.length - 15 })}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}

              {/* To activate */}
              {s.to_activate.length > 0 && (
                <Box>
                  <SectionHeader icon="mdi:account-plus" title={t("smartship_report.section_to_activate", "Da attivare")} count={s.to_activate.length} color={ORO} subtitle={t("smartship_report.section_to_activate_sub", "Team senza SmartShip — propongli l'attivazione")} />
                  <Stack spacing={1}>
                    {s.to_activate.slice(0, 20).map((m) => (
                      <UserRow key={m.user_id} member={m}
                        accentColor={alpha(ORO, 0.15)}
                        footer={<Typography sx={{ fontSize: "0.72rem", color: MUTED, mt: 0.3 }}>
                          {t("smartship_report.registered_when", "Iscritto {{when}}", { when: fuzzyDate(m.last_seen_at, t) })}
                        </Typography>}
                        actions={renderActivateActions(m)}
                      />
                    ))}
                    {s.to_activate.length > 20 && (
                      <Typography sx={{ fontSize: "0.72rem", color: MUTED, textAlign: "center", py: 1 }}>
                        {t("smartship_report.more_to_activate", "+ altri {{n}} da attivare", { n: s.to_activate.length - 20 })}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}

              {/* Timeline */}
              {timeline.length > 0 && (
                <Box>
                  <SectionHeader icon="mdi:timeline-clock" title={t("smartship_report.section_timeline", "Attività ultimi 30 giorni")} count={timeline.length} color="#9C27B0" />
                  <Card sx={{ p: 2, borderRadius: 2, border: "1px solid #f0ece6" }}>
                    <Stack spacing={0.75}>
                      {timeline.map((e, i) => {
                        const color = e.type === "cancelled" ? "#D32F2F" : e.type === "paused" ? "#607D8B" : "#4CAF50";
                        const icon = e.type === "cancelled" ? "mdi:close-circle" : e.type === "paused" ? "mdi:pause-circle" : "mdi:check-circle";
                        return (
                          <Stack key={i} direction="row" spacing={1} alignItems="center">
                            <Iconify icon={icon} width={16} sx={{ color, flexShrink: 0 }} />
                            <Typography sx={{ fontSize: "0.78rem", color: ESPRESSO, flex: 1 }}>{e.text}</Typography>
                            <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>{fuzzyDate(e.date, t)}</Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Card>
                </Box>
              )}
            </Stack>
          </>
        )}

        <Snackbar open={!!snackbar} autoHideDuration={2000} onClose={() => setSnackbar(null)} message={snackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />
      </Box>
    </Page>
  );
};

export default SmartshipReport;
