import {
  Box,
  Collapse,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useState } from "react";
import Iconify from "src/components/Iconify";

const getColor = (pct, isExpired) => {
  if (isExpired) return "#E53935";
  if (pct >= 100) return "#43A047";
  if (pct >= 50) return "#FB8C00";
  return "#E53935";
};

function Item({ title, required, completed, status, is_expired, children }) {
  const [open, setOpen] = useState(false);
  const safeReq = Number(required) || 0;
  const safeComp = Number(completed) || 0;
  const pct = safeReq > 0 ? Math.min(100, Math.max(0, (safeComp / safeReq) * 100)) : 0;
  const color = getColor(pct, is_expired);
  const done = pct >= 100;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          py: 1,
          px: 1,
          borderRadius: 2,
          "&:hover": { bgcolor: "#fafafa" },
          transition: "background 0.2s",
        }}
      >
        {/* semaforo */}
        <Box
          sx={{
            width: 34, height: 34, borderRadius: "50%",
            bgcolor: alpha(color, 0.1), color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: "0.68rem", flexShrink: 0,
          }}
        >
          {done ? <Iconify icon="mdi:check-bold" width={16} /> : `${Math.round(pct)}%`}
        </Box>

        {/* title + bar */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.3 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#2C1A0E", fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: "#6B5E54", fontWeight: 600, flexShrink: 0, ml: 1 }}>
              {safeComp}/{safeReq}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              height: 6, borderRadius: 3,
              bgcolor: alpha(color, 0.12),
              "& .MuiLinearProgress-bar": { borderRadius: 3, bgcolor: color },
            }}
          />
        </Box>

        {/* expand */}
        {children && (
          <IconButton size="small" onClick={() => setOpen(!open)} sx={{ flexShrink: 0, color: "#6B5E54" }}>
            <Iconify icon={open ? "mdi:chevron-up" : "mdi:chevron-down"} width={20} />
          </IconButton>
        )}
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 6.5, pr: 1, pb: 1.5 }}>{children}</Box>
      </Collapse>
    </>
  );
}

export default Item;
