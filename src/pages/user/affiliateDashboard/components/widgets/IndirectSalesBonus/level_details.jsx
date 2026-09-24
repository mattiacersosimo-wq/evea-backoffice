import React from "react";
import { useTranslation } from "react-i18next";
import LevelCollapsible from "src/components/bonus-common/LevelCollapsible";
import StatusChip from "src/components/bonus-common/StatusChip";

const ISB_PCT = { 1: "4%", 2: "3%", 3: "3%" };
const ISB_COLORS = ["#1565C0", "#1976D2", "#2196F3"];

const LevelDetails = ({ levels = [] }) => {
  const { t } = useTranslation();
  return (
    <LevelCollapsible
      levels={levels}
      title={t("bonus_widgets.isb.generations", "Generazioni")}
      headerIcon="mdi:sitemap-outline"
      accentColor="#1976D2"
      colors={ISB_COLORS}
      pctMap={ISB_PCT}
      prefix="G"
      itemLabel={t("bonus_widgets.isb.generation", "Generazione")}
      extraHeaders={[t("bonus_widgets.common.status", "Stato")]}
      extraCells={(u) => [
        <StatusChip
          key="status"
          status="pending"
          daysToApprove={u.next_approve_days ?? u.days_to_approve}
          context="isb"
          isCurrentWeek={u.is_current_week}
        />,
      ]}
      emptyText={t("bonus_widgets.isb.no_users", "Nessun utente")}
    />
  );
};

export default LevelDetails;
