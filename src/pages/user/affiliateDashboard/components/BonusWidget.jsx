import React, { useState } from "react";
import { Box, Card, Chip, Collapse, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

const BonusWidget = ({ icon, title, color = ORO, badge, expired, children }) => {
  const [open, setOpen] = useState(false);
  const c = color || ORO;

  return (
    <Card
      sx={{
        borderRadius: 3, bgcolor: "#fff", overflow: "hidden",
        border: `1px solid ${alpha(c, 0.15)}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        height: "100%", display: "flex", flexDirection: "column",
      }}
    >
      {/* ── Header ── */}
      <Box
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          display: "flex", alignItems: "center", gap: 1.2,
          p: "0.8rem 1.2rem", cursor: "pointer",
          borderBottom: open ? `1px solid ${alpha(c, 0.08)}` : "1px solid transparent",
          transition: "border-color 0.2s",
          "&:hover": { bgcolor: alpha(c, 0.02) },
        }}
      >
        <Box
          sx={{
            width: 30, height: 30, borderRadius: 1.5, flexShrink: 0,
            bgcolor: alpha(c, 0.08),
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Iconify icon={icon || "mdi:star-outline"} width={16} sx={{ color: c }} />
        </Box>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: ESPRESSO, flex: 1 }} noWrap>
          {title}
        </Typography>
        {badge && (
          <Chip label={badge} size="small" sx={{ height: 20, fontSize: "0.6rem", fontWeight: 700, bgcolor: alpha(c, 0.1), color: c }} />
        )}
        {expired && (
          <Chip label="Expired" size="small" sx={{ height: 20, fontSize: "0.6rem", fontWeight: 700, bgcolor: alpha("#E53935", 0.1), color: "#E53935" }} />
        )}
        <Iconify
          icon="mdi:chevron-down"
          width={18}
          sx={{
            color: "#bbb", flexShrink: 0,
            transition: "transform 0.3s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Box>

      {/* ── Content ── */}
      <Collapse in={open} unmountOnExit>
        <Box sx={{ p: "0.8rem 1.2rem" }}>
          {children}
        </Box>
      </Collapse>
    </Card>
  );
};

export default BonusWidget;
