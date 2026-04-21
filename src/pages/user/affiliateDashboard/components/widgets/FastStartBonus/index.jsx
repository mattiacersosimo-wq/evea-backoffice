import { useEffect, useState } from "react";
import { Box, Chip, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";
import BonusWidget from "../../BonusWidget";

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
        {/* Summary */}
        <Stack direction="row" spacing={2}>
          <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: alpha(PINK, 0.06), border: `1px solid ${alpha(PINK, 0.15)}` }}>
            <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C", fontWeight: 600 }}>
              Settimana corrente
            </Typography>
            <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: PINK, lineHeight: 1.2 }}>
              €{Number(data.pending_current_week || 0).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: "#fafaf5", border: "1px solid #f0ece6" }}>
            <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C", fontWeight: 600 }}>
              Settimana precedente
            </Typography>
            <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "#2C1A0E", lineHeight: 1.2 }}>
              €{Number(data.pending_previous_week || 0).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: "#fafaf5", border: "1px solid #f0ece6" }}>
            <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C", fontWeight: 600 }}>
              Reclutamenti mese
            </Typography>
            <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "#2C1A0E", lineHeight: 1.2 }}>
              {data.recruits_this_month || 0}
            </Typography>
          </Box>
        </Stack>

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
                  {recruits.map((r, i) => {
                    const badge = STATUS_BADGE[r.payment_status] || STATUS_BADGE.pending;
                    const packMatch = (r.note || "").match(/\(([^)]+)\)/);
                    const pack = packMatch ? packMatch[1] : "-";
                    return (
                      <TableRow key={i}>
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
