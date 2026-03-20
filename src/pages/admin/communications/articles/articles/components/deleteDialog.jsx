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

const DeleteDialog = ({ open, selectedId, onClose, fetchData }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const data = new FormData();
    data.append("_method", "DELETE");
    const { status, data: responseData } = await axiosInstance.post(
      `/api/admin/articles/${selectedId}`,
      data
    );

    if (status === 200) {
      enqueueSnackbar(responseData.message);
      onClose();
      fetchData();
      return;
    }
    enqueueSnackbar("Failed to delete the article", { variant: "error" });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-article"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-article">
        <Translate>articles.articles.delete.title</Translate>
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
              <Translate>articles.articles.delete.msg</Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} name="cancel">
          <Translate>articles.articles.delete.cancel</Translate>
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          name="delete"
        >
          <Translate>articles.articles.delete.submit</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
