import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

RHFTextField.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextField({
  name,
  sx,
  label,
  placeholder,
  ...other
}) {
  const { control } = useFormContext();

  const { t } = useTranslation();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={!!error}
          helperText={t(error?.message)}
          label={t(label)}
          placeholder={t(placeholder)}
          {...other}
        />
      )}
    />
  );
}
