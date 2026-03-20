import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";
import useUpdateLead from "./hooks/use-update-lead";

const UpdateDialog = ({ open, onClose, fetchData }) => {
  const { methods, onSubmit } = useUpdateLead(open, () => {
    onClose();
    fetchData();
  });
  return (
    <Dialog
      maxWidth="sm"
      open={open}
      fullWidth
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <Translate>lead_capture.edit_lead</Translate>
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <RHFTextField label="Name" name="name" />
            <RHFTextField label="Email" name="email" />
            <RHFTextField label="Mobile" name="mobile" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={onClose} variant="outlined">
            <Translate>lead_capture.cancel</Translate>
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={methods.formState.isSubmitting}
          >
            <Translate>lead_capture.submit</Translate>
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateDialog;
