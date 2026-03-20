import React from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";

const ORO = "#B8963B";

const NewRankCard = ({ higherRank }) => {
  if (!higherRank) return null;
  const ranks = higherRank?.ranks || higherRank;
  if (!Array.isArray(ranks) || !ranks.length) return null;

  return (
    <Grid container spacing={1.5}>
      {ranks
        .filter((r) => r?.is_display !== 0)
        .map((rank, i) => {
          const achieved = rank?.is_achive === 1;
          return (
            <Grid item xs={6} sm={4} md={3} key={rank?.id || i}>
              <Box
                sx={{
                  p: 1.5, borderRadius: 2, textAlign: "center",
                  bgcolor: achieved ? alpha(ORO, 0.08) : "#fafafa",
                  border: achieved ? `1.5px solid ${ORO}` : "1.5px solid #eee",
                  position: "relative", transition: "all 0.2s",
                }}
              >
                {achieved && (
                  <Iconify icon="mdi:check-circle" width={16} sx={{ position: "absolute", top: 6, right: 6, color: "#43A047" }} />
                )}
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: achieved ? "#2C1A0E" : "#bbb" }}>
                  {rank?.rank_name}
                </Typography>
                {rank?.bonus_amount > 0 && (
                  <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: achieved ? ORO : "#ccc", mt: 0.3 }}>
                    €{rank.bonus_amount}
                  </Typography>
                )}
                {rank?.achieved_count > 0 && (
                  <Chip label={`x${rank.achieved_count}`} size="small" sx={{ mt: 0.5, height: 18, fontSize: "0.6rem", bgcolor: alpha(ORO, 0.1), color: ORO }} />
                )}
              </Box>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default NewRankCard;
