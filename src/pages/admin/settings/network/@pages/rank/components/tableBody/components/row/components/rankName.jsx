import { TextField } from "@mui/material";

const RankName = ({ value }) => (
  <td>
    <TextField
      name="rank_name"
      type="text"
      size="small"
      disabled
      value={value}
      style={{ width: 160 }}
    />
  </td>
);

export default RankName;
