import { useEffect, useState } from "react";
import { Box, Chip, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";
import BonusWidget from "../../BonusWidget";
import WeekChipsHeader from "src/components/bonus-common/WeekChipsHeader";

const PINK = "#FF4081";

const useFastStart = () => {
  const [data, setData] = useState(null);
  const handleErrors = useErrors();
  useEffect(() => {
    (async () => {
      try {
        const { status, data: r } = await fetchUser("affiliate-dashboard/faststart-Progressbar");
        if (status === 200) setData(r?.data || null);
      } catch (err) {
        handleErrors(err);
      }
    })();
  }, []);
  return data;
};

const STATUS_BADGE = {
  pending: { label: "In attesa", color: "#EF9F27", bg: "#FFF3E0" },
  on_hold: { label: "On hold", color: "#607D8B", bg: "#ECEFF1" },
  yes: { label: "Approvato", color: "#4A5C3A", bg: "#EAF3DE" },
  cancelled: { label: "Annullato", color: "#C0392B", bg: "#FDEDEC" },
};

// Raggruppa recruits per settimana ISO (lun-dom). Ritorna [{label, rows}, ...]
// ordinato dalla piu' recente. Etichette contestuali: corrente, precedente,
// altrimenti "N settimane fa" o data range.
const groupByWeek = (recruits) => {
  if (!recruits || recruits.length === 0) return [];
  const now = new Date();
  const startOfWeek = (d) => {
    const dt = new Date(d);
    const day = dt.getDay() || 7; // lunedi=1, domenica=7
    if (day !== 1) dt.setHours(-24 * (day - 1));
    dt.setHours(0, 0, 0, 0);
    return dt;
  };
  const currentStart = startOfWeek(now).getTime();
  const groups = {};
  recruits.forEach((r) => {
    const created = new Date(r.created_at);
    const wk = startOfWeek(created).getTime();
    if (!groups[wk]) groups[wk] = { weekStart: wk, rows: [] };
    groups[wk].rows.push(r);
  });
  return Object.values(groups)
    .sort((a, b) => b.weekStart - a.weekStart)
    .map((g) => {
      const diff = Math.round((currentStart - g.weekStart) / (7 * 24 * 60 * 60 * 1000));
      let label;
      if (diff === 0) label = "Settimana corrente";
      else if (diff === 1) label = "Settimana precedente";
      else if (diff > 1 && diff < 5) label = `${diff} settimane fa`;
      else {
        const d = new Date(g.weekStart);
        label = `Dal ${d.getDate()}/${d.getMonth() + 1}`;
      }
      return { label, rows: g.rows };
    });
};

const FastStartBonus = () => {
  const data = useFastStart();

  if (!data) return null;

  const recruits = data.recruits_list || [];
  const packs = data.packs || [];

  return (
    <BonusWidget
      icon="mdi:flash-outline"
      color={PINK}
      title="Fast Start Bonus"
    >
      <Stack spacing={2}>
        <WeekChipsHeader
          currentAmount={data.pending_current_week}
          previousInApprovalAmount={data.pending_previous_week}
          accentColor={PINK}
          extraBox={{ label: "Reclutamenti mese", value: data.recruits_this_month || 0 }}
        />

        {/* Pack amounts */}
        {packs.length > 0 && (
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fafaf5", border: "1px solid #f0ece6" }}>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#2C1A0E", mb: 0.8 }}>
              Bonus per kit
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {packs.map((p) => (
                <Chip
                  key={p.package_name}
                  label={`${p.package_name}: €${Number(p.amount).toFixed(0)}`}
                  size="small"
                  sx={{ fontSize: "0.72rem", fontWeight: 600, bgcolor: alpha(PINK, 0.1), color: PINK }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Recruits list */}
        {recruits.length > 0 ? (
          <Box>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#2C1A0E", mb: 1 }}>
              Nuovi promoter reclutati
            </Typography>
            <Box sx={{ borderRadius: 2, border: "1px solid #f0ece6", overflow: "hidden" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#fafaf5" }}>
                    <TableCell sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#7A6A5C" }}>
                      Promoter
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#7A6A5C" }}>
                      Kit
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#7A6A5C" }}>
                      Bonus
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#7A6A5C" }}>
                      Stato
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupByWeek(recruits).map((group) => (
                    <>
                      <TableRow key={`hdr-${group.label}`} sx={{ bgcolor: alpha(PINK, 0.04) }}>
                        <TableCell colSpan={4} sx={{ fontSize: "0.72rem", fontWeight: 700, color: PINK, py: 0.75, borderTop: `1px solid ${alpha(PINK, 0.15)}` }}>
                          {group.label}
                        </TableCell>
                      </TableRow>
                      {group.rows.map((r, i) => {
                        const badge = STATUS_BADGE[r.payment_status] || STATUS_BADGE.pending;
                        const packMatch = (r.note || "").match(/\(([^)]+)\)/);
                        const pack = packMatch ? packMatch[1] : "-";
                        return (
                          <TableRow key={`${group.label}-${i}`}>
                            <TableCell sx={{ fontSize: "0.78rem", fontWeight: 600 }}>
                              {r.username}
                            </TableCell>
                            <TableCell sx={{ fontSize: "0.78rem" }}>
                              {pack}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.78rem", fontWeight: 700, color: PINK }}>
                              €{Number(r.amount).toFixed(2)}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={badge.label}
                                size="small"
                                sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, color: badge.color, bgcolor: badge.bg }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 2, textAlign: "center", borderRadius: 2, bgcolor: "#fafaf5", border: "1px dashed #E0DDD6" }}>
            <Iconify icon="mdi:rocket-launch-outline" width={24} sx={{ color: "#bbb" }} />
            <Typography sx={{ fontSize: "0.78rem", color: "#7A6A5C", mt: 0.5 }}>
              Invita un nuovo promoter che acquisti uno starter kit per guadagnare il tuo primo Fast Start Bonus
            </Typography>
          </Box>
        )}
      </Stack>
    </BonusWidget>
  );
};

export default FastStartBonus;
