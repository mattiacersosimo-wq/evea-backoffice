import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useGetRankList from "src/hooks/useGetRankList";

const Ranks = () => {
  const [selectedRank, setSelectedRank] = useState([]);
  const ranks = useGetRankList();
  const { setValue } = useFormContext();
  const { t } = useTranslation();
  const onChange = (_, v) => {
    setValue(
      "ranks",
      v.map(({ id }) => id)
    );
    setSelectedRank(v);
  };

  return (
    <Autocomplete
      size="small"
      value={selectedRank}
      onChange={onChange}
      options={ranks}
      multiple
      getOptionLabel={({ rank_name }) => rank_name}
      renderInput={(params) => (
        <TextField {...params} label={t("network_members.rank")} />
      )}
    />
  );
};

export default Ranks;
