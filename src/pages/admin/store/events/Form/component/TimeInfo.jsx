import { Box, Card, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import LabelStyle from "src/components/label-style";

import TimeList from "./TimeList";
import TimeZones from "./TimeZones";
import Translate from "src/components/translate";

const TimeInfo = () => {
  const { watch } = useFormContext();
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3} mt={2}>
        <LabelStyle>
          <Translate>events.add_event.when</Translate>
        </LabelStyle>

        <Box
          sx={{
            display: "grid",
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            },
          }}
        >
          <RHFDatePicker name="date" label={"events.add_event.date"} />

          <RHFTextField
            type="time"
            name="time"
            label={"events.add_event.time"}
          />
        </Box>
        <LabelStyle>
          <Translate>events.add_event.duration</Translate>
        </LabelStyle>
        <Box
          sx={{
            display: "grid",
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            },
          }}
        >
          <RHFSelect name="hr" label={"events.add_event.hours"}>
            <option value="" />
            <TimeList />
          </RHFSelect>
          <RHFSelect name="min" label={"events.add_event.minutes"}>
            <option value="" />
            <TimeList limit={60} />
          </RHFSelect>
        </Box>
        <RHFSelect
          type="time"
          name="timezone"
          label={"events.add_event.time_zone"}
        >
          <option value="" />
          <TimeZones />
        </RHFSelect>
      </Stack>
    </Card>
  );
};

export default TimeInfo;
