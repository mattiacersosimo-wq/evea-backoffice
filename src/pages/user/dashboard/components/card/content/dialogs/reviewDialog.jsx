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
import useReviewForm from "./hooks/useReviewForm";

const ReviewDialog = ({ name }) => {
  const { methods, onSubmit } = useReviewForm();

  const { open } = useDialogContext();

  return (
    <CustomDialog name={name}>
      <DialogTitle>Add Review</DialogTitle>
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
              name="review"
              label="Write your review"
              multiline
              minRows={4}
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

export default ReviewDialog;
