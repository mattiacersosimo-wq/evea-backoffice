import { TextField } from "@mui/material";

import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const InputField = ({ params, parent, ...rest }) => {
  const {
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const { methods, name, label } = rest;
  const error = errors[parent];
  return (
    <TextField
      {...params}
      {...methods.register(name)}
      label={Boolean(label) ? t(label) : t("products.title.category")}
      error={Boolean(error)}
      helperText={t(error?.message)}
    />
  );
};

export default InputField;
