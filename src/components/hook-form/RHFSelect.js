import PropTypes from "prop-types";
// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

RHFSelect.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

export default function RHFSelect({ name, children, label, ...other }) {
  const { control } = useFormContext();
  const { t } = useTranslation();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          helperText={t(error?.message)}
          label={t(label)}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}
