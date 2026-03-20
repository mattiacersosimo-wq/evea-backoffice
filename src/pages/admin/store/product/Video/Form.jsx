import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import RHFLoadingButton from "src/components/hook-form/RHFLoadingButton";

import useVideoForm from "./hooks/useVideoForm";
import Translate from "src/components/translate";

const Form = ({ onClose, onSubmit, data, buttonLabel }) => {
  const methods = useVideoForm(data);

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <DialogContent>
        <DialogContentText>
          <Box
            sx={{
              display: "grid",
              rowGap: 3,
              columnGap: 2,
              marginTop: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
              },
            }}
          >
            <RHFTextField
              name="video_url"
              type="text"
              label={"products.video.videoURL"}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <RHFLoadingButton name="submit">{buttonLabel}</RHFLoadingButton>
        <Button onClick={onClose} autoFocus color="error" name="close">
          <Translate>{"products.video.close"}</Translate>
        </Button>
      </DialogActions>
    </FormProvider>
  );
};

export default Form;
