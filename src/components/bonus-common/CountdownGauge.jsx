import React from "react";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";

// CountdownGauge: box countdown per periodi di qualifica MVP/RockSolid.
// Mostra giorni rimanenti + LinearProgress + label giorni passati/totali.
// Colori dinamici: verde (>7gg rimasti), arancione (<=7gg = urgente), rosso (scaduto).
//
// Props:
// - currentDay: giorni gia' passati (0..totalDays)
// - totalDays: durata totale del periodo (default 30)
// - isExpired: bool, force stato "scaduto" anche se remainingDays > 0
// - title: string, label sopra il countdown (es. "Giorni qualifica MVP")
// - accentColor: colore del widget host (usato per stato "normal")
// - urgentThreshold: giorni sotto cui diventa "urgente" (default 7)
// - expiredLabel: testo custom quando scaduto (default "Scaduto")

const ORO = "#B8963B";
const URGENT_COLOR = "#FF9800";
const EXPIRED_COLOR = "#E53935";

const CountdownGauge = ({
  currentDay = 0,
  totalDays = 30,
  isExpired = false,
  title = "Giorni rimanenti",
  accentColor = ORO,
  urgentThreshold = 7,
  expiredLabel = "Scaduto",
}) => {
  const remainingDays = Math.max(totalDays - currentDay, 0);
  const daysPct = totalDays > 0 ? Math.min((currentDay / totalDays) * 100, 100) : 0;
  const isUrgent = !isExpired && remainingDays <= urgentThreshold && remainingDays > 0;
  const color = isExpired ? EXPIRED_COLOR : isUrgent ? URGENT_COLOR : accentColor;
  const icon = isExpired ? "mdi:timer-off" : "mdi:timer-outline";

  return (
    <Box sx={{
      p: 2, borderRadius: 2,
      bgcolor: alpha(color, 0.04),
      border: `1px solid ${alpha(color, 0.15)}`,
    }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={icon} width={20} sx={{ color }} />
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#2C1A0E" }}>
            {title}
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color }}>
          {isExpired ? expiredLabel : `${remainingDays}g`}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={daysPct}
        sx={{
          height: 6, borderRadius: 3,
          bgcolor: "#eee",
          "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
        }}
      />
      <Typography sx={{ fontSize: "0.65rem", color: "#999", mt: 0.5, textAlign: "right" }}>
        {currentDay} / {totalDays} giorni
      </Typography>
    </Box>
  );
};

export default CountdownGauge;
