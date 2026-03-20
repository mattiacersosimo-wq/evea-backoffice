import React from "react";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Level_One from "./level_one";
import Level_Two from "./level_two";
import Ternary from "src/components/ternary";
import Iconify from "src/components/Iconify";
import { useTranslation } from "react-i18next";

const ORO = "#B8963B";

const GenCard = ({ label, ok, children }) => (
  <Box
    sx={{
      p: 1.5, borderRadius: 2, height: "100%",
      bgcolor: ok ? alpha("#43A047", 0.03) : "#fafafa",
      border: `1px solid ${ok ? alpha("#43A047", 0.15) : "#eee"}`,
    }}
  >
    <Stack direction="row" alignItems="center" spacing={0.8} mb={1}>
      <Iconify
        icon={ok ? "mdi:check-circle" : "mdi:circle-outline"}
        width={18}
        sx={{ color: ok ? "#43A047" : "#ddd" }}
      />
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#2C1A0E" }}>
        {label}
      </Typography>
      <Chip
        label={ok ? "Qualified" : "Not yet"}
        size="small"
        sx={{
          ml: "auto", height: 20, fontSize: "0.6rem", fontWeight: 700,
          bgcolor: ok ? alpha("#43A047", 0.1) : alpha("#E53935", 0.08),
          color: ok ? "#43A047" : "#E53935",
        }}
      />
    </Stack>
    {children}
  </Box>
);

const Progress = ({ higherRank, state }) => {
  const { t } = useTranslation();
  if (!higherRank) return null;

  const eligible = higherRank?.is_user_eligible === 1;

  return (
    <Box>
      {/* ── Eligibility + Rank ── */}
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Iconify
          icon={eligible ? "mdi:check-circle" : "mdi:close-circle"}
          width={20}
          sx={{ color: eligible ? "#43A047" : "#E53935" }}
        />
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#2C1A0E" }}>
          {t("affiliate_dashboard.eligible")}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Chip
          label={higherRank?.current_rank?.rank_name || "—"}
          size="small"
          sx={{ height: 22, fontWeight: 600, bgcolor: alpha(ORO, 0.1), color: ORO, fontSize: "0.75rem" }}
        />
      </Stack>

      {/* ── Gen1 / Gen2 affiancate ── */}
      <Ternary
        when={eligible}
        then={
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={6}>
              <GenCard label={t("affiliate_dashboard.generation_1")} ok={higherRank?.eligibility?.gen_1 === 1}>
                <Level_One state={state} level_one={higherRank?.level_1} />
              </GenCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <GenCard label={t("affiliate_dashboard.generation_2")} ok={higherRank?.eligibility?.gen_2 === 1}>
                <Level_Two state={state} level_two={higherRank?.level_2} />
              </GenCard>
            </Grid>
          </Grid>
        }
      />
    </Box>
  );
};

export default Progress;
