import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useUsersList from "src/components/UsersAutoComplete/hooks/useUsersList";

const Users = ({
  type = null,
  isKyc,
  name,
  label,
  size,
  defaultValue,
  ...rest
}) => {
  const usersList = useUsersList(type, isKyc);

  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { ref, onChange, ...field } }) => (
        <Autocomplete
          clearOnBlur
          clearOnEscape
          defaultValue={defaultValue}
          onChange={(_, v) => {
            if (v) onChange(v.user_id);
            else onChange("");
          }}
          options={usersList}
          getOptionLabel={(option) => option.username}
          renderInput={(params) => (
            <TextField
              label={t(label)}
              {...field}
              {...params}
              inputRef={ref}
              error={Boolean(errors[name])}
              helperText={errors[name]?.message}
              size={size}
            />
          )}
          {...rest}
        />
      )}
    />
  );
};

export default Users;
