import React from "react";
import { useTranslation } from "react-i18next";
import LevelCollapsible from "src/components/bonus-common/LevelCollapsible";

const MATCHING_COLORS = ["#6A1B9A", "#7B1FA2"];
const RM_PCT = { 1: "20%", 2: "10%" };

const LevelDetails = ({ levels = [] }) => {
  const { t } = useTranslation();
  return (
    <LevelCollapsible
      levels={levels}
      title={t("evea.matching_levels", "Livelli Matching")}
      headerIcon="mdi:swap-horizontal"
      accentColor="#7B1FA2"
      colors={MATCHING_COLORS}
      pctMap={RM_PCT}
      prefix="L"
      itemLabel={t("bonus_widgets.residual.level_item", "Livello")}
      emptyText={t("bonus_widgets.residual_matching.no_users", "Nessun utente")}
    />
  );
};

export default LevelDetails;
