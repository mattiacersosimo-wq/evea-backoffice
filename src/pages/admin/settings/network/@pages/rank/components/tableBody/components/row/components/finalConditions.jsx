import { TextField } from "@mui/material";

const FinalCondition = ({ team, consecutive, onChange, onBlur }) => (
  <>
    <td>
      <TextField
        type="number"
        size="small"
        name="team_volume"
        defaultValue={team}
        style={{ width: 80 }}
        onChange={onChange}
        onBlur={onBlur}
      />
    </td>
    <td>
      <TextField
        type="number"
        size="small"
        name="consecutive"
        defaultValue={consecutive}
        style={{ width: 80 }}
        onChange={onChange}
        onBlur={onBlur}
      />
    </td>
  </>
);

export default FinalCondition;
