import React from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import LevelDetails from "./level_details";

const ORO = "#B8963B";

const Progress = ({ higherRank, state }) => {
  const { t } = useTranslation();
  if (!higherRank) return null;

  return (
    <Box>
      {/* ── Rank badge ── */}
      <Box
        sx={{
          display: "flex", alignItems: "center",
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
      </Box>

      <LevelDetails state={state} levels={higherRank?.level_bonus_summary} />
    </Box>
  );
};

export default Progress;
