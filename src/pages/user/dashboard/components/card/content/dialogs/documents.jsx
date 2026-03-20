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
import useDocumentForm from "./hooks/useDocumentForm.js.js";

const DocumentDialog = ({ name }) => {
  const { methods, onSubmit } = useDocumentForm();
  const { open } = useDialogContext();

  return (
    <CustomDialog name={name}>
      <DialogTitle>Add Document</DialogTitle>
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
              name="document"
              type="file"
              label="Paste URL here"
              InputLabelProps={{ shrink: true }}
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

export default DocumentDialog;
