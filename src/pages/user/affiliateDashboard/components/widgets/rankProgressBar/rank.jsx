import React, { useState } from "react";
import { Box, Chip, Collapse, Grid, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import NextRankDetails from "./nextRankDetails";
import SixtyPercentRule from "./sixtyPercentRule/sixtyPercentRule";
import { useTranslation } from "react-i18next";

const ORO = "#B8963B";

const NewRankCard = ({ higherRank, state }) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState(null);

  if (!higherRank || !Array.isArray(higherRank) || !higherRank.length) return null;

  const currentIndex = higherRank.findIndex((r) => r.current_rank === 1);
  const allRanks = higherRank.map((rank, i) => ({
    ...rank,
    achieved: i <= currentIndex ? 1 : 0,
  }));

  return (
    <Box sx={{ mt: 2 }}>
      {/* ── Step bar ── */}
      <Box sx={{ position: "relative", mb: 3, px: 2 }}>
        {/* connector line */}
        <Box
          sx={{
            position: "absolute",
            top: 16, left: 40, right: 40, height: 3,
            bgcolor: "#eee", zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 16, left: 40, height: 3,
            width: `${currentIndex >= 0 ? Math.round((currentIndex / Math.max(allRanks.length - 1, 1)) * 100) : 0}%`,
            maxWidth: "calc(100% - 80px)",
            bgcolor: ORO, zIndex: 1,
            borderRadius: 2,
          }}
        />
        <Stack direction="row" justifyContent="space-between" sx={{ position: "relative", zIndex: 2 }}>
          {allRanks.map((rank, i) => {
            const isCurrent = rank.current_rank === 1;
            const achieved = rank.achieved === 1;
            return (
              <Box
                key={rank.id || i}
                sx={{ textAlign: "center", flex: 1, cursor: "pointer" }}
                onClick={() => setExpandedId(expandedId === rank.id ? null : rank.id)}
              >
                <Box
                  sx={{
                    width: 32, height: 32, borderRadius: "50%", mx: "auto",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "0.65rem", transition: "all 0.3s",
                    ...(isCurrent
                      ? { bgcolor: ORO, color: "#fff", boxShadow: `0 0 0 4px ${alpha(ORO, 0.2)}` }
                      : achieved
                      ? { bgcolor: ORO, color: "#fff" }
                      : { bgcolor: "#f0f0f0", color: "#bbb" }),
                  }}
                >
                  {achieved ? <Iconify icon="mdi:check" width={16} /> : i + 1}
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.58rem", fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? ORO : achieved ? "#2C1A0E" : "#bbb",
                    mt: 0.5, lineHeight: 1.2,
                  }}
                  noWrap
                >
                  {rank.rank_name}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* ── Expanded rank details ── */}
      {allRanks.map((rank) => (
        <Collapse key={rank.id} in={expandedId === rank.id} unmountOnExit>
          <Box sx={{ mb: 2, border: "1px solid #f0ece6", borderRadius: 2, p: 2, bgcolor: "#fafafa" }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
              <Typography sx={{ fontWeight: 700, color: "#2C1A0E", fontSize: "0.9rem" }}>
                {rank.rank_name}
              </Typography>
              {rank.current_rank === 1 && (
                <Chip label="Current" size="small" sx={{ height: 20, bgcolor: alpha(ORO, 0.1), color: ORO, fontWeight: 700, fontSize: "0.65rem" }} />
              )}
              {rank.achieved === 1 && rank.current_rank !== 1 && (
                <Chip label="Achieved" size="small" sx={{ height: 20, bgcolor: alpha("#43A047", 0.1), color: "#43A047", fontWeight: 700, fontSize: "0.65rem" }} />
              )}
            </Stack>
            <NextRankDetails current_rank_details={rank.current_rank_details} />
            <SixtyPercentRule state={state} team_wise_users={rank.team_wise_users} />
          </Box>
        </Collapse>
      ))}
    </Box>
  );
};

export default NewRankCard;
