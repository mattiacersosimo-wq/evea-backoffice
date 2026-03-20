import React from "react";
import { useFormContext } from "react-hook-form";
import { RHFTextField } from "src/components/hook-form";
import { isValidNumber } from "src/utils/validators";

const Mobile = () => {
  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const onChange = ({ target: { value, name } }) => {
    if (value.length === 10) {
      clearErrors(name);
    }
    isValidNumber(value) && setValue(name, value);
  };

  const onBlur = ({ target: { value, name } }) => {
    if (value.length !== 10) {
      setError(
        name,
        {
          message: "Enter a valid phone number",
        },
        {
          shouldFocus: true,
        }
      );
      return;
    }
    clearErrors(name);
  };

  return (
    <RHFTextField
      name="mobile"
      label="Phone Number *"
      onChange={onChange}
      onBlur={onBlur}
      helperText={errors.mobile?.message}
    />
  );
};

export default Mobile;
