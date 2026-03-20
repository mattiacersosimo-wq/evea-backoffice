import dayjs from "dayjs";
import moment from "moment";
import { Controller, useFormContext } from "react-hook-form";
import BaseDatePicker from "../base-date-picker";

const RHFDatePicker = ({ name, label, size }) => {
  const { control } = useFormContext();

  const onChange = (field) => (newValue) => {
    if (newValue) {
      const date = moment(dayjs(newValue).format("MM/DD/YYYY"));
      field.onChange(date);
    } else {
      field.onChange(null);
    }
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <BaseDatePicker
            label={label}
            size={size}
            error={error}
            value={field.value}
            onChange={onChange(field)}
          />
        );
      }}
    />
  );
};

export default RHFDatePicker;
