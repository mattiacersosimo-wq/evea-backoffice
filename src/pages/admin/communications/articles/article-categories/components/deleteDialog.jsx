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

const DeleteDialog = ({ open, selectedId, onClose, fetchData }) => {
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const data = new FormData();
    data.append("_method", "DELETE");

    try {
      const { status, data: responseData } = await axiosInstance.post(
        `/api/admin/article-categories/${selectedId}`,
        data
      );

      if (status === 200) {
        enqueueSnackbar(responseData.message);
        onClose();
        fetchData();
        return;
      }
    } catch (err) {
      Object.values(err).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-category"
    >
      <DialogTitle id="delete-category">
        <Translate>articles.categories.delete.title</Translate>
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
              <Translate>articles.categories.delete.msg</Translate>
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
          <Translate>articles.categories.delete.submit</Translate>
        </Button>
        <Button onClick={onClose} name="cancel">
          <Translate>articles.categories.delete.cancel</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
