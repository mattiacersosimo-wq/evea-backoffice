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

const DeleteDialog = ({ open, deleteId, onClose, reload }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const data = new FormData();
    data.append("_method", "DELETE");

    const { status } = await axiosInstance.post(
      `/api/admin/tool-documents/${deleteId}`,
      data
    );

    if (status === 200) {
      enqueueSnackbar("Deleted the document");
      onClose();
      reload();
      return;
    }
    enqueueSnackbar("Failed to delete the document", { variant: "error" });
  };

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-document"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-document">
        <Translate>tools.documents.deleteDocument</Translate>
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
              <Translate> {"tools.documents.areYousure"}</Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          name="cancel"
          sx={{ color: theme.palette.error.main }}
        >
          <Translate>{"tools.documents.cancel"}</Translate>
        </Button>

        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          name="delete"
        >
          <Translate> {"tools.documents.delete"}</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
