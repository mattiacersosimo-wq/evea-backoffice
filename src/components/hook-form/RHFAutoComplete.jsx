import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const RHFAutoComplete = ({
  options,
  getOptionLabel,
  name,
  label,
  multiple,
  defaultValue,
  size,
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { ref, onChange, ...field } }) => (
        <Autocomplete
          defaultValue={defaultValue}
          multiple={multiple}
          onChange={(_, v) => {
            multiple ? onChange(v.map(({ id }) => id)) : onChange(v.id);
          }}
          options={options}
          getOptionLabel={getOptionLabel}
          renderInput={(params) => (
            <TextField
              label={label}
              {...field}
              {...params}
              inputRef={ref}
              error={Boolean(errors[name])}
              helperText={t(errors[name]?.message)}
              size={size}
            />
          )}
          {...rest}
        />
      )}
    />
  );
};

export default RHFAutoComplete;
