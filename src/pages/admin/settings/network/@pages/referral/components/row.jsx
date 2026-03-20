import {
  CircularProgress,
  InputAdornment,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";

const Row = ({
  id,
  rank_name: rankName,
  referral_bonus: referralBonus,
  onSubmit,
  handleUpdate,
}) => {
  return (
    <TableRow key={id}>
      <TableCell>
        <TextField type="text" size="small" value={rankName} disabled />
      </TableCell>
      <TableCell>
        <LoadingTextField
          handleUpdate={handleUpdate(id)}
          value={referralBonus}
          name="referralBonus"
        />
      </TableCell>
    </TableRow>
  );
};
const LoadingTextField = ({ value, name, handleUpdate }) => {
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    setLoading(true);
    handleUpdate(e);
  };

  return (
    <TextField
      type="number"
      onChange={onChange}
      size="small"
      value={value}
      name={name}
    />
  );
};

export default Row;
