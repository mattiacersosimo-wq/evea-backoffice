import { Box, Card, Grid, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B"; const ESPRESSO = "#2C1A0E"; const MUTED = "#7A6A5C";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const VolumeReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try { const { data: r } = await axiosInstance.get("api/wp/reports/volume?months=6"); setData(r?.data); } catch {} setLoading(false); })(); }, []);

  const personal = data?.personal || [];
  const team = data?.team || [];
  const topC = data?.top_contributors || [];

  const maxQv = Math.max(...personal.map((p) => Number(p.qv)), ...team.map((t) => Number(t.qv)), 1);

  return (
    <Box>
      {loading ? <Skeleton height={300} /> : (
        <>
          {/* Chart: Personal vs Team QV */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ ...cs, p: 2.5 }}>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>Personal QV vs Team QV (6 months)</Typography>
                <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, height: 180 }}>
                  {personal.map((p) => {
                    const tMatch = team.find((t) => t.y === p.y && t.m === p.m);
                    const pVal = Number(p.qv);
                    const tVal = tMatch ? Number(tMatch.qv) : 0;
                    const pH = Math.max((pVal / maxQv) * 140, 4);
                    const tH = Math.max((tVal / maxQv) * 140, 4);
                    return (
                      <Box key={`${p.y}-${p.m}`} sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 60 }}>
                        <Stack direction="row" spacing={0.3} alignItems="flex-end" sx={{ height: 150 }}>
                          <Box sx={{ width: 20, height: pH, bgcolor: ORO, borderRadius: "4px 4px 0 0" }} />
                          <Box sx={{ width: 20, height: tH, bgcolor: "#4A5C3A", borderRadius: "4px 4px 0 0" }} />
                        </Stack>
                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED, mt: 0.5 }}>{MONTHS[p.m - 1]}</Typography>
                      </Box>
                    );
                  })}
                </Box>
                <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
                  <Stack direction="row" alignItems="center" spacing={0.5}><Box sx={{ width: 10, height: 10, bgcolor: ORO, borderRadius: 1 }} /><Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Personal QV</Typography></Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}><Box sx={{ width: 10, height: 10, bgcolor: "#4A5C3A", borderRadius: 1 }} /><Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Team QV</Typography></Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ ...cs, p: 2.5, height: "100%" }}>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>Top Contributors</Typography>
                <Stack spacing={1}>
                  {topC.map((c, i) => (
                    <Stack key={c.user_id} direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 0.5, borderBottom: i < topC.length - 1 ? "1px solid #f5f0e8" : "none" }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED, width: 16 }}>{i + 1}</Typography>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: ESPRESSO }}>{c.username}</Typography>
                      </Stack>
                      <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: ORO }}>{Number(c.qv).toFixed(0)} QV</Typography>
                    </Stack>
                  ))}
                  {topC.length === 0 && <Typography sx={{ fontSize: "0.78rem", color: MUTED, textAlign: "center" }}>No data</Typography>}
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* Monthly table */}
          <Card sx={{ ...cs, p: 2.5 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>Monthly Volume Detail</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Month", "Personal QV", "Personal BV", "Team QV"].map((h) => (
                    <TableCell key={h} sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {personal.map((p) => {
                  const tMatch = team.find((t) => t.y === p.y && t.m === p.m);
                  return (
                    <TableRow key={`${p.y}-${p.m}`}>
                      <TableCell sx={{ fontSize: "0.78rem", fontWeight: 600 }}>{MONTHS[p.m - 1]} {p.y}</TableCell>
                      <TableCell sx={{ fontSize: "0.78rem", fontWeight: 700, color: ORO }}>{Number(p.qv).toFixed(2)}</TableCell>
                      <TableCell sx={{ fontSize: "0.78rem" }}>{"\u20AC"}{Number(p.bv).toFixed(2)}</TableCell>
                      <TableCell sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#4A5C3A" }}>{tMatch ? Number(tMatch.qv).toFixed(2) : "0.00"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </Box>
  );
};

export default VolumeReport;
