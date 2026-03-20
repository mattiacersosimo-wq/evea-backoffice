import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import useUsersList from "src/components/autoComplete/users/hooks/useUsersList";

const UserList = ({
  getOptionLabel,
  name,
  label,
  multiple,
  defaultValue,
  size,
  ...rest
}) => {
  const { usersList: options } = useUsersList();

  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { ref, onChange, ...field } }) => (
        <Autocomplete
          limitTags={1}
          defaultValue={defaultValue}
          multiple={multiple}
          onChange={(_, v) => {
            multiple
              ? onChange(v.map(({ user_id }) => user_id))
              : onChange(v.user_id);
          }}
          options={options}
          getOptionLabel={getOptionLabel}
          renderInput={(params) => (
            <TextField
              label={label}
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

export default UserList;
