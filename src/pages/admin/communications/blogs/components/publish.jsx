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
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const PublishDialog = ({ open, selectedId, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const handleDelete = async () => {
    const { status, data: responseData } = await axiosInstance(
      `/api/admin/blog-publish/${selectedId}`
    );

    if (status === 200) {
      navigate(PATH_DASHBOARD.communication.blog);
      enqueueSnackbar(responseData.message);
      onClose();
      return;
    }
    enqueueSnackbar("Failed to publish the blog", { variant: "error" });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-blog"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-blog">Publish Blog</DialogTitle>
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
            <Typography>Are you sure that you want to continue?</Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="primary"
          name="publish"
        >
          Publish
        </Button>
        <Button onClick={onClose} name="cancel">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PublishDialog;
