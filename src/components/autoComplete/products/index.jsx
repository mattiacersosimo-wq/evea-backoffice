import { Autocomplete, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

import useProductList from "./hooks/useProductList";

const Products = ({
  name,
  multiple,
  limitTags = 1,
  label,
  type,
  inputProps = {},
}) => {
  const options = useProductList(type);

  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const selected = watch(name);
  const value = multiple
    ? options.filter(({ id }) => selected.includes(id)) || []
    : options.find(({ id }) => id === selected) || null;

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
            label={label ? label : "adminSubAdmin.subAdmin.products"}
            {...inputProps}
          />
        );
      }}
    />
  );
};

export default Products;
