import { Stack, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { DATE_FORMAT } from "src/config";
import serializeDate from "src/utils/serialize-date";

const DateRangePicker = ({ onChange, dateRange }) => {
  const { start_date, end_date } = dateRange;
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="flex-end"
      sx={{ mt: "20px" }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: "300px",
        }}
      >
        <DatePicker
          value={start_date}
          label="From"
          minDate={serializeDate(moment(end_date).subtract(90, "days"))}
          maxDate={end_date}
          inputFormat={DATE_FORMAT}
          onChange={onChange("start_date")}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              sx={{
                "& input": {
                  fontSize: "12px",
                  color: theme.palette.grey[500],
                },
              }}
            />
          )}
        />
        <DatePicker
          label="To"
          maxDate={serializeDate(moment())}
          value={end_date}
          inputFormat={DATE_FORMAT}
          onChange={onChange("end_date")}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              sx={{
                "& input": {
                  fontSize: "12px",
                  color: theme.palette.grey[500],
                },
              }}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};

export default DateRangePicker;
