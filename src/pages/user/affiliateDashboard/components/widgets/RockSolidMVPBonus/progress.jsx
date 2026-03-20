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

const Progress = ({ higherRank }) => {
  const { t } = useTranslation();
  if (!higherRank) return null;

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
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#2C1A0E", mb: 1 }}>
            {t("affiliate_dashboard.monthly_qualification_status")}
          </Typography>
          <Grid container spacing={0.5}>
            {monthEntries.map((isCompleted, index) => (
              <Grid item xs={3} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    py: 0.8,
                    borderRadius: 1.5,
                    bgcolor: isCompleted ? alpha("#43A047", 0.1) : alpha("#E53935", 0.06),
                    border: `1px solid ${isCompleted ? alpha("#43A047", 0.2) : alpha("#E53935", 0.1)}`,
                  }}
                >
                  <Iconify
                    icon={isCompleted ? "mdi:check-circle" : "mdi:close-circle-outline"}
                    width={14}
                    sx={{ color: isCompleted ? "#43A047" : "#E53935" }}
                  />
                  <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: isCompleted ? "#43A047" : "#999" }}>
                    M{index + 1}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Stack spacing={0.5} sx={{ mt: 1 }}>
        <Item
          title={t("affiliate_dashboard.eligibility_period_for_additional_bonus")}
          required={Number(higherRank?.consecutive_months_bonus_trigger)}
          completed={Number(higherRank?.consecutive_months_completed)}
          status={Number(higherRank?.consecutive_months_completed) >= Number(higherRank?.consecutive_months_bonus_trigger)}
        />
        <Item
          title={t("affiliate_dashboard.remaining_days_in_go_mvp")}
          required={Number(higherRank?.total_qualification_day)}
          completed={Number(higherRank?.current_qualification_day)}
          status={Number(higherRank?.current_qualification_day) >= Number(higherRank?.total_qualification_day)}
        />
      </Stack>
    </Box>
  );
};

export default Progress;
