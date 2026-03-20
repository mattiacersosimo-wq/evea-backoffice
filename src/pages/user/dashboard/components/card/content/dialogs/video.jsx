import { LoadingButton } from "@mui/lab";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { CustomDialog, useDialogContext } from "src/components/customDialog";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import useVideoForm from "./hooks/useVideoForm";

const VideoDialog = ({ name }) => {
  const { methods, onSubmit } = useVideoForm();
  const { open } = useDialogContext();

  return (
    <CustomDialog name={name}>
      <DialogTitle>Add Video</DialogTitle>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent
          sx={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <DialogContentText>
            <RHFTextField
              style={{
                marginTop: "1rem",
              }}
              name="video"
              label="Paste URL here"
            />
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            loading={methods.formState.isSubmitting}
            variant="outlined"
          >
            Add
          </LoadingButton>
          <Button onClick={() => open("")} color="error">
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </CustomDialog>
  );
};

export default VideoDialog;
