import { Box, Button, Card, Grid, Stack, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const downloadBlob = async (url, filename, type = "text/csv") => {
  const res = await axiosInstance.get(url, { responseType: "blob" });
  const blob = new Blob([res.data], { type });
  const u = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = u; a.download = filename;
  a.click(); URL.revokeObjectURL(u);
};

const Compliance = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const now = new Date();
  const [from, setFrom] = useState(new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10));
  const [to, setTo] = useState(now.toISOString().slice(0, 10));
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const ExportCard = ({ icon, title, subtitle, color, onClick, btnLabel }) => (
    <Card sx={{ ...cs, p: 3, height: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(color, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon={icon} width={22} sx={{ color }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>{title}</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>{subtitle}</Typography>
        </Box>
      </Stack>
      <Button fullWidth variant="contained" onClick={onClick} startIcon={<Iconify icon="mdi:download" />}
        sx={{ bgcolor: color, "&:hover": { bgcolor: alpha(color, 0.8) }, fontWeight: 700, textTransform: "none", borderRadius: 2 }}>
        {btnLabel}
      </Button>
    </Card>
  );

  return (
    <Page title={t("admin.compliance.page_title", "Compliance")}>
      <Box sx={{ px: 3, pb: 4 }}>
        <HeaderBreadcrumbs heading={t("admin.compliance.page_heading", "Compliance & Fiscale")} links={[{ name: t("admin.compliance.breadcrumb_dashboard", "Dashboard") }, { name: t("admin.compliance.breadcrumb_compliance", "Compliance") }]} />

        {/* Filtri periodo */}
        <Card sx={{ ...cs, p: 2.5, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO }}>{t("admin.compliance.period_label", "Periodo:")}</Typography>
            <TextField size="small" type="date" label={t("admin.compliance.period_from", "Da")} value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField size="small" type="date" label={t("admin.compliance.period_to", "A")} value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO, ml: 2 }}>{t("admin.compliance.payout_month_label", "Mese payout:")}</Typography>
            <TextField size="small" type="number" label={t("admin.compliance.field_month", "Mese")} value={month} onChange={(e) => setMonth(e.target.value)} sx={{ width: 80 }} inputProps={{ min: 1, max: 12 }} />
            <TextField size="small" type="number" label={t("admin.compliance.field_year", "Anno")} value={year} onChange={(e) => setYear(e.target.value)} sx={{ width: 90 }} />
          </Stack>
        </Card>

        <Grid container spacing={2}>
          {/* KYC Pending */}
          <Grid item xs={12} md={4}>
            <ExportCard
              icon="mdi:card-account-details-outline" title={t("admin.compliance.kyc_title", "Verifica documenti KYC")}
              subtitle={t("admin.compliance.kyc_subtitle", "Approva o rifiuta i documenti di identità caricati")}
              color="#9C27B0"
              btnLabel={t("admin.compliance.kyc_button", "Apri verifica KYC")}
              onClick={() => navigate("/admin/compliance/kyc-pending")}
            />
          </Grid>

          {/* Lettere di Incarico */}
          <Grid item xs={12} md={4}>
            <ExportCard
              icon="mdi:file-sign" title={t("admin.compliance.letters_title", "Lettere di Incarico")}
              subtitle={t("admin.compliance.letters_subtitle", "Visualizza promoter e scarica le lettere firmate")}
              color="#00BCD4"
              btnLabel={t("admin.compliance.letters_button", "Apri elenco lettere")}
              onClick={() => navigate("/admin/compliance/lettere-incarico")}
            />
          </Grid>

          {/* Questura - Nuovi iscritti */}
          <Grid item xs={12} md={4}>
            <ExportCard
              icon="mdi:police-badge" title={t("admin.compliance.questura_new_title", "Export Questura — Nuovi")} subtitle={t("admin.compliance.questura_new_subtitle", "Elenco nuovi incaricati per comunicazione Questura")}
              color="#2196F3"
              btnLabel={t("admin.compliance.questura_new_button", "Scarica CSV Nuovi Iscritti")}
              onClick={async () => {
                try { await downloadBlob(`api/wp/compliance/export-questura?from=${from}&to=${to}`, `questura_nuovi_${from}_${to}.csv`); }
                catch { enqueueSnackbar(t("admin.compliance.export_error", "Errore export"), { variant: "error" }); }
              }}
            />
          </Grid>

          {/* Questura - Cessati */}
          <Grid item xs={12} md={4}>
            <ExportCard
              icon="mdi:account-off" title={t("admin.compliance.questura_ended_title", "Export Questura — Cessati")} subtitle={t("admin.compliance.questura_ended_subtitle", "Elenco incaricati cessati")}
              color="#FF9800"
              btnLabel={t("admin.compliance.questura_ended_button", "Scarica CSV Cessati")}
              onClick={async () => {
                try { await downloadBlob(`api/wp/compliance/export-questura-cessati?from=${from}&to=${to}`, `questura_cessati_${from}_${to}.csv`); }
                catch { enqueueSnackbar(t("admin.compliance.export_error", "Errore export"), { variant: "error" }); }
              }}
            />
          </Grid>

          {/* Payout mensile */}
          <Grid item xs={12} md={4}>
            <ExportCard
              icon="mdi:file-table" title={t("admin.compliance.payout_monthly_title", "Report Payout Mensile")} subtitle={t("admin.compliance.payout_monthly_subtitle", "Export CSV per il commercialista")}
              color={ORO}
              btnLabel={t("admin.compliance.payout_monthly_button", "Scarica CSV Payout")}
              onClick={async () => {
                try { await downloadBlob(`api/wp/compliance/export-monthly-payout?month=${month}&year=${year}`, `payout_${year}_${month}.csv`); }
                catch { enqueueSnackbar(t("admin.compliance.export_error", "Errore export"), { variant: "error" }); }
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
};

export default Compliance;
