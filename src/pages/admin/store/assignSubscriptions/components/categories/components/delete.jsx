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

const DeleteCategory = ({ deleteId, onClose, fetchData, open }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const data = new FormData();
    data.append("_method", "DELETE");

    const { status, data: responseData } = await axiosInstance.post(
      `/api/admin/product-subscription-categories/${deleteId}`,
      data
    );

    if (status === 200) {
      enqueueSnackbar(responseData.message);
      onClose();
      fetchData();

      return;
    }
    enqueueSnackbar("Failed to delete Category", { variant: "error" });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-Category"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-Category">
        <Translate>{"assign_subscriptions.delete_category"}</Translate>
      </DialogTitle>
      <DialogContent>
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
          <DialogContentText>
            <Typography>
              <Translate>{"assign_subscriptions.areYouSure"}</Translate>
            </Typography>
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} name="cancel">
          <Translate> {"assign_subscriptions.cancel"}</Translate>
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          name="delete"
        >
          <Translate> {"assign_subscriptions.delete"}</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCategory;
