import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";
import { DATE_FORMAT } from "src/config";

const BaseDatePicker = ({ label, size, error, value, onChange }) => {
  const { t } = useTranslation();

  return (
    <DatePicker
      label={t(label)}
      inputFormat={DATE_FORMAT}
      value={value}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          error={!!error}
          helperText={t(error?.message)}
          size={size}
        />
      )}
    />
  );
};

export default BaseDatePicker;
