import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { capitalCase } from "change-case";
import Map from "src/components/map";
import TYPES from "../TYPES";

const DateDropdown = ({ onDateChange, dateRange }) => {
  const { palette } = useTheme();
  const { value } = dateRange;

  return (
    <TextField
      select
      fullWidth
      SelectProps={{ native: true }}
      sx={{
        "& fieldset": {},
        "& select": {
          pl: 1,
          py: 0.5,
          pr: "24px !important",
          typography: "subtitle2",
          fontSize: "13px",
          color: palette.grey[500],
          fontWeight: "400",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: 0.75,
        },
        "& .MuiNativeSelect-icon": {
          top: 4,
          right: 2,
          width: 15,
          height: 15,
        },
      }}
      value={value}
      onChange={(e) => onDateChange(e.target.value)}
    >
      <Map
        list={Object.values(TYPES)}
        render={(v, i) => (
          <option value={v} key={i}>
            {capitalCase(v)}
          </option>
        )}
      />
    </TextField>
  );
};

export default DateDropdown;
