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

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const DeleteDialog = ({
  open,
  selectedId,
  onClose,
  fetchData,
  handleCloseMenu,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");

    try {
      const { data } = await axiosInstance.post(
        `/api/admin/support-tickets/${selectedId}`,
        reqData
      );

      const { status, message } = data;
      if (status) {
        enqueueSnackbar(message);
        onClose();
        fetchData();
        handleCloseMenu();
        return;
      }
    } catch (err) {
      Object.values(err).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };
  const { palette } = useTheme();

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-category"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-category">
        {"adminCommunication.helpCenter.deleteTicket"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Box
            sx={{
              display: "grid",
              rowGap: 3,
              columnGap: 2,
              marginTop: 2,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
              },
            }}
          >
            <Typography>
              {"adminCommunication.helpCenter.areYouSure"}
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          autoFocus
          sx={{ color: palette.warning.normal }}
        >
          Close
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          {"adminCommunication.helpCenter.delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
