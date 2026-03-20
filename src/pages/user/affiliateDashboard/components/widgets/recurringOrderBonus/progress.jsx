import React, { useState } from "react";
import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import Item from "../rankProgressBar/item";
import { useTranslation } from "react-i18next";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const WARM = "#6B5E54";

const CYCLE_LEN = 12;
const PAGE_SIZE = 8;
const COUPON_MONTHS = [3, 6, 9]; // 0-indexed → mese 4, 7, 10

const Progress = ({ higherRank }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);

  if (!higherRank) return null;

  const reqMonths = Number(higherRank?.required_consecutive_months) || CYCLE_LEN;
  const totalConsec = Number(higherRank?.current_consecutive_months) || 0;
  const cycleNum = Math.floor(totalConsec / reqMonths) + 1;
  const posInCycle = totalConsec % CYCLE_LEN;

  const allMilestones = Array.from({ length: CYCLE_LEN }, (_, i) => {
    const isCoupon = COUPON_MONTHS.includes(i);
    const isFirstEver = cycleNum === 1 && i === 0;
    let label;
    if (isFirstEver) label = "1ª consegna";
    else if (isCoupon) label = "-10% + €30";
    else label = "-10%";
    return {
      month: i + 1,
      completed: i < posInCycle,
      isCurrent: i === posInCycle,
      label,
      isCoupon,
    };
  });

  const totalPages = Math.ceil(CYCLE_LEN / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;
  const visible = allMilestones.slice(pageStart, pageStart + PAGE_SIZE);

  const completedOnPage = visible.filter((m) => m.completed).length;
  const connectorPct = visible.length > 1
    ? Math.round((completedOnPage / (visible.length - 1)) * 100)
    : 0;

  // savings
  const discountMonths = cycleNum === 1
    ? Math.max(0, posInCycle - 1)
    : 11 + (cycleNum - 2) * 12 + posInCycle;
  const couponsThisCycle = COUPON_MONTHS.filter((i) => i < posInCycle).length;
  const couponsEarned = (cycleNum - 1) * 3 + couponsThisCycle;
  const couponValue = couponsEarned * 30;

  return (
    <Box>
      {/* ── Cycle badge ── */}
      {totalConsec > 0 && (
        <Stack direction="row" justifyContent="flex-end" mb={1}>
          <Chip
            label={`Ciclo ${cycleNum} · ${posInCycle}/${CYCLE_LEN}`}
            size="small"
            sx={{ bgcolor: alpha(ORO, 0.1), color: ORO, fontWeight: 700, fontSize: "0.7rem", height: 24 }}
          />
        </Stack>
      )}

      {/* ── Timeline with arrows ── */}
      <Stack direction="row" alignItems="center" spacing={0.5} mb={2}>
        <IconButton
          size="small"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          sx={{ width: 28, height: 28, color: page === 0 ? "#ddd" : ORO, "&:hover": { bgcolor: alpha(ORO, 0.08) } }}
        >
          <Iconify icon="mdi:chevron-left" width={20} />
        </IconButton>

        <Box sx={{ flex: 1, position: "relative", px: 0.5 }}>
          <Box
            sx={{
              position: "absolute",
              top: 18, left: 20, right: 20, height: 2,
              background: `linear-gradient(90deg, ${ORO} ${connectorPct}%, #eee ${connectorPct}%)`,
              zIndex: 0,
            }}
          />
          <Stack direction="row" justifyContent="space-between" sx={{ position: "relative", zIndex: 1 }}>
            {visible.map((m) => (
              <Stack key={m.month} alignItems="center" sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: 36, height: 36, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "0.75rem", transition: "all 0.3s",
                    ...(m.completed
                      ? { bgcolor: ORO, color: "#fff", boxShadow: `0 2px 8px ${alpha(ORO, 0.35)}` }
                      : m.isCurrent
                      ? { bgcolor: "#fff", color: ORO, border: `2px solid ${ORO}`, boxShadow: `0 0 0 4px ${alpha(ORO, 0.12)}` }
                      : { bgcolor: "#f5f5f5", color: "#bbb" }),
                  }}
                >
                  {m.completed ? <Iconify icon="mdi:check" width={18} /> : m.month}
                </Box>
                <Typography
                  sx={{
                    mt: 0.5, fontSize: "0.62rem",
                    fontWeight: m.isCoupon ? 700 : 500,
                    color: m.isCoupon && m.completed ? ORO : m.completed ? ORO : m.isCurrent ? ESPRESSO : "#bbb",
                    textAlign: "center", lineHeight: 1.2,
                  }}
                >
                  {m.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <IconButton
          size="small"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          sx={{ width: 28, height: 28, color: page >= totalPages - 1 ? "#ddd" : ORO, "&:hover": { bgcolor: alpha(ORO, 0.08) } }}
        >
          <Iconify icon="mdi:chevron-right" width={20} />
        </IconButton>
      </Stack>

      {/* ── Page dots ── */}
      <Stack direction="row" justifyContent="center" spacing={0.5} mb={2}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Box
            key={i}
            onClick={() => setPage(i)}
            sx={{
              width: i === page ? 16 : 6, height: 6, borderRadius: 3,
              bgcolor: i === page ? ORO : "#ddd",
              transition: "all 0.3s", cursor: "pointer",
            }}
          />
        ))}
      </Stack>

      {/* ── Savings ── */}
      <Box sx={{ bgcolor: alpha(ORO, 0.06), borderRadius: 2, p: 2, mb: 2, textAlign: "center" }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} mb={0.5}>
          <Iconify icon="mdi:piggy-bank-outline" width={18} sx={{ color: ORO }} />
          <Typography sx={{ fontSize: "0.75rem", color: WARM, fontWeight: 600 }}>
            Il tuo risparmio finora
          </Typography>
        </Stack>
        {totalConsec === 0 ? (
          <Typography sx={{ fontSize: "0.8rem", color: WARM }}>
            Inizia il tuo abbonamento per risparmiare ogni mese!
          </Typography>
        ) : (
          <Stack direction="row" justifyContent="center" divider={<Typography sx={{ mx: 1, color: "#ddd" }}>+</Typography>}>
            {discountMonths > 0 && (
              <Box>
                <Typography sx={{ fontWeight: 700, color: ESPRESSO, fontSize: "1.1rem" }}>
                  {discountMonths}x -10%
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: WARM }}>consegne con sconto</Typography>
              </Box>
            )}
            {couponValue > 0 && (
              <Box>
                <Typography sx={{ fontWeight: 700, color: ORO, fontSize: "1.1rem" }}>
                  €{couponValue}
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: WARM }}>in coupon regalo</Typography>
              </Box>
            )}
          </Stack>
        )}
      </Box>

      {/* ── QV corrente ── */}
      <Item
        title={t("affiliate_dashboard.personal_order_qv_in_current_month")}
        required={Number(higherRank?.min_qv)}
        completed={Number(higherRank?.current_qv)}
        status={Number(higherRank?.current_qv) >= Number(higherRank?.min_qv)}
      />
    </Box>
  );
};

export default Progress;
