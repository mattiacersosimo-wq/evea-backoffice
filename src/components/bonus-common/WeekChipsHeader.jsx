import React from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";

// WeekChipsHeader: header standard per widget bonus weekly. Mostra due box
// affiancati con "Settimana corrente" (ancora aggiornabile) e "In approvazione"
// (settimane precedenti cristallizzate, in coda per auto-approve).
//
// Uso:
//   <WeekChipsHeader
//     currentAmount={12.50}
//     previousInApprovalAmount={48.30}
//     accentColor="#B8963B"
//     extraBox={{ label: "Reclutamenti mese", value: 5 }}
//   />
//
// Props:
// - currentAmount: numerico, importo settimana in corso (verde, dinamico)
// - previousInApprovalAmount: numerico, importo settimane chiuse pending pagamento
// - accentColor: colore brand del widget (default oro)
// - extraBox: {label, value} opzionale — 3° box (es. reclutamenti mese in FastStart)
// - cycle: "weekly" | "monthly" — cambia le label ("Settimana"/"Mese")

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const WeekChipsHeader = ({
  currentAmount = 0,
  previousInApprovalAmount = 0,
  accentColor = ORO,
  extraBox = null,
  cycle = "weekly",
}) => {
  const { t } = useTranslation();
  const isWeekly = cycle === "weekly";
  const currentLabel = isWeekly
    ? t("bonus_widgets.week_chips.current_week", "Settimana corrente")
    : t("bonus_widgets.week_chips.current_month", "Mese corrente");
  const previousLabel = t("bonus_widgets.week_chips.in_approval", "In approvazione");
  const currentTooltip = isWeekly
    ? t("bonus_widgets.week_chips.tooltip_current_week", "Bonus maturato questa settimana (lun-dom). Importo aggiornato ogni sera per Dynamic Compression; cristallizzato domenica sera.")
    : t("bonus_widgets.week_chips.tooltip_current_month", "Bonus maturato questo mese. Ancora aggiornabile fino a fine mese.");
  const previousTooltip = isWeekly
    ? t("bonus_widgets.week_chips.tooltip_previous_week", "Bonus di settimane precedenti, cristallizzati. Pagamento automatico dopo 15 giorni dalla creazione.")
    : t("bonus_widgets.week_chips.tooltip_previous_month", "Bonus di mesi precedenti in coda per pagamento (15 giorni).");

  return (
    <Stack direction="row" spacing={1.5} sx={{ mb: 1 }}>
      <Tooltip title={currentTooltip} arrow>
        <Box sx={{
          flex: 1, p: 1.25, borderRadius: 2,
          bgcolor: alpha(accentColor, 0.06),
          border: `1px solid ${alpha(accentColor, 0.18)}`,
          cursor: "help",
        }}>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.3 }}>
            <Iconify icon="mdi:calendar-clock" width={13} sx={{ color: accentColor }} />
            <Typography sx={{ fontSize: "0.68rem", color: MUTED, fontWeight: 600 }}>
              {currentLabel}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: accentColor, lineHeight: 1.2 }}>
            €{Number(currentAmount || 0).toFixed(2)}
          </Typography>
        </Box>
      </Tooltip>

      <Tooltip title={previousTooltip} arrow>
        <Box sx={{
          flex: 1, p: 1.25, borderRadius: 2,
          bgcolor: "#FFF8E7",
          border: "1px solid #F0DFB4",
          cursor: "help",
        }}>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.3 }}>
            <Iconify icon="mdi:clock-outline" width={13} sx={{ color: "#B8863B" }} />
            <Typography sx={{ fontSize: "0.68rem", color: MUTED, fontWeight: 600 }}>
              {previousLabel}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: "#8B6A1F", lineHeight: 1.2 }}>
            €{Number(previousInApprovalAmount || 0).toFixed(2)}
          </Typography>
        </Box>
      </Tooltip>

      {extraBox && (
        <Box sx={{
          flex: 1, p: 1.25, borderRadius: 2,
          bgcolor: "#fafaf5",
          border: "1px solid #f0ece6",
        }}>
          <Typography sx={{ fontSize: "0.68rem", color: MUTED, fontWeight: 600, mb: 0.3 }}>
            {extraBox.label}
          </Typography>
          <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: ESPRESSO, lineHeight: 1.2 }}>
            {extraBox.value}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default WeekChipsHeader;
