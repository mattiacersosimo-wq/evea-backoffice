import React from "react";
import {
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Item from "../rankProgressBar/item";
import CustomerDetails from "./customer_details";
import { useTranslation } from "react-i18next";
import Ternary from "src/components/ternary";

const ORO = "#B8963B";

const CircularGauge = ({ value, max, label, unit = "" }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const done = pct >= 100;

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{ position: "relative", display: "inline-block", width: 90, height: 90 }}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r={r} fill="none" stroke="#eee" strokeWidth="6" />
          <circle
            cx="45" cy="45" r={r} fill="none"
            stroke={done ? "#43A047" : ORO}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            transform="rotate(-90 45 45)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: done ? "#43A047" : ORO, lineHeight: 1 }}>
            {value}{unit}
          </Typography>
          <Typography sx={{ fontSize: "0.55rem", color: "#999" }}>/ {max}{unit}</Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#6B5E54", mt: 0.3 }}>{label}</Typography>
    </Box>
  );
};

const Progress = ({ higherRank, state }) => {
  const { t } = useTranslation();
  if (!higherRank) return null;

  const bonusPct = higherRank?.current_package?.bonus_percentage;
  const pqvReq = Number(higherRank?.pqv?.min_required) || 0;
  const pqvCur = Number(higherRank?.pqv?.current_month_pqv) || 0;
  const custReq = Number(higherRank?.customers?.total_direct_customers) || 0;
  const custOrd = Number(higherRank?.customers?.customers_with_orders) || 0;

  return (
    <Box>
      {/* ── Bonus % hero ── */}
      {bonusPct != null && (
        <Box sx={{ textAlign: "center", py: 2, mb: 2, bgcolor: alpha(ORO, 0.04), borderRadius: 2, border: `1px solid ${alpha(ORO, 0.1)}` }}>
          <Typography sx={{ fontSize: "2.5rem", fontWeight: 900, color: ORO, lineHeight: 1 }}>
            {bonusPct}%
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#6B5E54", mt: 0.3 }}>
            {higherRank?.current_package?.name || t("affiliate_dashboard.current_package")}
          </Typography>
        </Box>
      )}

      {/* ── Gauge circolari ── */}
      <Stack direction="row" justifyContent="center" spacing={3} mb={2}>
        <CircularGauge value={pqvCur} max={pqvReq} label="PQV" />
        <CircularGauge value={custOrd} max={custReq} label={t("affiliate_dashboard.customers_who_placed_orders", { defaultValue: "Clienti attivi" })} />
      </Stack>

      {/* ── PQV dettaglio ── */}
      <Item
        title={t("affiliate_dashboard.personal_qualifying_volume")}
        required={pqvReq}
        completed={pqvCur}
        status={pqvCur >= pqvReq}
      >
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("affiliate_dashboard.username")}</TableCell>
                <TableCell align="right">{t("affiliate_dashboard.qv")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {higherRank?.pqv?.details?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item?.username}</TableCell>
                  <TableCell align="right">{item?.qv}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Item>

      {/* ── Stats ── */}
      <Box sx={{ bgcolor: "#fafafa", borderRadius: 2, p: 1.5, mt: 1.5 }}>
        <Ternary
          when={higherRank?.current_package?.qualification_days}
          then={
            <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.4 }}>
              <Typography sx={{ fontSize: "0.8rem", color: "#6B5E54" }}>{t("affiliate_dashboard.qualification_days")}</Typography>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#2C1A0E" }}>{higherRank?.current_package?.qualification_days}</Typography>
            </Box>
          }
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.4 }}>
          <Typography sx={{ fontSize: "0.8rem", color: "#6B5E54" }}>{t("affiliate_dashboard.personally_enrolled_customers")}</Typography>
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#2C1A0E" }}>{custReq}</Typography>
        </Box>
      </Box>

      <CustomerDetails state={state} customer={higherRank?.customers?.list} />
    </Box>
  );
};

export default Progress;
