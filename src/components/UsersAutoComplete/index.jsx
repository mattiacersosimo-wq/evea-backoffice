import { Autocomplete, Chip, TextField } from "@mui/material";
import useUsersList from "./hooks/useUsersList";

const UserAutoComplete = ({ onChange, multiple = true, freeSolo = true }) => {
  const usersList = useUsersList();

  return (
    <Autocomplete
      multiple={multiple}
      freeSolo={freeSolo}
      onChange={onChange}
      options={usersList}
      getOptionLabel={(option) => option.username}
      renderProducts={(value, getUsersProps) =>
        value.map((option, index) => (
          <Chip
            {...getUsersProps({ index })}
            key={option}
            size="small"
            label={option}
          />
        ))
      }
      renderInput={(params) => <TextField label="Users" {...params} />}
    />
  );
};

export default UserAutoComplete;
