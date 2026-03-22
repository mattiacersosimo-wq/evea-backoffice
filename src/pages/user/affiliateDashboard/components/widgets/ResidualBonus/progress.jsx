import React from "react";
import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Item from "../rankProgressBar/item";
import CommissionDetails from "./commission_details";
import { useTranslation } from "react-i18next";
import LevelDetails from "./level_details";
import Iconify from "src/components/Iconify";

const ORO = "#B8963B";

const Progress = ({ higherRank, state }) => {
  const { t } = useTranslation();
  if (!higherRank) return null;

  return (
    <Box>
      {/* ── Rank + Unlocked levels header ── */}
      <Box
        sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          p: 1.5, mb: 2, borderRadius: 2,
          bgcolor: alpha(ORO, 0.04), border: `1px solid ${alpha(ORO, 0.1)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:shield-star" width={20} sx={{ color: ORO }} />
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#6B5E54" }}>
            {t("affiliate_dashboard.current_rank")}
          </Typography>
          <Chip
            label={higherRank?.current_rank || "—"}
            size="small"
            sx={{ height: 24, fontWeight: 700, bgcolor: alpha(ORO, 0.12), color: ORO, fontSize: "0.8rem" }}
          />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          {higherRank?.current_percentage != null && (
            <Chip
              label={`${higherRank.current_percentage}%`}
              size="small"
              sx={{ height: 22, fontWeight: 700, bgcolor: alpha("#43A047", 0.1), color: "#43A047", fontSize: "0.75rem" }}
            />
          )}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="mdi:layers-outline" width={16} sx={{ color: "#6B5E54" }} />
            <Typography sx={{ fontSize: "0.75rem", color: "#6B5E54" }}>
              {t("affiliate_dashboard.unlocked_levels")}: <strong>{higherRank?.unlocked_levels ?? "—"}</strong>
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* ── PQV ── */}
      <Item
        title={t("affiliate_dashboard.personal_qualifying_volume")}
        required={Number(higherRank?.minimum_pqv)}
        completed={Number(higherRank?.current_pqv)}
        status={Number(higherRank?.current_pqv) >= Number(higherRank?.minimum_pqv)}
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

      <LevelDetails levels={higherRank?.level_bonus_summary} />
    </Box>
  );
};

export default Progress;
