import React, { useState } from "react";
import {
  Box,
  Chip,
  Collapse,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

const LEVEL_COLORS = [
  "#2E7D32", "#388E3C", "#43A047", "#4CAF50", "#66BB6A",
  "#81C784", "#A5D6A7", "#C8E6C9", "#E8F5E9",
];

const LevelDetails = ({ levels = [] }) => {
  const [expandedLevel, setExpandedLevel] = useState(null);

  if (!levels || !levels.length) return null;

  const totalBonus = levels.reduce((sum, l) => {
    const lt = (l.users || []).reduce((s, u) => s + Number(u.total_bonus || 0), 0);
    return sum + lt;
  }, 0);

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:layers-outline" width={20} sx={{ color: ORO }} />
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>
            Bonus per Livello
          </Typography>
        </Stack>
        <Chip
          label={`Totale: \u20AC${totalBonus.toFixed(2)}`}
          size="small"
          sx={{ height: 26, fontWeight: 700, bgcolor: alpha(ORO, 0.1), color: ORO, fontSize: "0.78rem" }}
        />
      </Stack>

      <Stack spacing={1}>
        {levels.map((level, idx) => {
          const users = level.users || [];
          const levelTotal = users.reduce((s, u) => s + Number(u.total_bonus || 0), 0);
          const userCount = users.length;
          const pct = totalBonus > 0 ? (levelTotal / totalBonus) * 100 : 0;
          const color = LEVEL_COLORS[idx] || LEVEL_COLORS[LEVEL_COLORS.length - 1];
          const topUser = users.length > 0
            ? users.reduce((a, b) => Number(a.total_bonus) > Number(b.total_bonus) ? a : b)
            : null;
          const isExpanded = expandedLevel === level.level;

          return (
            <Box key={level.level}>
              <Box
                onClick={() => setExpandedLevel(isExpanded ? null : level.level)}
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
                    L{level.level}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.3}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: ESPRESSO }}>
                          Livello {level.level}
                        </Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: "#7A6A5C" }}>
                          {userCount} utent{userCount === 1 ? "e" : "i"}
                        </Typography>
                        {level.percentage && (
                          <Chip label={`${level.percentage}%`} size="small"
                            sx={{ height: 18, fontSize: "0.6rem", fontWeight: 700, bgcolor: alpha(color, 0.1), color }} />
                        )}
                      </Stack>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: levelTotal > 0 ? color : "#ccc" }}>
                        {"\u20AC"}{levelTotal.toFixed(2)}
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
                    {topUser && levelTotal > 0 && (
                      <Typography sx={{ fontSize: "0.65rem", color: "#aaa", mt: 0.3 }}>
                        Top: {topUser.username} ({"\u20AC"}{Number(topUser.total_bonus).toFixed(2)})
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
                          <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>Username</TableCell>
                          <TableCell align="right" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>Bonus</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((u, i) => (
                          <TableRow key={i} sx={{ "&:last-child td": { border: 0 } }}>
                            <TableCell sx={{ fontSize: "0.75rem", py: 0.5 }}>{i + 1}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem", py: 0.5 }}>{u.username}</TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.75rem", fontWeight: 600, color: Number(u.total_bonus) > 0 ? color : "#ccc", py: 0.5 }}>
                              {"\u20AC"}{Number(u.total_bonus).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography sx={{ fontSize: "0.72rem", color: "#aaa", py: 1 }}>Nessun utente in questo livello</Typography>
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
