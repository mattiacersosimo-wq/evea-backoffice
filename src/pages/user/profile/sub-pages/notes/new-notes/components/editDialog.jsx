import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const NotesEditDialog = ({ open, onClose, methods, fetchNotes }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async ({ notes, id }) => {
    const reqData = new FormData();
    reqData.append("notes", notes);
    reqData.append("_method", "PUT");

    try {
      const { status, data: resData } = await axiosInstance.post(
        `/api/user/notes/${id}`,
        reqData
      );
      if (status === 200) {
        fetchNotes();
        onClose();
        enqueueSnackbar(resData.message);
      }
    } catch (err) {}
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="tool-doc"
      TransitionComponent={Transition}
    >
      <DialogTitle id="tool-doc">
        <Translate>profile.notes.dialog.edit.title</Translate>
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            <Box mt={3}>
              <FormControl fullWidth>
                <RHFTextField
                  name="global.username"
                  value={user?.username}
                  label="Username"
                  variant="outlined"
                  disabled
                />
              </FormControl>
            </Box>

            <Box mt={3}>
              <FormControl fullWidth>
                <RHFTextField
                  name="notes"
                  id="notes"
                  label="global.note"
                  variant="outlined"
                />
              </FormControl>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            autoFocus
            variant="contained"
            // startIcon={<Iconify icon={"bi:upload"} />}
            name="update"
          >
            <Translate>profile.notes.dialog.edit.submit</Translate>
          </Button>
          <Button onClick={onClose} autoFocus color="error">
            <Translate>profile.notes.dialog.edit.cancel</Translate>
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default NotesEditDialog;
