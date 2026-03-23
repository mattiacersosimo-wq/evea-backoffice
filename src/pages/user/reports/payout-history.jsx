import { Box, Card, Chip, Grid, MenuItem, Select, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B"; const ESPRESSO = "#2C1A0E"; const MUTED = "#7A6A5C";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PayoutHistoryReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const { data: r } = await axiosInstance.get("api/wp/reports/payout-history", { params: { year } }); setData(r?.data); }
    catch { /* silent */ }
    setLoading(false);
  }, [year]);

  useEffect(() => { fetch(); }, [fetch]);

  const monthly = data?.monthly || [];
  const payouts = data?.payouts || [];
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const maxM = Math.max(...monthly.map((m) => Number(m.total)), 1);

  return (
    <Box>
      {/* Year selector */}
      <Stack direction="row" spacing={1.5} mb={2} alignItems="center">
        <Select size="small" value={year} onChange={(e) => setYear(e.target.value)}
          sx={{ minWidth: 100, bgcolor: "#fff", borderRadius: 2, "& .MuiSelect-select": { py: 0.8, fontSize: "0.82rem" } }}>
          {[2024, 2025, 2026, 2027].map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
        </Select>
      </Stack>

      {loading ? <Skeleton height={300} /> : (
        <>
          {/* Summary */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6} md={3}>
              <Card sx={{ ...cs, p: 2, textAlign: "center" }}>
                <Iconify icon="mdi:cash-check" width={28} sx={{ color: "#4A5C3A", mb: 0.5 }} />
                <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "#4A5C3A" }}>{"\u20AC"}{(data?.yearly_total || 0).toFixed(2)}</Typography>
                <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Earned {year}</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ ...cs, p: 2, textAlign: "center" }}>
                <Iconify icon="mdi:wallet-outline" width={28} sx={{ color: ORO, mb: 0.5 }} />
                <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: ORO }}>{"\u20AC"}{(data?.wallet_balance || 0).toFixed(2)}</Typography>
                <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Wallet Balance</Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Monthly chart */}
          <Card sx={{ ...cs, p: 2.5, mb: 2 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>Monthly Earnings {year}</Typography>
            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 1.5, height: 160 }}>
              {Array.from({ length: 12 }, (_, i) => {
                const match = monthly.find((m) => m.m === i + 1);
                const val = match ? Number(match.total) : 0;
                const barH = Math.max((val / maxM) * 130, 3);
                return (
                  <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    {val > 0 && <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ORO, mb: 0.3 }}>{"\u20AC"}{val.toFixed(0)}</Typography>}
                    <Box sx={{ width: "70%", height: barH, bgcolor: val > 0 ? ORO : alpha(ORO, 0.1), borderRadius: "4px 4px 0 0" }} />
                    <Typography sx={{ fontSize: "0.65rem", color: MUTED, mt: 0.5 }}>{MONTHS[i]}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Card>

          {/* Payout requests */}
          <Card sx={{ ...cs, p: 2.5 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>Payout Requests</Typography>
            {payouts.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Date", "Requested", "Released", "Status"].map((h) => (
                      <TableCell key={h} sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payouts.map((p) => {
                    const st = p.status === "approved" ? { label: "Approved", color: "#4A5C3A", bg: "#EAF3DE" }
                      : p.status === "pending" ? { label: "Pending", color: "#EF9F27", bg: "#FFF3E0" }
                      : { label: p.status, color: MUTED, bg: "#f5f5f5" };
                    return (
                      <TableRow key={p.id}>
                        <TableCell sx={{ fontSize: "0.78rem" }}>{formatDate(p.created_at)}</TableCell>
                        <TableCell sx={{ fontSize: "0.78rem", fontWeight: 700 }}>{"\u20AC"}{Number(p.amount).toFixed(2)}</TableCell>
                        <TableCell sx={{ fontSize: "0.78rem", color: ORO }}>{"\u20AC"}{Number(p.released_amount || 0).toFixed(2)}</TableCell>
                        <TableCell><Chip label={st.label} size="small" sx={{ height: 20, fontSize: "0.6rem", fontWeight: 600, bgcolor: st.bg, color: st.color }} /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Typography sx={{ textAlign: "center", py: 3, color: MUTED }}>No payout requests for {year}</Typography>
            )}
          </Card>
        </>
      )}
    </Box>
  );
};

export default PayoutHistoryReport;
