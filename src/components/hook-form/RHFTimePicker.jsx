import { TimePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const RHFTimePicker = ({ name, label }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TimePicker
          label={label}
          value={field.value}
          onChange={(newValue) => {
            if (newValue) {
              field.onChange(newValue);
            } else {
              field.onChange("");
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      )}
    />
  );
};

export default RHFTimePicker;
