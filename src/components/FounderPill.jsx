import { Box, Tooltip } from "@mui/material";
import PropTypes from "prop-types";

/**
 * Pill orizzontale "Founder EVEA" a 2 righe — gradiente espresso + bordo oro.
 * Mostra il numero progressivo se founder_number è valorizzato.
 */
const FounderPill = ({ number = null, showTooltip = true }) => {
  const numStr = number != null && number !== 0 ? String(number).padStart(3, "0") : null;

  const pill = (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: "14px",
        py: "5px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, #3A2510, #1E0E05)",
        border: "1px solid #B8963B",
        gap: "1px",
        cursor: "default",
        lineHeight: 1,
        boxShadow: "0 2px 6px rgba(46,26,14,0.25)",
        whiteSpace: "nowrap",
      }}
    >
      <Box
        component="span"
        sx={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#D4A84B",
          letterSpacing: "0.06em",
        }}
      >
        Founder EVEA
      </Box>
      <Box
        component="span"
        sx={{
          fontSize: "10px",
          color: "rgba(250,246,239,0.55)",
          letterSpacing: "0.08em",
        }}
      >
        {numStr && (
          <Box component="span" sx={{ color: "#B8963B", fontWeight: 700, mr: "4px" }}>
            #{numStr}
          </Box>
        )}
        {numStr ? "· FIRST 100" : "FIRST 100"}
      </Box>
    </Box>
  );

  if (!showTooltip) return pill;

  return (
    <Tooltip
      title={
        <Box sx={{ textAlign: "center", lineHeight: 1.5 }}>
          <Box sx={{ fontWeight: 700, color: "#B8963B", fontSize: "0.8rem" }}>Founder EVEA</Box>
          <Box sx={{ fontSize: "0.72rem", opacity: 0.9 }}>Membro fondatore</Box>
          <Box sx={{ fontSize: "0.68rem", opacity: 0.7, mt: 0.3 }}>Pre-lancio 2026</Box>
        </Box>
      }
      arrow
      placement="top"
    >
      {pill}
    </Tooltip>
  );
};

FounderPill.propTypes = {
  number: PropTypes.number,
  showTooltip: PropTypes.bool,
};

export default FounderPill;
