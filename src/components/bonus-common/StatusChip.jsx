import React from "react";
import { Chip, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";

// StatusChip riusabile per commissioni bonus: gestisce sia lo status
// (pending/yes/cancelled/on_hold) sia il countdown auto-approve (giorni
// alla approvazione automatica dopo 15 gg dalla creazione).
//
// Props:
// - status: 'pending' | 'yes' | 'cancelled' | 'on_hold'
// - daysToApprove: intero (0..15) — solo per pending, opzionale
// - context: 'dsb' | 'isb' | 'default' — cambia il tooltip. Solo ISB avvisa
//   di "Dynamic Compression" (frequente); DSB si ricalcola solo se un cliente
//   diventa promoter (evento raro) — tooltip piu' semplice.
// - isCurrentWeek: true se la commissione e' della settimana in corso (ancora
//   ricalcolabile da commission:finalize-isb fino a domenica sera). False =
//   settimana chiusa, importo cristallizzato.
//
// Uso: <StatusChip status="pending" daysToApprove={5} context="isb" isCurrentWeek />

const CHIP_STYLES = {
  yes: { color: "#2E7D32", bg: "#E8F5E9", icon: "mdi:check-circle", label: "Pagato" },
  cancelled: { color: "#C62828", bg: "#FFEBEE", icon: "mdi:close-circle", label: "Annullato" },
  on_hold: { color: "#6A1B9A", bg: "#F3E5F5", icon: "mdi:pause-circle", label: "In sospeso" },
};

const StatusChip = ({ status, daysToApprove, context = "default", isCurrentWeek = false, tooltipMode = "auto", size = "small" }) => {
  const s = String(status || "").toLowerCase();

  if (s === "pending") {
    const days = Number.isFinite(daysToApprove) ? Math.max(0, Math.round(daysToApprove)) : null;
    let color, bg, icon, label, tip;

    if (days === null) {
      color = "#EF6C00"; bg = "#FFF3E0"; icon = "mdi:clock-outline"; label = "In attesa";
      tip = "Commissione in attesa di approvazione automatica (15 gg dalla creazione).";
    } else if (days === 0) {
      color = "#2E7D32"; bg = "#E8F5E9"; icon = "mdi:clock-check"; label = "Oggi";
      tip = "Auto-approvazione entro fine giornata.";
    } else if (days <= 2) {
      color = "#EF6C00"; bg = "#FFF3E0"; icon = "mdi:clock-fast"; label = `${days} gg`;
      tip = `Auto-approvazione tra ${days} giorn${days === 1 ? "o" : "i"}.`;
    } else if (days <= 7) {
      color = "#F57C00"; bg = "#FFF8E1"; icon = "mdi:clock-outline"; label = `${days} gg`;
      tip = `Auto-approvazione tra ${days} giorni.`;
    } else {
      color = "#43A047"; bg = "#F1F8E9"; icon = "mdi:clock-outline"; label = `${days} gg`;
      let ctxNote = "";
      if (isCurrentWeek) {
        if (context === "isb") {
          ctxNote = " Settimana in corso: livello ancora ricalcolabile fino a domenica sera (Dynamic Compression).";
        } else if (context === "dsb") {
          ctxNote = " Settimana in corso: ricalcolo possibile fino a domenica sera se un cliente diventa promoter.";
        } else {
          ctxNote = " Settimana in corso: importo ancora aggiornabile fino a domenica sera.";
        }
      } else {
        ctxNote = " Importo cristallizzato (settimana chiusa).";
      }
      tip = `Auto-approvazione tra ${days} giorni.${ctxNote}`;
    }

    const chip = (
      <Chip
        size={size}
        icon={<Iconify icon={icon} width={14} sx={{ color: `${color} !important`, ml: 0.5 }} />}
        label={label}
        sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700, bgcolor: bg, color, border: `1px solid ${alpha(color, 0.25)}` }}
      />
    );
    return tooltipMode === "off" ? chip : <Tooltip title={tip} arrow>{chip}</Tooltip>;
  }

  const preset = CHIP_STYLES[s];
  if (!preset) {
    return (
      <Chip size={size} label={status || "—"} sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700, bgcolor: "#f0f0f0", color: "#666" }} />
    );
  }
  return (
    <Chip
      size={size}
      icon={<Iconify icon={preset.icon} width={14} sx={{ color: `${preset.color} !important`, ml: 0.5 }} />}
      label={preset.label}
      sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700, bgcolor: preset.bg, color: preset.color, border: `1px solid ${alpha(preset.color, 0.25)}` }}
    />
  );
};

export default StatusChip;
