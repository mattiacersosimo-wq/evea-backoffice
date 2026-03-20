import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import useUsersList from "./hooks/useUsersList";

//? sample: https://codesandbox.io/s/material-demo-urobl?file=/demo.js:247-346
const filterOptions = createFilterOptions({
  stringify: (option) => option.username + option.email,
});

const UsersSearch = ({
  name,
  multiple = false,
  limitTags = 1,
  inputProps = {},
  props = {},
  query = {},
}) => {
  const { onSearch, usersList: options, fetchData } = useUsersList(query);
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

  return (
    <Autocomplete
      noOptionsText="no data available"
      limitTags={limitTags}
      multiple={multiple}
      filterOptions={filterOptions}
      value={value}
      onChange={(_, v) => {
        console.log(v);
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
          label="Search User"
          error={Boolean(errors[name])}
          helperText={errors[name]?.message}
          {...inputProps}
          {...params}
          onChange={onSearch}
        />
      )}
    />
  );
};

export default UsersSearch;
