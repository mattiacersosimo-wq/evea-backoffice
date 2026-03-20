import { Card, Stack } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";
import LabelStyle from "src/components/label-style";
import Translate from "src/components/translate";

import SingleFileUpload from "src/pages/admin/communications/blogs/components/BlogForm/components/SingleFileUpload";

const HostDetails = () => {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1}>
        <LabelStyle>
          <Translate>events.add_event.host_details</Translate>
        </LabelStyle>
        <RHFTextField
          name="host"
          label={"events.add_event.host"}
          style={{ marginTop: "1rem" }}
        />
        <RHFTextField
          name="topic"
          label={"events.add_event.topic"}
          style={{ marginTop: "1rem" }}
        />
        <SingleFileUpload />
      </Stack>
    </Card>
  );
};

export default HostDetails;
