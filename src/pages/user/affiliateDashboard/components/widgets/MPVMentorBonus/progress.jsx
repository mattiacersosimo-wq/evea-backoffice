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
import Iconify from "src/components/Iconify";
import { useTranslation } from "react-i18next";

const BinaryCheck = ({ label, value }) => {
  const ok = Number(value) >= 1;
  return (
    <Box
      sx={{
        display: "flex", alignItems: "center", gap: 1.5,
        py: 1, px: 1, borderRadius: 2,
        "&:hover": { bgcolor: "#fafafa" },
      }}
    >
      <Box
        sx={{
          width: 34, height: 34, borderRadius: "50%",
          bgcolor: ok ? alpha("#43A047", 0.1) : alpha("#E53935", 0.1),
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Iconify
          icon={ok ? "mdi:check-bold" : "mdi:close"}
          width={18}
          sx={{ color: ok ? "#43A047" : "#E53935" }}
        />
      </Box>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#2C1A0E" }}>
        {label}
      </Typography>
      <Chip
        label={ok ? "Yes" : "No"}
        size="small"
        sx={{
          ml: "auto", height: 22,
          bgcolor: ok ? alpha("#43A047", 0.1) : alpha("#E53935", 0.1),
          color: ok ? "#43A047" : "#E53935",
          fontWeight: 700, fontSize: "0.7rem",
        }}
      />
    </Box>
  );
};

const Progress = ({ higherRank }) => {
  const { t } = useTranslation();
  if (!higherRank) return null;

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
      <BinaryCheck label={t("affiliate_dashboard.direct_promoter_assigned")} value={higherRank?.has_direct_promoter} />
      <BinaryCheck label={t("affiliate_dashboard.mvp_status_attained_through_direct_promoter")} value={higherRank?.has_mvp_downline} />
    </Box>
  );
};

export default Progress;
