import React, { useState } from "react";
import {
  Box, Chip, Collapse, LinearProgress, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";

const ESPRESSO = "#2C1A0E";
const ORO = "#B8963B";
const COLORS = ["#1565C0", "#1976D2", "#2196F3"];
const ISB_PCT = { 1: "4%", 2: "3%", 3: "3%" };

const LevelDetails = ({ levels = [] }) => {
  const [expanded, setExpanded] = useState(null);

  if (!levels || !levels.length) return null;

  const totalBonus = levels.reduce((s, l) =>
    s + (l.users || []).reduce((s2, u) => s2 + Number(u.total_bonus || 0), 0), 0);

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:sitemap-outline" width={20} sx={{ color: "#1976D2" }} />
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>Generazioni</Typography>
        </Stack>
        <Chip label={`Totale: \u20AC${totalBonus.toFixed(2)}`} size="small"
          sx={{ height: 26, fontWeight: 700, bgcolor: alpha(ORO, 0.1), color: ORO, fontSize: "0.78rem" }} />
      </Stack>

      <Stack spacing={1}>
        {levels.map((level, idx) => {
          const users = level.users || [];
          const lt = users.reduce((s, u) => s + Number(u.total_bonus || 0), 0);
          const pct = totalBonus > 0 ? (lt / totalBonus) * 100 : 0;
          const color = COLORS[idx] || COLORS[2];
          const isExp = expanded === level.level;

          return (
            <Box key={level.level}>
              <Box onClick={() => setExpanded(isExp ? null : level.level)}
                sx={{ p: 1.5, borderRadius: 2, cursor: "pointer", bgcolor: isExp ? alpha(color, 0.06) : "#fafafa",
                  border: `1px solid ${isExp ? alpha(color, 0.2) : "#f0ece6"}`, transition: "all 0.2s",
                  "&:hover": { bgcolor: alpha(color, 0.04) } }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: alpha(color, 0.15), color,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>
                    G{level.level}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.3}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: ESPRESSO }}>Generazione {level.level}</Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: "#7A6A5C" }}>{users.length} utent{users.length === 1 ? "e" : "i"}</Typography>
                        <Chip label={ISB_PCT[level.level] || "3%"} size="small"
                          sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: alpha(color, 0.12), color }} />
                      </Stack>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: lt > 0 ? color : "#ccc" }}>{"\u20AC"}{lt.toFixed(2)}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={Math.min(pct, 100)}
                      sx={{ height: 6, borderRadius: 3, bgcolor: alpha(color, 0.08), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 } }} />
                  </Box>
                  <Iconify icon={isExp ? "mdi:chevron-up" : "mdi:chevron-down"} width={20} sx={{ color: "#aaa", flexShrink: 0 }} />
                </Stack>
              </Box>
              <Collapse in={isExp} unmountOnExit>
                <Box sx={{ px: 1, py: 1, ml: 5 }}>
                  {users.length > 0 ? (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>#</TableCell>
                          <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>Username</TableCell>
                          <TableCell align="right" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>BV</TableCell>
                          <TableCell align="right" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>Bonus</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((u, i) => (
                          <TableRow key={i} sx={{ "&:last-child td": { border: 0 } }}>
                            <TableCell sx={{ fontSize: "0.75rem", py: 0.5 }}>{i + 1}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem", py: 0.5 }}>{u.username}</TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.75rem", py: 0.5 }}>{u.bv}</TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.75rem", fontWeight: 600, color: Number(u.total_bonus) > 0 ? color : "#ccc", py: 0.5 }}>
                              {"\u20AC"}{Number(u.total_bonus).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography sx={{ fontSize: "0.72rem", color: "#aaa", py: 1 }}>Nessun utente</Typography>
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

export default LevelDetails;
