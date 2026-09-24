import React, { useState } from "react";
import {
  Box, Chip, Collapse, LinearProgress, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";

// LevelCollapsible: card espandibili per livelli/generazioni bonus.
// Usato da ISB (Generazioni), Residual, ResidualMatching.
//
// Props:
// - levels: array di { level: number, users: [{username, total_bonus, ...}], percentage? }
// - title: string — titolo dell'header (es. "Generazioni", "Bonus per Livello")
// - headerIcon: string — icona mdi per l'header (es. "mdi:sitemap-outline")
// - accentColor: string — colore brand del widget (per chip totale)
// - colors: array di colori per i livelli (loopato se piu' livelli che colori)
// - pctMap: {level: "X%"} — percentuali per livello (fallback su level.percentage)
// - prefix: "L" | "G" — prefisso label livello (default "L")
// - itemLabel: "Livello" | "Generazione" — testo header card
// - showTopUser: bool — mostra il top user nel summary (Residual)
// - extraHeaders: [string] — colonne extra tabella dettaglio (es. "Stato" per ISB)
// - extraCells: (user, color) => ReactNode[] — celle extra per ogni user row
// - emptyText: string — testo se livello vuoto

const ESPRESSO = "#2C1A0E";
const ORO = "#B8963B";

const LevelCollapsible = ({
  levels = [],
  title,
  headerIcon = "mdi:layers-outline",
  accentColor = ORO,
  colors = ["#B8963B", "#A0782E", "#8B6A26"],
  pctMap = {},
  prefix = "L",
  itemLabel,
  showTopUser = false,
  extraHeaders = [],
  extraCells = null,
  emptyText,
}) => {
  const { t } = useTranslation();
  const resolvedTitle = title || t("evea.bonus_by_level", "Bonus per Livello");
  const resolvedItemLabel = itemLabel || t("bonus_widgets.residual.level_item", "Livello");
  const resolvedEmptyText = emptyText || t("bonus_widgets.residual.no_users_level", "Nessun utente in questo livello");
  const [expanded, setExpanded] = useState(null);

  if (!levels || !levels.length) return null;

  const totalBonus = levels.reduce((sum, l) => {
    const lt = (l.users || []).reduce((s, u) => s + Number(u.total_bonus || 0), 0);
    return sum + lt;
  }, 0);

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={headerIcon} width={20} sx={{ color: accentColor }} />
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>
            {resolvedTitle}
          </Typography>
        </Stack>
        <Chip
          label={t("bonus_widgets.level_collapsible.total", { amount: totalBonus.toFixed(2), defaultValue: `Totale: €${totalBonus.toFixed(2)}` })}
          size="small"
          sx={{ height: 26, fontWeight: 700, bgcolor: alpha(accentColor, 0.1), color: accentColor, fontSize: "0.78rem" }}
        />
      </Stack>

      <Stack spacing={1}>
        {levels.map((level, idx) => {
          const users = level.users || [];
          const levelTotal = users.reduce((s, u) => s + Number(u.total_bonus || 0), 0);
          const userCount = users.length;
          const pct = totalBonus > 0 ? (levelTotal / totalBonus) * 100 : 0;
          const color = colors[idx] || colors[colors.length - 1];
          const topUser = users.length > 0
            ? users.reduce((a, b) => Number(a.total_bonus) > Number(b.total_bonus) ? a : b)
            : null;
          const isExpanded = expanded === level.level;
          const pctLabel = level.percentage != null
            ? `${level.percentage}%`
            : (pctMap[level.level] || "");

          return (
            <Box key={level.level}>
              <Box
                onClick={() => setExpanded(isExpanded ? null : level.level)}
                sx={{
                  p: 1.5, borderRadius: 2, cursor: "pointer",
                  bgcolor: isExpanded ? alpha(color, 0.06) : "#fafafa",
                  border: `1px solid ${isExpanded ? alpha(color, 0.2) : "#f0ece6"}`,
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: alpha(color, 0.04) },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{
                    width: 32, height: 32, borderRadius: "50%",
                    bgcolor: alpha(color, 0.15), color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 800, flexShrink: 0,
                  }}>
                    {prefix}{level.level}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.3}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: ESPRESSO }}>
                          {resolvedItemLabel} {level.level}
                        </Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: "#7A6A5C" }}>
                          {userCount} {userCount === 1
                            ? t("bonus_widgets.level_collapsible.user_singular", "utente")
                            : t("bonus_widgets.level_collapsible.user_plural", "utenti")}
                        </Typography>
                        {pctLabel && (
                          <Chip label={pctLabel} size="small"
                            sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: alpha(color, 0.12), color }} />
                        )}
                      </Stack>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: levelTotal > 0 ? color : "#ccc" }}>
                        {"€"}{levelTotal.toFixed(2)}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(pct, 100)}
                      sx={{
                        height: 6, borderRadius: 3,
                        bgcolor: alpha(color, 0.08),
                        "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
                      }}
                    />
                    {showTopUser && topUser && levelTotal > 0 && (
                      <Typography sx={{ fontSize: "0.65rem", color: "#aaa", mt: 0.3 }}>
                        {t("bonus_widgets.level_collapsible.top_summary", {
                          name: topUser.username,
                          amount: Number(topUser.total_bonus).toFixed(2),
                          defaultValue: `Top: ${topUser.username} (€${Number(topUser.total_bonus).toFixed(2)})`,
                        })}
                      </Typography>
                    )}
                  </Box>
                  <Iconify
                    icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                    width={20} sx={{ color: "#aaa", flexShrink: 0 }}
                  />
                </Stack>
              </Box>

              <Collapse in={isExpanded} unmountOnExit>
                <Box sx={{ px: 1, py: 1, ml: 5 }}>
                  {users.length > 0 ? (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>#</TableCell>
                          <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>{t("bonus_widgets.common.username", "Username")}</TableCell>
                          <TableCell align="right" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>{t("bonus_widgets.common.bonus", "Bonus")}</TableCell>
                          {extraHeaders.map((h, i) => (
                            <TableCell key={i} align="center" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((u, i) => (
                          <TableRow key={i} sx={{ "&:last-child td": { border: 0 } }}>
                            <TableCell sx={{ fontSize: "0.75rem", py: 0.5 }}>{i + 1}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem", py: 0.5 }}>{u.username}</TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.75rem", fontWeight: 600, color: Number(u.total_bonus) > 0 ? color : "#ccc", py: 0.5 }}>
                              {"€"}{Number(u.total_bonus).toFixed(2)}
                            </TableCell>
                            {extraCells && extraCells(u, color).map((cell, j) => (
                              <TableCell key={j} align="center" sx={{ py: 0.5 }}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography sx={{ fontSize: "0.72rem", color: "#aaa", py: 1 }}>{emptyText}</Typography>
                  )}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default LevelCollapsible;
