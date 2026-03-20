import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import useUsersList from "src/components/autoComplete/users/hooks/useUsersList";
const UserTextField = () => {
  const userList = useUsersList();
  const {
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext();

  return (
    <div>
      <Controller
        render={({ field: { ref, onChange, ...rest } }) => (
          <Autocomplete
            onChange={(_, value) => onChange(value.user_id)}
            options={userList}
            getOptionLabel={(option) => option.username}
            renderInput={(params) => (
              <TextField
                label="Select New Owner"
                {...params}
                {...rest}
                inputRef={ref}
                error={Boolean(errors.user_id)}
                helperText={errors.user_id?.message}
              />
            )}
          />
        )}
        control={control}
        name="user_id"
        defaultValue={null}
      />
    </div>
  );
};
export default UserTextField;
