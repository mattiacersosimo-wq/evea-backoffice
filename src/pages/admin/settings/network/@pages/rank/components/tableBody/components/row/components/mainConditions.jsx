import { TextField } from "@mui/material";
import { isBinary } from "src/utils/isBinary";

const MainConditions = ({ rank, count, leg, keyNumber, onChange, onBlur }) => {
  return (
    <>
      <td>
        <TextField
          select
          fullWidth
          SelectProps={{ native: true }}
          size="small"
          style={{ width: 190 }}
          value={rank}
          name={`condition${keyNumber}_personal_rank`}
          onChange={onChange}
          onBlur={onBlur}
        >
          <option selected="" value="0">
            No Rank
          </option>
          <option value={1}>Customers</option>
          <option value={2}>Active Customer</option>
          <option value={3}>Business Builder</option>
          <option value={4}>Bronze Executive</option>
          <option value={5}>Silver Executive</option>
          <option value={6}>Gold Executive</option>
          <option value={7}>Emerald Executive</option>
        </TextField>
      </td>
      <td>
        <TextField
          name={`condition${keyNumber}_count`}
          value={count}
          type="number"
          size="small"
          defaultValue="51"
          style={{ width: 80 }}
          onChange={onChange}
          onBlur={onBlur}
        />
      </td>

      {isBinary() && (
        <td>
          <TextField
            select
            fullWidth
            SelectProps={{ native: true }}
            size="small"
            style={{ width: 150 }}
            value={leg}
            name={`condition${keyNumber}_leg`}
            onChange={onChange}
            onBlur={onBlur}
          >
            <option selected="" value="1">
              Left
            </option>
            <option value="2">Right</option>
            <option value="3">Left & Right</option>
            <option value="4">Left or Right</option>
          </TextField>
        </td>
      )}
    </>
  );
};

export default MainConditions;
