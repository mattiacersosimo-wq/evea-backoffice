import PropTypes from "prop-types";
// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import {
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

RHFRadioGroup.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  getOptionLabel: PropTypes.arrayOf(PropTypes.string),
};

export default function RHFRadioGroup({
  name,
  options,
  getOptionLabel,
  ...other
}) {
  const { control } = useFormContext();
  const { t } = useTranslation();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        console.log(field);
        return (
          <div>
            <RadioGroup {...field} row {...other}>
              {options.map((option, index) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={
                    getOptionLabel?.length
                      ? t(getOptionLabel[index])
                      : t(option)
                  }
                />
              ))}
            </RadioGroup>

            {!!error && (
              <FormHelperText error sx={{ px: 2 }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}
