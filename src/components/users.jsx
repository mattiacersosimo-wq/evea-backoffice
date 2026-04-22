import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useUsersList from "src/components/UsersAutoComplete/hooks/useUsersList";

const filterBoth = createFilterOptions({
  stringify: (option) =>
    `${option.username ?? ""} ${option.unique_id ?? ""}`,
});

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
          filterOptions={filterBoth}
          getOptionLabel={(option) =>
            option.unique_id
              ? `${option.username} · #${option.unique_id}`
              : option.username || ""
          }
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ display: "flex", justifyContent: "space-between !important", gap: 1 }}>
              <Typography sx={{ fontSize: "0.88rem", fontWeight: 600 }}>{option.username}</Typography>
              {option.unique_id && (
                <Typography sx={{ fontSize: "0.72rem", color: "#7A6A5C", fontFamily: "monospace" }}>
                  #{option.unique_id}
                </Typography>
              )}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              label={t(label)}
              placeholder={t(label) + " o ID"}
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
