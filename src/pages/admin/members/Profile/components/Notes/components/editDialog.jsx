import { yupResolver } from "@hookform/resolvers/yup";
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

import axiosInstance from "src/utils/axios";
import * as yup from "yup";
import { useMemberProfileContext } from "../../..";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const NotesEditDialog = ({ open, onClose, title, methods, fetchNotes }) => {
  const { memberProfile } = useMemberProfileContext();

  const memberName = memberProfile?.user_profile?.username;

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async ({ notes, id }) => {
    const reqData = new FormData();
    reqData.append("notes", notes);
    reqData.append("_method", "PUT");

    try {
      const { status, data: resData } = await axiosInstance.post(
        `/api/admin/notes/${id}`,
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
      <DialogTitle id="tool-doc">{title}</DialogTitle>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            <Box mt={3}>
              <FormControl fullWidth>
                <RHFTextField
                  name="username"
                  label="Username"
                  variant="outlined"
                  disabled
                  value={memberName}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </Box>

            <Box mt={3}>
              <FormControl fullWidth>
                <RHFTextField
                  name="notes"
                  id="notes"
                  label="Notes"
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
