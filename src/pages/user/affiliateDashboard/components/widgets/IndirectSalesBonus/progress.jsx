import React from "react";
import {
  Box,
  Chip,
  LinearProgress,
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
import { useTranslation } from "react-i18next";
import LevelDetails from "./level_details";

const ORO = "#B8963B";
const LEVEL_COLORS = ["#B8963B", "#C4A54F", "#D4B86A", "#E0C888", "#EBD9A8"];

const Progress = ({ higherRank, state }) => {
  const { t } = useTranslation();
  if (!higherRank) return null;

  const levels = higherRank?.level_bonus_summary || [];

  return (
    <Box>
      <Item
        title={t("affiliate_dashboard.min_personal_qualifying_volume")}
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
              {higherRank?.current_pqv_details?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item?.username}</TableCell>
                  <TableCell align="right">{item?.pv}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Item>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5, px: 1 }}>
        <Typography sx={{ fontSize: "0.8rem", color: "#6B5E54" }}>{t("affiliate_dashboard.current_rank")}:</Typography>
        <Chip label={higherRank?.current_rank || "—"} size="small" sx={{ height: 22, fontWeight: 600, bgcolor: alpha(ORO, 0.1), color: ORO, fontSize: "0.75rem" }} />
      </Box>

      <LevelDetails levels={levels} />
    </Box>
  );
};

export default Progress;
