import React from "react";
import { useTranslation } from "react-i18next";
import LevelCollapsible from "src/components/bonus-common/LevelCollapsible";

const LEVEL_COLORS = [
  "#2E7D32", "#388E3C", "#43A047", "#4CAF50", "#66BB6A",
  "#81C784", "#A5D6A7", "#C8E6C9", "#E8F5E9",
];

// Residual bonus percentages per level (from level_settings table)
const LEVEL_PERCENTAGES = {
  1: "2.5%", 2: "2.5%", 3: "2.5%", 4: "1.5%", 5: "1%",
  6: "1%", 7: "0.5%", 8: "0.5%", 9: "0.5%",
};

const LevelDetails = ({ levels = [] }) => {
  const { t } = useTranslation();
  return (
    <LevelCollapsible
      levels={levels}
      title={t("evea.bonus_by_level", "Bonus per Livello")}
      headerIcon="mdi:layers-outline"
      accentColor="#B8963B"
      colors={LEVEL_COLORS}
      pctMap={LEVEL_PERCENTAGES}
      prefix="L"
      itemLabel={t("bonus_widgets.residual.level_item", "Livello")}
      showTopUser
    />
  );
};

export default LevelDetails;
