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

const DeleteDialog = ({ open, selectedId, onClose, fetchData }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const data = new FormData();
    data.append("_method", "DELETE");

    try {
      const { status, data: responseData } = await axiosInstance.post(
        `/api/admin/product-categories/${selectedId}`,
        data
      );

      if (status === 200) {
        enqueueSnackbar(responseData.message);
        onClose();
        fetchData();
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
      aria-labelledby="delete-category"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-category">
        <Translate>products.category.delete_product_category</Translate>
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
              <Translate>products.category.delete_msg</Translate>
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
          <Translate>products.category.delete</Translate>
        </Button>
        <Button onClick={onClose} name="close">
          <Translate>products.category.close</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
