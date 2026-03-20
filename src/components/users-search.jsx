import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import useUsersList from "src/components/autoComplete/users/hooks/useUsersList.js";

const UsersSearch = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { usersList, onSearch, fetchData } = useUsersList();
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const [selected, setSelected] = useState([]);
  const { message: errorMessage } = errors?.to_users_id || {};
  const onChange = (_, v) => {
    setValue(
      "to_users_id",
      v.map(({ user_id }) => user_id)
    );
    setSelected(v);
  };

  useEffect(() => {
    const initialLoad = async (id) => {
      const data = await fetchData("", { user_id: id });
      setSelected(data);
    };

    if (id) {
      setValue("to_users_id", [parseInt(id)]);
      initialLoad(id);
    }
  }, [id]);

  return (
    <Autocomplete
      size="small"
      value={selected}
      multiple
      options={usersList}
      onChange={onChange}
      getOptionLabel={(option) => option.username}
      renderInput={(params) => (
        <TextField
          error={Boolean(errorMessage)}
          helperText={t(errorMessage)}
          label={t("admin_email.compose.users")}
          {...params}
          onChange={onSearch}
        />
      )}
    />
  );
};

export default UsersSearch;
