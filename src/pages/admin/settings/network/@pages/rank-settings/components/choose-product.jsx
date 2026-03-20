import { TextField } from "@mui/material";

import React from "react";
import { useTranslation } from "react-i18next";

const ChooseProduct = ({ productList, ...rest }) => {
  const { t } = useTranslation();
  return (
    <TextField
      select
      fullWidth
      SelectProps={{ native: true }}
      size="small"
      style={{ width: 190 }}
      {...rest}
    >
      <option value="0">{t("global.select_a_package")}</option>
      {productList?.map((item) => {
        return <option value={item.id}>{item.name}</option>;
      })}
    </TextField>
  );
};

export default ChooseProduct;
