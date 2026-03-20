import { Autocomplete, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

import useProductList from "./hooks/useProductList";
import { useTranslation } from "react-i18next";

const Products = ({
  name,
  multiple,
  limitTags = 1,
  label,
  type = "normal",
  inputProps = {},
}) => {
  const options = useProductList(type);
  const { t } = useTranslation();
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const selected = watch(name);
  const value = multiple
    ? options?.filter(({ id }) => selected?.includes(id)) || []
    : options?.find(({ id }) => id === selected) || null;

  return (
    <Autocomplete
      multiple={multiple}
      options={options}
      limitTags={limitTags}
      value={value}
      getOptionLabel={({ name }) => name}
      onChange={(_, v) => {
        setValue(name, multiple ? v.map(({ id }) => id) : v.id);
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            fullWidth
            error={Boolean(errors[name])}
            helperText={errors[name]?.message}
            label={label ? label : t("sub_admin.products")}
            {...inputProps}
            name={name}
          />
        );
      }}
    />
  );
};

export default Products;
