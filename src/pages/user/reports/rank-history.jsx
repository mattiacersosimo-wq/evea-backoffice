import { Box, Card, Chip, LinearProgress, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B"; const ESPRESSO = "#2C1A0E"; const MUTED = "#7A6A5C";
const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const RankHistoryReport = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try { const { data: r } = await axiosInstance.get("api/wp/reports/rank-history"); setData(r?.data); } catch {} setLoading(false); })(); }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const nr = data?.next_rank;
  const pqvPct = nr && nr.pqv_required > 0 ? Math.min(100, (nr.current_pqv / nr.pqv_required) * 100) : 0;

  return (
    <Box>
      {loading ? <Skeleton height={200} /> : (
        <>
          {/* Current rank + next */}
          <Card sx={{ ...cs, p: 2.5, mb: 2 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              <Box sx={{ flex: 1, textAlign: "center", py: 2 }}>
                <Iconify icon="mdi:shield-star" width={36} sx={{ color: ORO, mb: 1 }} />
                <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>{t("evea.current_rank")}</Typography>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: ORO }}>{data?.current_rank}</Typography>
              </Box>
              {nr && (
                <Box sx={{ flex: 2, py: 2 }}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>{t("evea.next_rank_colon")}: {nr.name}</Typography>
                  <Box mb={1.5}>
                    <Stack direction="row" justifyContent="space-between" mb={0.3}>
                      <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>PQV</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>{nr.current_pqv}/{nr.pqv_required}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={pqvPct} sx={{ height: 8, borderRadius: 4, bgcolor: "#f0ece6", "& .MuiLinearProgress-bar": { bgcolor: ORO, borderRadius: 4 } }} />
                    {nr.pqv_remaining > 0 && (
                      <Typography sx={{ fontSize: "0.72rem", color: MUTED, mt: 0.5 }}>{t("evea.missing")}: <b style={{ color: ORO }}>{nr.pqv_remaining} QV</b></Typography>
                    )}
                  </Box>
                  {nr.tv_required > 0 && <Typography sx={{ fontSize: "0.72rem", color: MUTED }}>TV Required: {nr.tv_required}</Typography>}
                  {nr.gv_required > 0 && <Typography sx={{ fontSize: "0.72rem", color: MUTED }}>GV Required: {nr.gv_required}</Typography>}
                </Box>
              )}
            </Stack>
          </Card>

          {/* History */}
          <Card sx={{ ...cs, p: 2.5 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>{t("evea.rank_history")}</Typography>
            {(data?.history || []).length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Date", "From", "To", "Type"].map((h) => (
                      <TableCell key={h} sx={{ fontSize: "0.72rem", fontWeight: 600, color: MUTED }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data?.history || []).map((h) => (
                    <TableRow key={h.id}>
                      <TableCell sx={{ fontSize: "0.78rem" }}>{formatDate(h.created_at)}</TableCell>
                      <TableCell sx={{ fontSize: "0.78rem" }}>{h.from_name || "—"}</TableCell>
                      <TableCell sx={{ fontSize: "0.78rem", fontWeight: 600, color: ORO }}>{h.to_name || "—"}</TableCell>
                      <TableCell>
                        <Chip label={h.is_downgraded ? t("evea.downgrade") : t("evea.upgrade")} size="small"
                          sx={{ height: 20, fontSize: "0.6rem", fontWeight: 600, bgcolor: h.is_downgraded ? alpha("#E24B4A", 0.1) : alpha("#4A5C3A", 0.1), color: h.is_downgraded ? "#E24B4A" : "#4A5C3A" }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography sx={{ textAlign: "center", py: 3, color: MUTED }}>No rank changes recorded</Typography>
            )}
          </Card>
        </>
      )}
    </Box>
  );
};

export default RankHistoryReport;
