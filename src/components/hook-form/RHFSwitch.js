import PropTypes from "prop-types";
// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import { FormControlLabel, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

RHFSwitch.propTypes = {
  name: PropTypes.string,
};

export default function RHFSwitch({ name, label, ...other }) {
  const { control } = useFormContext();
  const { t } = useTranslation();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Switch {...field} checked={field.value} />}
        />
      }
      label={t(label)}
      {...other}
    />
  );
}
