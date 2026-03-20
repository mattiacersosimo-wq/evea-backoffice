import { TextField } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import Map from "src/components/map";

export const RankList = ({ value, name, handleUpdate, rankList }) => {
  const { t } = useTranslation();
  return (
    <>
      <TextField
        onChange={(e) => handleUpdate(e)}
        name={name}
        select
        fullWidth
        SelectProps={{ native: true }}
        size="small"
        style={{ width: 150 }}
        value={value}
      >
        <Map
          list={rankList}
          render={(item) => (
            <option key={item.rank_id} value={item.rank_id}>
              {item.rank_name}
            </option>
          )}
        />
      </TextField>
    </>
  );
};

export default RankList;
