import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useUsersList from "./hooks/useUsersList";

const UsersSearch = ({
  isFundTransfer,
  name,
  multiple = false,
  limitTags = 1,
  inputProps = {},
  props = {},
  query = {},
}) => {
  const {
    onSearch,
    usersList: options,
    fetchData,
  } = useUsersList(isFundTransfer, query);
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const selected = watch(name);
  const value = multiple
    ? options.find(({ user_id }) => selected.includes(user_id)) || []
    : options.find(({ user_id }) => user_id === selected) || null;

  useEffect(() => {
    if (Boolean(selected) && !options.length) {
      fetchData("", { user_id: selected });
    }
  }, [selected, options]);

  const { t } = useTranslation();

  return (
    <Autocomplete
      noOptionsText={t("global.no_data")}
      limitTags={limitTags}
      multiple={multiple}
      value={value}
      onChange={(_, v) => {
        if (v)
          setValue(
            name,
            multiple ? v.map(({ user_id }) => user_id) : v.user_id
          );
        else setValue(name, null);
      }}
      options={options}
      getOptionLabel={({ username }) => username}
      {...props}
      renderInput={(params) => (
        <TextField
          label={t("search.user")}
          name="user-search"
          error={Boolean(errors[name])}
          helperText={t(errors[name]?.message)}
          {...inputProps}
          {...params}
          onChange={onSearch}
        />
      )}
    />
  );
};

export default UsersSearch;
