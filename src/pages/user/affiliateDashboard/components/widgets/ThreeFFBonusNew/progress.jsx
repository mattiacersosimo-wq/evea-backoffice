import React, { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Current from "./current";
import Previous from "./previous";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const WARM = "#6B5E54";

const Progress = ({ higherRank, state }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  if (!higherRank) return null;

  const required = higherRank?.required_customers || 3;
  const current = higherRank?.current_qualified_customer_count || 0;
  const bonus = higherRank?.current_bonus_amount || 0;
  const customers = higherRank?.current_customers_largest_orders || [];
  const slots = Array.from({ length: required }, (_, i) => customers[i] || null);

  return (
    <Box>
      {/* ── Avatar slots ── */}
      <Stack direction="row" spacing={2.5} justifyContent="center" mb={2}>
        {slots.map((c, i) => (
          <Stack key={i} alignItems="center" spacing={0.5}>
            <Avatar
              sx={{
                width: 52, height: 52,
                bgcolor: c ? alpha(ORO, 0.12) : "#f5f5f5",
                color: c ? ORO : "#ccc",
                border: c ? `2px solid ${ORO}` : "2px dashed #ddd",
                transition: "all 0.3s",
              }}
            >
              {c ? (
                <Iconify icon="mdi:check-bold" width={24} />
              ) : (
                <Iconify icon="mdi:account-plus-outline" width={24} />
              )}
            </Avatar>
            <Typography
              variant="caption"
              sx={{ color: c ? ESPRESSO : "#aaa", maxWidth: 70, fontWeight: c ? 600 : 400 }}
              noWrap
            >
              {c?.customer_name || t("bonus_widgets.three_for_free.friend_slot", { n: i + 1, defaultValue: `Amico ${i + 1}` })}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {/* ── Stats ── */}
      <Box sx={{ textAlign: "center", bgcolor: "#fafafa", borderRadius: 2, py: 1.5, mb: 2 }}>
        <Typography variant="body2" sx={{ color: WARM }}>
          <b style={{ color: ESPRESSO }}>{current}/{required}</b> {t("bonus_widgets.three_for_free.friends_invited", "amici invitati")}
          <Divider component="span" orientation="vertical" sx={{ mx: 1.5, height: 14, display: "inline-block", borderColor: "#ddd" }} />
          {t("bonus_widgets.three_for_free.prize", "Premio")}: <b style={{ color: ORO, fontSize: "1.1em" }}>€{bonus}</b>
        </Typography>
      </Box>

      {/* ── Tabs dettaglio ── */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          minHeight: 36, mb: 1,
          "& .MuiTab-root": { minHeight: 36, py: 0.5, fontSize: "0.8rem", fontWeight: 600, textTransform: "none" },
          "& .Mui-selected": { color: ORO },
          "& .MuiTabs-indicator": { bgcolor: ORO },
        }}
      >
        <Tab label={t("bonus_widgets.three_for_free.tab_current_month", "Mese corrente")} />
        <Tab label={t("bonus_widgets.three_for_free.tab_previous_month", "Mese precedente")} />
      </Tabs>

      {tab === 0 && <Current state={state} higherRank={higherRank} />}
      {tab === 1 && <Previous state={state} higherRank={higherRank} />}
    </Box>
  );
};

export default Progress;
