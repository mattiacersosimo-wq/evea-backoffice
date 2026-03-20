import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FormProvider } from "src/components/hook-form";
import useEdit from "./hooks/useEdit";
import Transition from "src/utils/dialog-animation";

const EditDialog = ({ editId, onClose }) => {
  const theme = useTheme();
  const { methods, onSubmit } = useEdit(editId, onClose);

  const {
    formState: { isSubmitting, errors },
  } = methods;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={Boolean(editId)}
      onClose={onClose}
      aria-labelledby="edit-document"
      TransitionComponent={Transition}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle id="edit-document">Edit Sample Document</DialogTitle>
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
              <TextField
                name="sample_doc"
                type="file"
                label="upload document"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ accept: ".xlsx, .xls, .pdf" }}
                {...methods.register("sample_doc")}
                error={Boolean(errors.sample_doc)}
                helperText={errors.sample_doc?.message}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={onClose}
            autoFocus
            color="error"
            name="close"
          >
            Close
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            name="update"
          >
            update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default EditDialog;
