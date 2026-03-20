import {
  Box,
  Card,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import Iconify from "src/components/Iconify";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const WARM = "#6B5E54";

/**
 * Shared wrapper for all bonus widgets.
 * Props:
 *  - title: string
 *  - icon: Iconify icon string
 *  - color: accent color for the widget
 *  - pending: pending commission amount (shown prominently)
 *  - prevMonth: previous month commission
 *  - expired: boolean
 *  - children: the progress/details content
 *  - defaultOpen: boolean
 *  - noPending: hide pending section (for widgets without commissions)
 */
const BonusCard = ({
  title,
  icon = "mdi:star-outline",
  color = ORO,
  pending,
  prevMonth,
  expired,
  children,
  defaultOpen = false,
  noPending = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card
      sx={{
        borderRadius: 3,
        bgcolor: "#fff",
        border: "1px solid #f0ece6",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* color accent top */}
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, bgcolor: color }} />

      <Box
        onClick={() => setOpen((p) => !p)}
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          "&:hover": { bgcolor: "#fafafa" },
          transition: "background 0.2s",
          position: "relative",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: alpha(color, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Iconify icon={icon} width={20} sx={{ color }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ color: ESPRESSO, fontSize: "0.85rem" }}
                noWrap
              >
                {title}
              </Typography>
              {expired && (
                <Chip
                  label="Expired"
                  size="small"
                  color="error"
                  sx={{ height: 20, fontSize: "0.6rem" }}
                />
              )}
            </Stack>
          </Box>
        </Stack>

        {/* pending amount — visible even when collapsed */}
        {!noPending && pending !== undefined && (
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              color: Number(pending) > 0 ? color : "#ccc",
              mr: 1.5,
              flexShrink: 0,
            }}
          >
            €{Number(pending || 0).toFixed(2)}
          </Typography>
        )}

        <IconButton
          size="small"
          sx={{
            transition: "transform 0.3s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: WARM,
            flexShrink: 0,
          }}
        >
          <Iconify icon="mdi:chevron-down" width={22} />
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Divider />
        {/* prev month line */}
        {!noPending && prevMonth > 0 && (
          <Box sx={{ px: 2.5, pt: 1.5 }}>
            <Typography sx={{ fontSize: "0.72rem", color: WARM }}>
              Mese precedente: <b>€{Number(prevMonth).toFixed(2)}</b>
            </Typography>
          </Box>
        )}
        <Box sx={{ p: 2.5 }}>{children}</Box>
      </Collapse>
    </Card>
  );
};

export default BonusCard;
