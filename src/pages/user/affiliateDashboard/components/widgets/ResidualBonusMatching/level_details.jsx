import React from "react";
import LevelCollapsible from "src/components/bonus-common/LevelCollapsible";

const MATCHING_COLORS = ["#6A1B9A", "#7B1FA2"];
const RM_PCT = { 1: "20%", 2: "10%" };

const LevelDetails = ({ levels = [] }) => (
  <LevelCollapsible
    levels={levels}
    title="Livelli Matching"
    headerIcon="mdi:swap-horizontal"
    accentColor="#7B1FA2"
    colors={MATCHING_COLORS}
    pctMap={RM_PCT}
    prefix="L"
    itemLabel="Livello"
    emptyText="Nessun utente"
  />
);

export default LevelDetails;
