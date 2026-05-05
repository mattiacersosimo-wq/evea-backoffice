import React from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import { useTranslation } from "react-i18next";

const ORO = "#B8963B";

const Progress = ({ higherRank = [], state }) => {
  const { t } = useTranslation();
  const ranks = higherRank?.ranks || [];

  if (!ranks.length) return null;

  return (
    <Box>
      <Grid container spacing={1.5}>
        {ranks
          .filter((r) => r?.is_display === 1)
          .map((rank, i) => {
            const achieved = rank?.is_achieved === 1;
            return (
              <Grid item xs={6} sm={4} md={3} key={i}>
                <Box
                  sx={{
                    p: 1.5, borderRadius: 2, textAlign: "center",
                    bgcolor: achieved ? alpha("#43A047", 0.06) : "#fafafa",
                    border: achieved ? "1.5px solid #43A047" : "1.5px solid #eee",
                    position: "relative",
                  }}
                >
                  {achieved && (
                    <Iconify icon="mdi:check-circle" width={16} sx={{ position: "absolute", top: 6, right: 6, color: "#43A047" }} />
                  )}
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: achieved ? "#2C1A0E" : "#999" }}>
                    {rank?.rank_name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: achieved ? "#43A047" : "#ccc", mt: 0.3 }}>
                    €{rank?.bonus_amount || 0}
                  </Typography>
                  {rank?.is_evolving_bonus_achived === 1 && (
                    <Chip label="Evolving" size="small" sx={{ mt: 0.5, height: 18, fontSize: "0.58rem", bgcolor: alpha("#43A047", 0.1), color: "#43A047" }} />
                  )}
                  {rank?.achieved_count > 0 && (
                    <Chip label={`x${rank.achieved_count}`} size="small" sx={{ mt: 0.5, ml: 0.5, height: 18, fontSize: "0.58rem", bgcolor: alpha(ORO, 0.1), color: ORO }} />
                  )}
                </Box>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default Progress;
