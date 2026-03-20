import {
  Checkbox,
  FormControl,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import { capitalCase } from "change-case";
import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const _weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const WeekDays = () => {
  const { t } = useTranslation();
  const { field } = useController({
    name: "withdrawal_open_days",
  });

  const { setValue } = useFormContext();

  const onChange = (day) => () => {
    const currentDays = [...field.value];

    const itemIndex = currentDays.findIndex((v) => day === v);
    if (itemIndex > -1) {
      if (currentDays.length === 1) return;
      currentDays.splice(itemIndex, 1);
    } else {
      currentDays.push(day);
    }
    setValue("withdrawal_open_days", currentDays);
  };

  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
      >
        {_weekDays.map((day) => {
          const isActive = field.value.includes(capitalCase(day));
          return (
            <FormControlLabel
              value={day}
              control={
                <Checkbox
                  size="small"
                  checked={isActive}
                  onClick={onChange(capitalCase(day))}
                />
              }
              label={capitalCase(t(day))}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default WeekDays;
