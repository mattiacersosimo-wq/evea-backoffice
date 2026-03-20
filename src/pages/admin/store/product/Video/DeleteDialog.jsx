import { DialogContent } from "@material-ui/core";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
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

const DeleteDialog = ({ videoId, onClose, fetchData }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const data = new FormData();
    data.append("_method", "DELETE");

    const { status, data: responseData } = await axiosInstance.post(
      `/api/admin/product-videos/${videoId}`,
      data
    );

    if (status === 200) {
      enqueueSnackbar(responseData.message);
      onClose();
      fetchData();

      return;
    }
    enqueueSnackbar("Failed to delete the video", { variant: "error" });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={Boolean(videoId)}
      onClose={onClose}
      aria-labelledby="delete-video"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-video">
        <Translate>{"products.video.deleteVideo"}</Translate>
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
              <Translate>{"products.video.areYouSure"}</Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          name="delete"
        >
          <Translate> {"products.video.delete"}</Translate>
        </Button>
        <Button onClick={onClose} name="cancel">
          <Translate> {"products.video.cancel"}</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
