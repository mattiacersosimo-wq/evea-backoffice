import { Tooltip, Box } from "@mui/material";
import PropTypes from "prop-types";

/**
 * Badge "Founder" a forma di scudo — variante scura con gradiente espresso.
 * Usato nel profilo del promoter quando is_founder=true.
 *
 * Props:
 * - number: numero progressivo (1-100) → mostra "#001" e "of 100"; se null mostra "2026"
 * - size: larghezza in px (altezza calcolata con ratio 80:104). Default 80.
 * - showTooltip: mostra tooltip al hover. Default true.
 */
const FounderBadge = ({ number = null, size = 80, showTooltip = true }) => {
  const height = Math.round((size * 104) / 80);
  const logoSrc = "/logo/evea_logo.png";
  const numberStr = number != null ? String(number).padStart(3, "0") : null;
  const centerLabel = numberStr ? `#${numberStr}` : "2026";
  const subLabel = numberStr ? "of 100" : null;

  const svg = (
    <svg
      width={size}
      height={height}
      viewBox="0 0 200 260"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="fbBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3A2510" }} />
          <stop offset="100%" style={{ stopColor: "#1E0E05" }} />
        </linearGradient>
        <linearGradient id="fbLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#8B6A1E", stopOpacity: 0 }} />
          <stop offset="40%" style={{ stopColor: "#D4A84B" }} />
          <stop offset="60%" style={{ stopColor: "#D4A84B" }} />
          <stop offset="100%" style={{ stopColor: "#8B6A1E", stopOpacity: 0 }} />
        </linearGradient>
        <filter id="fbShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Scudo esterno */}
      <path
        d="M100 8 L185 45 L185 140 Q185 205 100 242 Q15 205 15 140 L15 45 Z"
        fill="url(#fbBg)"
        stroke="#B8963B"
        strokeWidth="1.5"
        filter="url(#fbShadow)"
      />
      {/* Scudo interno sottile */}
      <path
        d="M100 18 L175 52 L175 140 Q175 198 100 232 Q25 198 25 140 L25 52 Z"
        fill="none"
        stroke="#B8963B"
        strokeWidth="0.5"
        strokeOpacity="0.35"
      />

      {/* Logo EVEA */}
      <image
        href={logoSrc}
        x="20" y="30" width="160" height="74"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: "brightness(0) invert(1)" }}
      />

      {/* Linea divisore top */}
      <line x1="40" y1="115" x2="160" y2="115" stroke="url(#fbLine)" strokeWidth="0.8" />

      {/* Testo "Founder" italic serif */}
      <text
        x="100" y="142"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="22" fontStyle="italic" fontWeight="300"
        fill="#FAF6EF"
      >
        Founder
      </text>

      {/* Sub "FIRST 100" in oro */}
      <text
        x="100" y="160"
        textAnchor="middle"
        fontFamily="'DM Sans', sans-serif"
        fontSize="9" letterSpacing="3"
        fill="#B8963B"
      >
        FIRST 100
      </text>

      {/* Linea divisore bottom */}
      <line x1="40" y1="173" x2="160" y2="173" stroke="url(#fbLine)" strokeWidth="0.8" />

      {/* Numero o anno */}
      <text
        x="100" y={subLabel ? 194 : 198}
        textAnchor="middle"
        fontFamily={numberStr ? "'DM Mono', 'Courier New', monospace" : "'DM Sans', sans-serif"}
        fontSize={numberStr ? 13 : 9}
        fontWeight={numberStr ? 600 : 400}
        letterSpacing={numberStr ? 1 : 2}
        fill={numberStr ? "#B8963B" : "#FAF6EF"}
        opacity={numberStr ? 1 : 0.45}
      >
        {centerLabel}
      </text>
      {subLabel && (
        <text
          x="100" y="208"
          textAnchor="middle"
          fontFamily="'DM Sans', sans-serif"
          fontSize="7" letterSpacing="2"
          fill="#FAF6EF" opacity="0.45"
        >
          {subLabel}
        </text>
      )}

      {/* Punti decorativi */}
      <circle cx="100" cy="224" r="3" fill="#B8963B" opacity="0.65" />
      <circle cx="88" cy="224" r="1.5" fill="#B8963B" opacity="0.35" />
      <circle cx="112" cy="224" r="1.5" fill="#B8963B" opacity="0.35" />
    </svg>
  );

  if (!showTooltip) return svg;

  return (
    <Tooltip
      title={
        <Box sx={{ textAlign: "center", lineHeight: 1.5 }}>
          <Box sx={{ fontWeight: 700, color: "#B8963B", fontSize: "0.85rem" }}>Founder EVEA</Box>
          <Box sx={{ fontSize: "0.75rem", opacity: 0.9 }}>Membro fondatore</Box>
          <Box sx={{ fontSize: "0.7rem", opacity: 0.7, mt: 0.4 }}>Pre-lancio 2026</Box>
        </Box>
      }
      arrow
      placement="top"
    >
      <Box sx={{ display: "inline-block", cursor: "default" }}>{svg}</Box>
    </Tooltip>
  );
};

FounderBadge.propTypes = {
  number: PropTypes.number,
  size: PropTypes.number,
  showTooltip: PropTypes.bool,
};

export default FounderBadge;
