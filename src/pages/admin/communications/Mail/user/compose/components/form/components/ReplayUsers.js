import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useUsersList from "src/components/autoComplete/users/hooks/useUsersList";

const ReplayUsers = ({ userId }) => {
  const usersList = useUsersList();
  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [selected, setSelected] = useState([]);
  const data =
    usersList.find(({ user_id }) => user_id === parseInt(userId)) || null;
  useEffect(() => {
    if (data) {
      setSelected([...selected, data]);
    }
    let newFormValues = [...getValues("to_users_id")];
    newFormValues[0] = userId;
    setValue("to_users_id", newFormValues);
  }, [data, userId]);
  const { message: errorMessage } = errors?.to_users_id || {};
  const onChange = (_, v) => {
    setValue(
      "to_users_id",
      v.map(({ user_id }) => user_id)
    );
    setSelected(v);
  };
  return (
    <Autocomplete
      value={selected}
      multiple
      options={usersList}
      onChange={onChange}
      getOptionLabel={(option) => option.username}
      renderInput={(params) => (
        <TextField
          error={Boolean(errorMessage)}
          helperText={errorMessage}
          label={"adminCommunication.mail.users"}
          {...params}
        />
      )}
    />
  );
};

export default ReplayUsers;
