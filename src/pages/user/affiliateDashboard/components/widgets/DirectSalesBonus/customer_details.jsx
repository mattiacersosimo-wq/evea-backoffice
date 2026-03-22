import React, { useState } from "react";
import {
  Box, Chip, Collapse, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

const CustomerDetails = ({ customer = [] }) => {
  const [open, setOpen] = useState(false);

  if (!customer || !customer.length) return null;

  const allOrders = customer.flatMap((c) => (c.orders || []).map((o) => ({ ...o, customerName: c.customer_name || o.username })));
  const totalCommission = allOrders.reduce((s, o) => s + Number(o.commission || 0), 0);

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          p: 1.5, borderRadius: 2, cursor: "pointer",
          bgcolor: open ? alpha(ORO, 0.04) : "#fafafa",
          border: `1px solid ${open ? alpha(ORO, 0.15) : "#f0ece6"}`,
          transition: "all 0.2s",
          "&:hover": { bgcolor: alpha(ORO, 0.03) },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:account-group-outline" width={20} sx={{ color: ORO }} />
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO }}>
              Dettaglio Clienti
            </Typography>
            <Chip label={`${allOrders.length} ordini`} size="small"
              sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600, bgcolor: alpha(ORO, 0.1), color: ORO }} />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: totalCommission > 0 ? ORO : "#ccc" }}>
              {"\u20AC"}{totalCommission.toFixed(2)}
            </Typography>
            <Iconify icon={open ? "mdi:chevron-up" : "mdi:chevron-down"} width={20} sx={{ color: "#aaa" }} />
          </Stack>
        </Stack>
      </Box>
      <Collapse in={open} unmountOnExit>
        <Box sx={{ px: 1, py: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>#</TableCell>
                <TableCell sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>Cliente</TableCell>
                <TableCell align="right" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>BV</TableCell>
                <TableCell align="right" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>Bonus</TableCell>
                <TableCell align="right" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#7A6A5C", py: 0.5 }}>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allOrders.map((o, i) => (
                <TableRow key={i} sx={{ "&:last-child td": { border: 0 } }}>
                  <TableCell sx={{ fontSize: "0.75rem", py: 0.5 }}>{i + 1}</TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", py: 0.5 }}>{o.customerName || o.username}</TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.75rem", py: 0.5 }}>{o.bv}</TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.75rem", fontWeight: 600, color: Number(o.commission) > 0 ? ORO : "#ccc", py: 0.5 }}>
                    {"\u20AC"}{Number(o.commission).toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.7rem", color: "#7A6A5C", py: 0.5 }}>
                    <ParseDate date={o.order_date} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CustomerDetails;
