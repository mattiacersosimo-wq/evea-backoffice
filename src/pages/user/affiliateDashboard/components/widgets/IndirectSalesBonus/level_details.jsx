import React from "react";
import LevelCollapsible from "src/components/bonus-common/LevelCollapsible";
import StatusChip from "src/components/bonus-common/StatusChip";

const ISB_PCT = { 1: "4%", 2: "3%", 3: "3%" };
const ISB_COLORS = ["#1565C0", "#1976D2", "#2196F3"];

const LevelDetails = ({ levels = [] }) => (
  <LevelCollapsible
    levels={levels}
    title="Generazioni"
    headerIcon="mdi:sitemap-outline"
    accentColor="#1976D2"
    colors={ISB_COLORS}
    pctMap={ISB_PCT}
    prefix="G"
    itemLabel="Generazione"
    extraHeaders={["Stato"]}
    extraCells={(u) => [
      <StatusChip
        key="status"
        status="pending"
        daysToApprove={u.next_approve_days ?? u.days_to_approve}
        context="isb"
        isCurrentWeek={u.is_current_week}
      />,
    ]}
    emptyText="Nessun utente"
  />
);

export default LevelDetails;
