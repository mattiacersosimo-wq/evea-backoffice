import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  Tooltip,
} from "@mui/material";
import Iconify from "src/components/Iconify";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";

// Configurazione flusso email eVea (statica — riflette stato prod al 16/08/2026).
// Aggiornare manualmente quando si aggiungono/spostano email.

const CLIENT_FLOW = [
  { day: 0, name: "Conferma ordine", source: "Shopify", type: "transazionale" },
  { day: 0, name: "Welcome customer + credenziali", source: "Backend", type: "transazionale", key: "welcome_email_customer" },
  { day: 2, name: "C-APP1 — L'app che tiene il tuo rituale", source: "Backend", type: "transazionale", key: "client_app_engagement_1" },
  { day: 5, name: "Com'è andata la prima tazza?", source: "Backend", type: "transazionale", key: "client_first_cup_checkin" },
  { day: 7, name: "Il rituale in tre gesti", source: "Backend", type: "transazionale", key: "client_ritual_howto" },
  { day: 10, name: "T3 — Programmi benefit attivi (3FF)", source: "Backend", type: "transazionale", key: "client_3ff_explainer" },
  { day: 13, name: "T4-C — Bonus Ordine Ricorrente (ROB)", source: "Backend", type: "transazionale", key: "client_rob_activate_smartship" },
  { day: 18, name: "La matematica del prezzo più basso", source: "Brevo", type: "soft-spam" },
  { day: 22, name: "C-APP2 — 3 storie community", source: "Backend", type: "transazionale", key: "client_app_engagement_2" },
  { day: "~25", name: "T4-CS — Bonus SmartShip matura ogni 3 mesi (se SmartShip attivo)", source: "Backend", type: "transazionale", key: "client_rob_smartship_explainer" },
  { day: 30, name: "Quante buste ti restano?", source: "Brevo", type: "soft-spam" },
  { day: 35, name: "Che caffè è? (3FF)", source: "Brevo", type: "soft-spam" },
  { day: 40, name: "C-APP3 — Ricette community", source: "Backend", type: "transazionale", key: "client_app_engagement_3" },
];

const PROMOTER_FLOW = [
  { day: 0, name: "Welcome promoter + credenziali (Kit €79)", source: "Backend", type: "transazionale", key: "welcome_email" },
  { day: 0, name: "Kit acquistato → invito onboarding", source: "Backend blade", type: "transazionale", key: "became-promoter-mail" },
  { day: "1-3 se non firma", name: "Onboarding reminder + document missing", source: "Backend blade", type: "transazionale" },
  { day: 12, name: "P-APP1 — L'app per allineare il team", source: "Backend", type: "transazionale", key: "promoter_app_engagement_1" },
  { day: 22, name: "P-APP2 — L'Academy nel tuo tascabile", source: "Backend", type: "transazionale", key: "promoter_app_engagement_2" },
  { day: 40, name: "P-APP3 — Come i tuoi clienti vivono l'app", source: "Backend", type: "transazionale", key: "promoter_app_engagement_3" },
];

// Cross-audience: promoter che compra ANCHE prodotti eVea riceve le mail cliente
// pertinenti (timing dal primo cart prodotti, non dal Kit).
const PROMOTER_WITH_PRODUCTS_FLOW = [
  { day: "0 (Kit)", name: "Welcome promoter + credenziali", source: "Backend", type: "transazionale", key: "welcome_email" },
  { day: "0 (Kit)", name: "Kit acquistato → invito onboarding", source: "Backend blade", type: "transazionale", key: "became-promoter-mail" },
  { day: "+12 (dal Kit)", name: "P-APP1 — App per il team", source: "Backend", type: "transazionale", key: "promoter_app_engagement_1" },
  { day: "+22 (dal Kit)", name: "P-APP2 — Academy", source: "Backend", type: "transazionale", key: "promoter_app_engagement_2" },
  { day: "+40 (dal Kit)", name: "P-APP3 — Testimonianze cliente", source: "Backend", type: "transazionale", key: "promoter_app_engagement_3" },
  { day: "+5 (da 1° prodotto)", name: "Com'è andata la prima tazza?", source: "Backend", type: "transazionale", key: "client_first_cup_checkin" },
  { day: "+7 (da 1° prodotto)", name: "Il rituale in tre gesti", source: "Backend", type: "transazionale", key: "client_ritual_howto" },
  { day: "+10 (da 1° prodotto)", name: "T3 — Programmi benefit (3FF)", source: "Backend", type: "transazionale", key: "client_3ff_explainer" },
  { day: "+13 (da 1° prodotto)", name: "T4-C — ROB explainer", source: "Backend", type: "transazionale", key: "client_rob_activate_smartship" },
  { day: "~+25 (post SmartShip)", name: "T4-CS — ROB cycle (se SmartShip)", source: "Backend", type: "transazionale", key: "client_rob_smartship_explainer" },
];

// AUTO-LP #12 — Landing Page Prodotto (lead nurture pre-cliente).
// Trigger: contatto aggiunto a lista AUTO-LP dopo compilazione form LP prodotto
// (con GDPR_CONSENT=true). Suddivisione condizione STATO_MARKETING=LP prima
// di ogni invio. A fine serie: STATO_MARKETING passa a D (dormant).
const LP_PRODUCT_FLOW = [
  { day: "+1h", name: "LP-E1 — Una storia lunga duemila anni (Wu-Ti, Fujian, GanoHerb)", source: "Brevo", type: "marketing" },
  { day: "+2gg (~2)", name: "LP-E2 — Cosa c'è davvero in una bustina eVea (3 scelte)", source: "Brevo", type: "marketing" },
  { day: "+4gg (~6)", name: "LP-E3 — Black, Mocha, Latte o Green Tea? (guida scelta gusto)", source: "Brevo", type: "marketing" },
  { day: "+3gg (~9)", name: "LP-E4 — Le 5 domande che ci fanno tutti (FAQ)", source: "Brevo", type: "marketing" },
  { day: "+4gg (~13)", name: "LP-E5 — Non ti scriviamo più (sunset)", source: "Brevo", type: "marketing" },
  { day: "end", name: "→ STATO_MARKETING = D (dormant)", source: "Brevo", type: "system" },
];

// AUTO-LO #13 — Landing Page Opportunità (lead nurture pre-promoter).
// Trigger: contatto aggiunto a lista AUTO-LO dopo form LP opportunità/business.
// Suddivisione condizione STATO_MARKETING=LO prima di ogni invio.
// Firma founder Tommaso, tono personale (non brand-voice). A fine: STATO=D.
const LP_OPPORTUNITY_FLOW = [
  { day: "+1h", name: "LO-E1 — La storia che non racconto quasi mai (Tommaso founder)", source: "Brevo", type: "marketing" },
  { day: "+2gg (~2)", name: "LO-E2 — Cosa si fa davvero (conversazioni, no vendite)", source: "Brevo", type: "marketing" },
  { day: "+4gg (~6)", name: "LO-E3 — Ti diranno che 'sono le solite cose' (obiezione MLM)", source: "Brevo", type: "marketing" },
  { day: "+3gg (~9)", name: "LO-E4 — Quanto costa, quanto rende, cosa rischi (FAQ pratiche)", source: "Brevo", type: "marketing" },
  { day: "+4gg (~13)", name: "LO-E5 — Ultima email — pensiero onesto (sunset + soft-CTA prodotto)", source: "Brevo", type: "marketing" },
  { day: "end", name: "→ STATO_MARKETING = D (dormant)", source: "Brevo", type: "system" },
];

const EVENT_EMAILS = [
  { name: "Ordine spedito", source: "Shopify", trigger: "Fulfillment Shopify" },
  { name: "MVP raggiunto", source: "Backend blade", trigger: "Cron gate MVP", key: "mvp_achieved" },
  { name: "Rock Solid MVP raggiunto", source: "Backend blade", trigger: "Cron gate rock-solid" },
  { name: "Nuovo rank raggiunto", source: "Backend", trigger: "Rank update", key: "rank_achieved" },
  { name: "Payout richiesto / approvato / rifiutato", source: "Backend blade", trigger: "Azione admin", key: "payout_approval" },
  { name: "Commission accreditata (batch)", source: "Backend blade", trigger: "Cron commission auto-approve" },
  { name: "3FF coupon maturato", source: "Backend blade", trigger: "3° referral qualificato" },
  { name: "ROB coupon maturato", source: "Backend blade", trigger: "3° mese consecutivo SmartShip" },
  { name: "Nuovo membro nel team", source: "Backend", trigger: "Signup sotto sponsor", key: "new_team_member" },
  { name: "Il tuo cliente ha fatto un ordine", source: "Backend", trigger: "Webhook Shopify", key: "sponsor_order_notification" },
  { name: "Soglia INPS vicina / superata", source: "Backend blade", trigger: "Cron controllo saldo" },
  { name: "Rimborso elaborato", source: "Backend blade", trigger: "Webhook Shopify refund" },
  { name: "Documento identità mancante", source: "Backend blade", trigger: "Cron controllo KYC" },
  { name: "Cambio password / 2FA", source: "Backend", trigger: "Azione utente", key: "change_password" },
  { name: "Verifica email", source: "Backend", trigger: "Signup", key: "verification_email" },
  { name: "Reset password", source: "Backend", trigger: "Richiesta reset", key: "forgot_password" },
];

const sourceStyle = (src) => {
  if (src === "Backend") return { bg: "#E8F4EA", color: "#2e7d32" };
  if (src === "Backend blade") return { bg: "#E8F4EA", color: "#5d7a5f" };
  if (src === "Backend (auto)") return { bg: "#E8F4EA", color: "#2e7d32" };
  if (src === "Brevo") return { bg: "#FFF4E5", color: "#B8963B" };
  if (src === "Shopify") return { bg: "#EAF3FF", color: "#1976d2" };
  return { bg: "#F0F0F0", color: "#555" };
};

const typeColor = (type) => {
  if (type === "transazionale") return "success";
  if (type === "soft-spam") return "warning";
  if (type === "marketing") return "error";
  return "default";
};

const FlowTable = ({ flow, timedColumn = "Giorno", templateMap }) => (
  <TableContainer component={Paper} elevation={0}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell width={160}>{timedColumn}</TableCell>
          <TableCell>Email</TableCell>
          <TableCell width={140}>Sorgente</TableCell>
          <TableCell width={120}>Tipo</TableCell>
          <TableCell width={90} align="center">Azione</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {flow.map((row, idx) => {
          const s = sourceStyle(row.source);
          const templateInfo = row.key && templateMap ? templateMap[row.key] : null;
          const editUrl = templateInfo
            ? PATH_DASHBOARD.settings.email_settings.view(templateInfo.id, { name: row.key })
            : null;
          return (
            <TableRow key={idx} hover>
              <TableCell><b>{row.day}</b></TableCell>
              <TableCell>
                <div>{row.name}</div>
                {row.key && (
                  <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "monospace" }}>
                    {row.key}
                  </Typography>
                )}
                {row.trigger && !row.key && (
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    trigger: {row.trigger}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Chip label={row.source} size="small" sx={{ background: s.bg, color: s.color, fontWeight: 600 }} />
              </TableCell>
              <TableCell>
                <Chip label={row.type || "-"} size="small" color={typeColor(row.type)} variant="outlined" />
              </TableCell>
              <TableCell align="center">
                {editUrl ? (
                  <Tooltip title="Modifica template">
                    <IconButton size="small" component={Link} to={editUrl} sx={{ color: "#B8963B" }}>
                      <Iconify icon="material-symbols:edit-outline" />
                    </IconButton>
                  </Tooltip>
                ) : row.source === "Brevo" ? (
                  <Tooltip title="Gestita su Brevo automation">
                    <Chip label="Brevo" size="small" variant="outlined" sx={{ fontSize: 10 }} />
                  </Tooltip>
                ) : row.source === "Shopify" ? (
                  <Tooltip title="Gestita da Shopify Admin > Notifications">
                    <Chip label="Shopify" size="small" variant="outlined" sx={{ fontSize: 10 }} />
                  </Tooltip>
                ) : row.source === "Backend blade" ? (
                  <Tooltip title="Template blade hardcoded — modifica via codice">
                    <Chip label="Blade" size="small" variant="outlined" sx={{ fontSize: 10 }} />
                  </Tooltip>
                ) : (
                  <span style={{ color: "#ccc" }}>—</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

const EmailFlow = () => {
  const [tab, setTab] = useState("client");
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await axiosInstance.get("api/admin/email-template");
        setTemplates(data?.data || []);
      } catch (e) {
        setTemplates([]);
      }
    };
    fetchTemplates();
  }, []);

  // Mappa key → { id, subject } — preferisce IT se disponibile
  const templateMap = useMemo(() => {
    const map = {};
    templates.forEach((t) => {
      if (!map[t.email] || t.language === "it") {
        map[t.email] = { id: t.id, subject: t.subject, language: t.language };
      }
    });
    return map;
  }, [templates]);

  return (
    <Page title="Flusso Email">
      <Box>
        <HeaderBreadcrumbs
          heading="Flusso Email eVea"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Email", href: PATH_DASHBOARD.settings.email_settings.root },
            { name: "Flusso" },
          ]}
          action={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" component={Link} to={PATH_DASHBOARD.settings.email_settings.root}>
                Template
              </Button>
              <Button variant="outlined" component={Link} to={PATH_DASHBOARD.settings.email_settings.analytics}>
                Analytics
              </Button>
            </Stack>
          }
        />

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Timeline di tutte le email inviate day-by-day, organizzate per audience. Clicca l'icona <b>Modifica</b> per aprire il template nell'editor. Le mail Brevo si gestiscono da Brevo automation, le Shopify da Shopify Admin, le "blade" da codice.
            </Typography>
          </CardContent>
        </Card>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }} variant="scrollable" scrollButtons="auto">
          <Tab value="client" label={`Cliente puro (${CLIENT_FLOW.length})`} />
          <Tab value="promoter" label={`Promoter puro (${PROMOTER_FLOW.length})`} />
          <Tab value="promoter_prod" label={`Promoter + prodotti (${PROMOTER_WITH_PRODUCTS_FLOW.length})`} />
          <Tab value="lp_product" label={`LP Prodotto (${LP_PRODUCT_FLOW.length})`} />
          <Tab value="lp_opportunity" label={`LP Opportunità (${LP_OPPORTUNITY_FLOW.length})`} />
          <Tab value="event" label={`Da evento (${EVENT_EMAILS.length})`} />
        </Tabs>

        {tab === "client" && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Flusso cliente puro (dal primo ordine Shopify)</Typography>
              <FlowTable flow={CLIENT_FLOW} templateMap={templateMap} />
            </CardContent>
          </Card>
        )}

        {tab === "promoter" && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Flusso promoter puro (Kit €79, mai prodotti eVea)</Typography>
              <FlowTable flow={PROMOTER_FLOW} templateMap={templateMap} />
            </CardContent>
          </Card>
        )}

        {tab === "promoter_prod" && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Promoter + prodotti eVea (riceve entrambe le serie)</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Il promoter che compra anche prodotti eVea (non solo Kit) riceve la serie promoter <b>dal signup Kit</b> + la serie cliente <b>dal primo ordine con prodotti</b>. Zero doppioni: C-APP e P-APP sono branch separate.
              </Typography>
              <FlowTable flow={PROMOTER_WITH_PRODUCTS_FLOW} templateMap={templateMap} />
            </CardContent>
          </Card>
        )}

        {tab === "lp_product" && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Flusso LP Prodotto — AUTO-LP #12 (lead nurture pre-cliente)</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Trigger: contatto aggiunto a lista AUTO-LP dopo compilazione form landing page prodotto (con GDPR_CONSENT=true). Ogni email preceduta da suddivisione condizione <code>STATO_MARKETING = LP</code>. A fine serie l'attributo passa a <code>D</code> (dormant) e il contatto esce dal flusso. Tutte le mail sono gestite su Brevo automation — <b>non modificabili qui</b>.
              </Typography>
              <FlowTable flow={LP_PRODUCT_FLOW} templateMap={templateMap} />
            </CardContent>
          </Card>
        )}

        {tab === "lp_opportunity" && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Flusso LP Opportunità — AUTO-LO #13 (lead nurture pre-promoter)</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Trigger: contatto aggiunto a lista AUTO-LO dopo compilazione form landing page opportunità/business. Ogni email preceduta da suddivisione condizione <code>STATO_MARKETING = LO</code>. Firma founder <b>Tommaso</b>, tono personale (non brand-voice). A fine serie l'attributo passa a <code>D</code> (dormant). Tutte gestite su Brevo automation — <b>non modificabili qui</b>.
              </Typography>
              <FlowTable flow={LP_OPPORTUNITY_FLOW} templateMap={templateMap} />
            </CardContent>
          </Card>
        )}

        {tab === "event" && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Email da evento (trigger non temporizzato)</Typography>
              <FlowTable flow={EVENT_EMAILS.map((e) => ({ ...e, day: "evento", type: "transazionale" }))} timedColumn="Trigger" templateMap={templateMap} />
            </CardContent>
          </Card>
        )}
      </Box>
    </Page>
  );
};

export default EmailFlow;
