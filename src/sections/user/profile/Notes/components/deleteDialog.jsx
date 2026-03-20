import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const DeleteDialog = ({ deleteId, onClose, fetchNotes }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const data = new FormData();
    data.append("_method", "DELETE");

    const { status } = await axiosInstance.post(
      `/api/admin/notes/${deleteId}`,
      data
    );

    if (status === 200) {
      enqueueSnackbar("Deleted the notes");
      onClose();
      fetchNotes();
      return;
    }
    enqueueSnackbar("Failed to delete the notes", { variant: "error" });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={Boolean(deleteId)}
      onClose={onClose}
      aria-labelledby="delete-document"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-document">
        <Translate>profile.notes.dialog.delete.title</Translate>
      </DialogTitle>
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
            <Typography>
              {" "}
              <Translate>profile.notes.dialog.delete.message</Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} variant="contained" color="error">
          <Translate>profile.notes.dialog.delete.submit</Translate>
        </Button>
        <Button onClick={onClose}>
          {" "}
          <Translate>profile.notes.dialog.delete.cancel</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
