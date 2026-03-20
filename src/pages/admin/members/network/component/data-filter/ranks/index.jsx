import React from "react";
import { useTranslation } from "react-i18next";
import { RHFSelect } from "src/components/hook-form";
import useRanks from "./hooks/use-ranks";

const Ranks = () => {
  const ranks = useRanks();
  const { t } = useTranslation();

  return (
    <RHFSelect name="rank_id" label={t("network_members.rank")} size="small">
      <option value="" />
      {ranks.map(({ rank_name, id }) => (
        <option value={id}>{rank_name}</option>
      ))}
    </RHFSelect>
  );
};

export default Ranks;
