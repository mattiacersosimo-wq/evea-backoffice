import React from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Item from "../rankProgressBar/item";
import Iconify from "src/components/Iconify";
import { useTranslation } from "react-i18next";
import CountdownGauge from "src/components/bonus-common/CountdownGauge";
import MonthGrid from "src/components/bonus-common/MonthGrid";

const formatLocaleDate = (isoDateStr, locale) => {
  if (!isoDateStr) return "";
  try {
    const loc = locale === "ro" ? "ro-RO" : locale === "en" ? "en-US" : "it-IT";
    return new Date(isoDateStr).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
  } catch (e) { return isoDateStr; }
};

const Progress = ({ higherRank }) => {
  const { t, i18n } = useTranslation();
  if (!higherRank) return null;

  if (higherRank?.go_mvp_approved === 0) {
    return (
      <Box sx={{ py: 3, textAlign: "center" }}>
        <Iconify icon="mdi:lock-outline" width={36} sx={{ color: "#E8DDCA", mb: 1 }} />
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "#5C4A3A" }}>
          {t("evea.not_eligible", "Non elegibile")}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "#7A6A5C", mt: 0.5 }}>
          {t("evea.not_eligible_rsp", "Per accedere al Rock Solid MVP devi prima completare e ottenere l'approvazione del Go MVP Bonus.")}
        </Typography>
      </Box>
    );
  }

  // Piano compensi v4 sezione 4.1: il RSB puo' firare solo dal mese
  // successivo alla fine del ciclo Go MVP. Se il ciclo e' ancora in
  // corso, mostriamo la card lockata con countdown al primo pagamento.
  if (higherRank?.in_go_mvp_cycle) {
    const daysRemaining = Math.max(
      0,
      Number(higherRank?.total_qualification_day || 0) - Number(higherRank?.current_qualification_day || 0)
    );
    const firstPayoutDate = formatLocaleDate(higherRank?.first_rsb_month_start, i18n.resolvedLanguage);
    return (
      <Box sx={{ py: 3, textAlign: "center" }}>
        <Iconify icon="mdi:lock-outline" width={36} sx={{ color: "#B8963B", mb: 1 }} />
        <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#5C4A3A", mb: 0.5 }}>
          {t("bonus_widgets.rock_solid.locked_title", "Rock Solid MVP inizia dopo la fine del ciclo Go MVP")}
        </Typography>
        <Typography sx={{ fontSize: "0.8rem", color: "#7A6A5C", mt: 0.5 }}>
          {t("bonus_widgets.rock_solid.locked_days_remaining", "Giorni rimanenti: {{days}}", { days: daysRemaining })}
        </Typography>
        {firstPayoutDate && (
          <Typography sx={{ fontSize: "0.8rem", color: "#7A6A5C", mt: 0.5 }}>
            {t("bonus_widgets.rock_solid.locked_first_payout", "Primo pagamento previsto dal {{date}}", { date: firstPayoutDate })}
          </Typography>
        )}
      </Box>
    );
  }

  const months = higherRank?.monthly_qualification_status;
  const monthEntries = months ? Object.values(months) : [];

  return (
    <Box>
      <Stack spacing={0.5}>
        <Item
          title={t("affiliate_dashboard.direct_qualifying_volume")}
          required={Number(higherRank?.required_dqv)}
          completed={Number(higherRank?.current_dqv)}
          status={Number(higherRank?.current_dqv) >= Number(higherRank?.required_dqv)}
        >
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("affiliate_dashboard.username")}</TableCell>
                  <TableCell align="right">{t("affiliate_dashboard.qv")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {higherRank?.current_dqv_details?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item?.user_name}</TableCell>
                    <TableCell align="right">{item?.qv}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Item>
        <Item
          title={t("affiliate_dashboard.personal_qualifying_volume")}
          required={Number(higherRank?.required_personal_volume)}
          completed={Number(higherRank?.current_pqv)}
          status={Number(higherRank?.current_pqv) >= Number(higherRank?.required_personal_volume)}
        >
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("affiliate_dashboard.username")}</TableCell>
                  <TableCell align="right">{t("affiliate_dashboard.qv")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {higherRank?.current_pqv_details?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item?.user_name}</TableCell>
                    <TableCell align="right">{item?.qv}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Item>
        <Item
          title={t("affiliate_dashboard.personally_enrolled_customers")}
          required={Number(higherRank?.required_customers)}
          completed={Number(higherRank?.current_customers)}
          status={Number(higherRank?.current_customers) >= Number(higherRank?.required_customers)}
        >
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("affiliate_dashboard.username")}</TableCell>
                  <TableCell align="right">{t("affiliate_dashboard.qv")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {higherRank?.current_customer_details?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item?.customer_name}</TableCell>
                    <TableCell align="right">{item?.qv}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Item>
        <Item
          title={t("affiliate_dashboard.personally_enrolled_customers_with_30_qv")}
          required={Number(higherRank?.required_customers)}
          completed={Number(higherRank?.current_min_qv_per_customer)}
          status={Number(higherRank?.current_min_qv_per_customer) >= Number(higherRank?.required_customers)}
        >
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("affiliate_dashboard.username")}</TableCell>
                  <TableCell align="right">{t("affiliate_dashboard.qv")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {higherRank?.current_min_qv_per_customer_details?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item?.customer_name}</TableCell>
                    <TableCell align="right">{item?.qv}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Item>
      </Stack>

      {/* Monthly calendar grid 4x3 */}
      {monthEntries.length > 0 && (
        <MonthGrid
          months={monthEntries}
          title={t("affiliate_dashboard.monthly_qualification_status")}
        />
      )}

      <Stack spacing={0.5} sx={{ mt: 1 }}>
        <Item
          title={t("affiliate_dashboard.eligibility_period_for_additional_bonus")}
          required={Number(higherRank?.consecutive_months_bonus_trigger)}
          completed={Number(higherRank?.consecutive_months_completed)}
          status={Number(higherRank?.consecutive_months_completed) >= Number(higherRank?.consecutive_months_bonus_trigger)}
        />
        <CountdownGauge
          currentDay={Number(higherRank?.current_qualification_day) || 0}
          totalDays={Number(higherRank?.total_qualification_day) || 1}
          title={t("affiliate_dashboard.remaining_days_in_go_mvp")}
        />
      </Stack>
    </Box>
  );
};

export default Progress;
