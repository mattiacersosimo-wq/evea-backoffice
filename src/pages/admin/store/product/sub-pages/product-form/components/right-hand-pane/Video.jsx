import { Card, Stack } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";

const Video = () => {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1}>
        <RHFTextField name="video" label={"products.add.addVimeoVideo"} />
      </Stack>
    </Card>
  );
};
export default Video;
