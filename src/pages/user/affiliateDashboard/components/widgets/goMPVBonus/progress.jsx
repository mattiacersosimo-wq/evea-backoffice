import React from "react";
import {
  Box,
  Chip,
  Grid,
  Stack,
  Table,
  TableContainer,
  TableHead,
  Typography,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  LinearProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Item from "../rankProgressBar/item";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";

const ORO = "#B8963B";

const Progress = ({ higherRank }) => {
  const { t } = useTranslation();
  if (!higherRank) return null;

  const eligible = higherRank?.is_eligible === 1;
  const totalDays = Number(higherRank?.total_qualification_day) || 1;
  const currentDay = Number(higherRank?.current_qualification_day) || 0;
  const remainingDays = Math.max(totalDays - currentDay, 0);
  const daysPct = Math.min((currentDay / totalDays) * 100, 100);
  const isExpired = higherRank?.is_expired === 1;
  const isUrgent = remainingDays <= 7 && remainingDays > 0;

  const months = higherRank?.monthly_qualification_status;
  const monthEntries = months ? Object.values(months) : [];

  return (
    <Box>
      {/* ── Package status ── */}
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Iconify
          icon={eligible ? "mdi:check-circle" : "mdi:close-circle"}
          width={20}
          sx={{ color: eligible ? "#43A047" : "#E53935" }}
        />
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#2C1A0E" }}>
          {t("affiliate_dashboard.package_purchased")}:
          <Chip
            label={eligible ? "Yes" : "No"}
            size="small"
            sx={{
              ml: 1, height: 22,
              bgcolor: eligible ? alpha("#43A047", 0.1) : alpha("#E53935", 0.1),
              color: eligible ? "#43A047" : "#E53935",
              fontWeight: 700, fontSize: "0.7rem",
            }}
          />
        </Typography>
      </Stack>

      <Ternary
        when={eligible}
        then={
          <>
            {/* ── Countdown giorni ── */}
            <Box
              sx={{
                p: 2, mb: 2, borderRadius: 2,
                bgcolor: isExpired ? alpha("#E53935", 0.04) : isUrgent ? alpha("#FF9800", 0.06) : alpha(ORO, 0.04),
                border: `1px solid ${isExpired ? alpha("#E53935", 0.15) : isUrgent ? alpha("#FF9800", 0.2) : alpha(ORO, 0.1)}`,
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify
                    icon={isExpired ? "mdi:timer-off" : "mdi:timer-outline"}
                    width={20}
                    sx={{ color: isExpired ? "#E53935" : isUrgent ? "#FF9800" : ORO }}
                  />
                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#2C1A0E" }}>
                    {t("affiliate_dashboard.qualification_days")}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontSize: "1.1rem", fontWeight: 800,
                    color: isExpired ? "#E53935" : isUrgent ? "#FF9800" : ORO,
                  }}
                >
                  {isExpired ? "Scaduto" : `${remainingDays}g`}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={daysPct}
                sx={{
                  height: 6, borderRadius: 3,
                  bgcolor: "#eee",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: isExpired ? "#E53935" : isUrgent ? "#FF9800" : ORO,
                    borderRadius: 3,
                  },
                }}
              />
              <Typography sx={{ fontSize: "0.65rem", color: "#999", mt: 0.5, textAlign: "right" }}>
                {currentDay} / {totalDays} {t("affiliate_dashboard.days", { defaultValue: "giorni" })}
              </Typography>
            </Box>

            {/* ── Requisiti ── */}
            <Stack spacing={0.5}>
              <Item
                title={t("affiliate_dashboard.personal_qualifying_volume")}
                required={Number(higherRank?.min_pqv)}
                completed={Number(higherRank?.current_pqv)}
                status={Number(higherRank?.current_pqv) >= Number(higherRank?.min_pqv)}
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
                      {higherRank?.current_pqv_users?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item?.username}</TableCell>
                          <TableCell align="right">{item?.qv}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Item>
              <Item
                title={t("affiliate_dashboard.direct_qualifying_volume")}
                required={Number(higherRank?.min_dqv)}
                completed={Number(higherRank?.current_dqv)}
                status={Number(higherRank?.current_dqv) >= Number(higherRank?.min_dqv)}
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
                      {higherRank?.current_dqv_users?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item?.username}</TableCell>
                          <TableCell align="right">{item?.qv}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Item>
              <Item
                title={t("affiliate_dashboard.no_of_customers_with_30_qv")}
                required={Number(higherRank?.required_customers)}
                completed={Number(higherRank?.current_min_qv_per_customer)}
                status={Number(higherRank?.current_min_qv_per_customer) >= Number(higherRank?.required_customers)}
              />
            </Stack>

            {/* ── Calendario mesi ── */}
            {monthEntries.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#6B5E54", mb: 0.8 }}>
                  {t("affiliate_dashboard.monthly_qualification_status")}
                </Typography>
                <Grid container spacing={0.5}>
                  {monthEntries.map((ok, i) => (
                    <Grid item xs={3} key={i}>
                      <Box
                        sx={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          gap: 0.5, py: 0.6, borderRadius: 1.5,
                          bgcolor: ok ? alpha("#43A047", 0.08) : alpha("#E53935", 0.04),
                          border: `1px solid ${ok ? alpha("#43A047", 0.15) : alpha("#E53935", 0.08)}`,
                        }}
                      >
                        <Iconify
                          icon={ok ? "mdi:check-circle" : "mdi:close-circle-outline"}
                          width={13}
                          sx={{ color: ok ? "#43A047" : "#ddd" }}
                        />
                        <Typography sx={{ fontSize: "0.62rem", fontWeight: 600, color: ok ? "#43A047" : "#bbb" }}>
                          M{i + 1}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* ── Mesi consecutivi bonus ── */}
            {higherRank?.consecutive_months_bonus_trigger > 0 && (
              <Box sx={{ mt: 1 }}>
                <Item
                  title={t("affiliate_dashboard.eligibility_period_for_additional_bonus")}
                  required={Number(higherRank?.consecutive_months_bonus_trigger)}
                  completed={Number(higherRank?.consecutive_months_completed)}
                  status={Number(higherRank?.consecutive_months_completed) >= Number(higherRank?.consecutive_months_bonus_trigger)}
                />
              </Box>
            )}
          </>
        }
      />
    </Box>
  );
};

export default Progress;
