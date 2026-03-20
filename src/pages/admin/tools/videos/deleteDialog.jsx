import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
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
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/tool-videos/${deleteId}`,
        reqData
      );

      if (status === 200) {
        enqueueSnackbar(data.message);
        onClose();
        reload();
        return;
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-document"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-document">
        <Translate>{"tools.videos.deleteVideos"}</Translate>
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
              <Translate>{"tools.videos.areYouSure"}</Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: theme.palette.error.main }}>
          <Translate> {"tools.videos.cancel"} </Translate>
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          <Translate> {"tools.videos.delete"}</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
