import React, { useState } from "react";
import {
  Box,
  Chip,
  Collapse,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import { useTranslation } from "react-i18next";

const ORO = "#B8963B";

const SixtyPercentRule = ({ team_wise_users = [], state }) => {
  const [open, setOpen] = useState(false);
  const { data, ...dataProps } = state;
  const { t } = useTranslation();

  if (!team_wise_users || !team_wise_users.length) return null;

  // Find the max contributor
  const maxPct = Math.max(...team_wise_users.map((u) => Number(u?.contribution_percentage) || 0), 0);
  const isViolating = maxPct > 60;

  return (
    <Box sx={{ mt: 2 }}>
      {/* ── Header clickable ── */}
      <Box
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          p: 1.5, borderRadius: 2, cursor: "pointer",
          bgcolor: isViolating ? alpha("#E53935", 0.04) : alpha(ORO, 0.04),
          border: `1px solid ${isViolating ? alpha("#E53935", 0.15) : alpha(ORO, 0.12)}`,
          "&:hover": { bgcolor: isViolating ? alpha("#E53935", 0.07) : alpha(ORO, 0.07) },
          transition: "background 0.2s",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify
            icon={isViolating ? "mdi:alert-circle" : "mdi:scale-balance"}
            width={18}
            sx={{ color: isViolating ? "#E53935" : ORO }}
          />
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#2C1A0E" }}>
            {t("affiliate_dashboard.sixty_percent_rule")}
          </Typography>
          <Chip
            label={isViolating ? `Max ${maxPct.toFixed(0)}% — Sbilanciato` : `Max ${maxPct.toFixed(0)}% — OK`}
            size="small"
            sx={{
              height: 20, fontSize: "0.6rem", fontWeight: 700,
              bgcolor: isViolating ? alpha("#E53935", 0.1) : alpha("#43A047", 0.1),
              color: isViolating ? "#E53935" : "#43A047",
            }}
          />
        </Stack>
        <Iconify
          icon="mdi:chevron-down"
          width={20}
          sx={{
            color: "#999",
            transition: "transform 0.3s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Box>

      <Collapse in={open} unmountOnExit>
        {/* ── Visual bars ── */}
        <Box sx={{ mt: 1.5, mb: 1 }}>
          {team_wise_users.map((item, i) => {
            const pct = Number(item?.contribution_percentage) || 0;
            const over = pct > 60;
            return (
              <Box key={item?.id || i} sx={{ mb: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.3}>
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#2C1A0E" }}>
                      {item?.team_name}
                    </Typography>
                    {item?.leg_user_name && (
                      <Typography sx={{ fontSize: "0.6rem", color: "#999" }}>
                        ({item.leg_user_name})
                      </Typography>
                    )}
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: over ? "#E53935" : "#2C1A0E" }}>
                      {pct.toFixed(1)}%
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem", color: "#999" }}>
                      GV {item?.gv_taken}
                    </Typography>
                  </Stack>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(pct, 100)}
                  sx={{
                    height: 6, borderRadius: 3,
                    bgcolor: "#f0ece6",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                      bgcolor: over ? "#E53935" : pct > 50 ? "#FF9800" : ORO,
                    },
                  }}
                />
                {/* 60% threshold line */}
                <Box sx={{ position: "relative", height: 0 }}>
                  <Box
                    sx={{
                      position: "absolute", top: -6, left: "60%",
                      width: "1px", height: 6, bgcolor: alpha("#E53935", 0.4),
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* table removed — visual bars above are sufficient */}
      </Collapse>
    </Box>
  );
};

export default SixtyPercentRule;
