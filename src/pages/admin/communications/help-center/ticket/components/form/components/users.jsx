import { Autocomplete, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import useUsersList from "src/components/autoComplete/users/hooks/useUsersList";

const Users = () => {
  const users = useUsersList();
  const {
    watch,
    formState: { errors },
    setValue,
  } = useFormContext();
  const userId = watch("user_id");
  const selected = users.find(({ user_id }) => user_id === userId) || null;

  return (
    <Autocomplete
      value={selected}
      onChange={(_, v) => setValue("user_id", v ? v.user_id : null)}
      disablePortal
      id="users"
      options={users}
      getOptionLabel={(item) => item.username}
      renderInput={(params) => (
        <TextField
          {...params}
          label={"adminCommunication.helpCenter.users"}
          placeholder={"adminCommunication.helpCenter.startTyping"}
          error={Boolean(errors.user_id)}
          helperText={errors.user_id?.message}
        />
      )}
    />
  );
};

export default Users;
