import { TextField } from "@mui/material";
import React from "react";
import Map from "src/components/map";

export const PackageList = ({ value, name, handleUpdate, packageList }) => {
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
          list={packageList}
          render={(item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          )}
        />
      </TextField>
    </>
  );
};

export default PackageList;
