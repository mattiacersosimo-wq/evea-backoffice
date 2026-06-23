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

import useDeleteProduct from "./hooks/useDeleteProduct";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const DeleteProductDialog = ({ itemId, onClose, refresh }) => {
  const theme = useTheme();
  const deleteProduct = useDeleteProduct();
  const handleDelete = async () => {
    const status = await deleteProduct(itemId);
    if (status) {
      onClose();
      refresh();
      return;
    }
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={Boolean(itemId)}
      onClose={onClose}
      aria-labelledby="delete-product"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-product">
        <Translate>{"products.delete.delete_product"}</Translate>
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
              <Translate>{"products.delete.areYouSure"}</Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} name="cancel">
          <Translate> {"products.delete.cancel"}</Translate>
        </Button>
        <Button
          onClick={() => handleDelete()}
          variant="contained"
          color="error"
          name="delete"
        >
          <Translate> {"products.delete.delete"}</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductDialog;
