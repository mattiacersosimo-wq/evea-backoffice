import { Box, Card, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import useFounderStatus from "src/hooks/useFounderStatus";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const FounderCountdown = () => {
  const { i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const {
    pre_launch_active: preActive,
    slots_total: total,
    slots_taken: taken,
    slots_available: avail,
    days_to_launch: daysToLaunch,
    is_founder: isFounder,
  } = useFounderStatus();

  if (!preActive && daysToLaunch === 0) return null;

  // Giorni al 1° giugno 2026 (apertura pre-lancio)
  const preLaunchStart = new Date("2026-06-01T00:00:00");
  const msInDay = 1000 * 60 * 60 * 24;
  const daysToPreLaunch = Math.max(0, Math.ceil((preLaunchStart - new Date()) / msInDay));

  const percent = total ? Math.round((taken / total) * 100) : 0;

  return (
    <Card
      sx={{
        p: 2.5, mb: 2, borderRadius: 3,
        background: `linear-gradient(135deg, ${ESPRESSO} 0%, #3D2510 100%)`,
        color: "#FAF6EF", position: "relative", overflow: "hidden",
        border: `1px solid ${alpha(ORO, 0.25)}`,
      }}
    >
      <Box sx={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", bgcolor: alpha(ORO, 0.1) }} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ position: "relative", zIndex: 1 }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <Iconify icon="mdi:trophy-variant" width={22} sx={{ color: ORO }} />
            <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 400, fontStyle: "italic", color: ORO, letterSpacing: 0.5 }}>
              {isFounder ? (isIt ? "Sei un Founder EVEA" : "You are an EVEA Founder") : (isIt ? "Programma Founder EVEA" : "EVEA Founder Program")}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: "0.82rem", color: alpha("#FAF6EF", 0.7), lineHeight: 1.4 }}>
            {preActive
              ? isIt
                ? `Lancio ufficiale EVEA tra ${daysToLaunch} giorni — 1° settembre 2026`
                : `Official launch in ${daysToLaunch} days — September 1, 2026`
              : isIt
                ? `Pre-lancio tra ${daysToPreLaunch} giorni · 1° giugno 2026`
                : `Pre-launch in ${daysToPreLaunch} days · June 1, 2026`}
          </Typography>
        </Box>
        <Box sx={{ minWidth: 110, textAlign: "right" }}>
          <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: ORO, letterSpacing: "-0.5px", lineHeight: 1 }}>
            {taken}/{total}
          </Typography>
          <Typography sx={{ fontSize: "0.68rem", color: alpha("#FAF6EF", 0.55), letterSpacing: 1.2 }}>
            {isIt ? "FOUNDERS ISCRITTI" : "FOUNDERS JOINED"}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ mt: 1.8, position: "relative", zIndex: 1 }}>
        <LinearProgress
          variant="determinate" value={percent}
          sx={{
            height: 6, borderRadius: 3, bgcolor: alpha("#FAF6EF", 0.08),
            "& .MuiLinearProgress-bar": { bgcolor: ORO, borderRadius: 3 },
          }}
        />
        <Typography sx={{ fontSize: "0.7rem", color: alpha("#FAF6EF", 0.6), mt: 0.6 }}>
          {avail > 0
            ? (isIt ? `${avail} slot rimasti su ${total}` : `${avail} slots left of ${total}`)
            : (isIt ? "Programma esaurito — tutti i 100 slot assegnati" : "Sold out — all 100 slots taken")}
        </Typography>
      </Box>
    </Card>
  );
};

export default FounderCountdown;

export const FounderChip = ({ compact = false }) => {
  const { is_founder: isFounder } = useFounderStatus();
  if (!isFounder) return null;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex", alignItems: "center", gap: 0.6,
        px: compact ? 1 : 1.4, py: compact ? 0.3 : 0.5,
        borderRadius: 1.5,
        background: `linear-gradient(135deg, #F0D480 0%, ${ORO} 100%)`,
        color: ESPRESSO,
        fontSize: compact ? "0.6rem" : "0.7rem", fontWeight: 800, letterSpacing: 1.2,
        border: `1px solid ${alpha(ESPRESSO, 0.25)}`,
        boxShadow: `0 1px 3px ${alpha(ORO, 0.4)}`,
        whiteSpace: "nowrap",
      }}
    >
      <Iconify icon="mdi:crown" width={compact ? 12 : 14} />
      FOUNDER
    </Box>
  );
};
