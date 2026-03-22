import React, { useState } from "react";
import {
  Box, Collapse, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";

const COLOR = "#B8963B";

const Level_One = ({ level_one = [] }) => {
  const [expanded, setExpanded] = useState(null);

  const customers = level_one?.customers || [];
  if (!customers.length) return <Typography sx={{ fontSize: "0.75rem", color: "#aaa", py: 1 }}>Nessun leader in Gen 1</Typography>;

  return (
    <Stack spacing={0.8}>
      {customers.map((c, i) => {
        const isExp = expanded === i;
        return (
          <Box key={i}>
            <Box onClick={() => setExpanded(isExp ? null : i)}
              sx={{ p: 1, borderRadius: 1.5, cursor: "pointer", bgcolor: isExp ? alpha(COLOR, 0.04) : "transparent",
                border: `1px solid ${isExp ? alpha(COLOR, 0.15) : "#f0ece6"}`, transition: "all 0.2s" }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#2C1A0E" }}>{c.customer_username}</Typography>
                  <Typography sx={{ fontSize: "0.6rem", color: "#7A6A5C", bgcolor: alpha(COLOR, 0.08), px: 0.8, py: 0.2, borderRadius: 1 }}>{c.rank_name}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C" }}>BV: {c.bv}</Typography>
                  <Typography sx={{ fontSize: "0.65rem", color: "#7A6A5C" }}>{c.percentage}%</Typography>
                  <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: Number(c.pending_bonus) > 0 ? COLOR : "#ccc" }}>
                    {"\u20AC"}{Number(c.pending_bonus || 0).toFixed(2)}
                  </Typography>
                  <Iconify icon={isExp ? "mdi:chevron-up" : "mdi:chevron-down"} width={16} sx={{ color: "#aaa" }} />
                </Stack>
              </Stack>
            </Box>
            <Collapse in={isExp} unmountOnExit>
              <Box sx={{ pl: 2, py: 0.5 }}>
                {c.bv_users && c.bv_users.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#7A6A5C", py: 0.3 }}>Username</TableCell>
                        <TableCell align="right" sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#7A6A5C", py: 0.3 }}>BV</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {c.bv_users.map((u, j) => (
                        <TableRow key={j} sx={{ "&:last-child td": { border: 0 } }}>
                          <TableCell sx={{ fontSize: "0.7rem", py: 0.3 }}>{u.username}</TableCell>
                          <TableCell align="right" sx={{ fontSize: "0.7rem", py: 0.3 }}>{u.bv}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography sx={{ fontSize: "0.7rem", color: "#aaa" }}>Nessun dettaglio BV</Typography>
                )}
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </Stack>
  );
};

export default Level_One;
