import { Autocomplete, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

import useDepartmentList from "./hooks/useDepartmentList";
import { useTranslation } from "react-i18next";

const Departments = ({ name, multiple, limitTags = 1 }) => {
  const options = useDepartmentList();

  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const selected = watch(name);
  const value = multiple
    ? options.filter(({ id }) => selected.includes(id)) || []
    : options.find(({ id }) => id === selected) || null;

  return (
    <Autocomplete
      multiple={multiple}
      options={options}
      limitTags={limitTags}
      value={value}
      getOptionLabel={({ name }) => name}
      onChange={(_, v) => {
        setValue(name, multiple ? v.map(({ id }) => id) : v.id);
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            fullWidth
            error={Boolean(errors[name])}
            helperText={errors[name]?.message}
            label={t("sub_admin.departments")}
          />
        );
      }}
    />
  );
};

export default Departments;
