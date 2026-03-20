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

import useDelete from "./hooks/use-delete-dialog";
import Transition from "src/utils/dialog-animation";

const DeleteDialog = ({ deleteId, onClose, fetchData, open }) => {
  const theme = useTheme();

  const handleDelete = useDelete(deleteId, () => {
    fetchData();
    onClose();
  });

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-Subscription"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-Subscription">
        {"adminStore.assignSubscriptions.deleteSubscription"}
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
              {"adminStore.assignSubscriptions.areYouSure"}
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} name="cancel">
          {"adminStore.assignSubscriptions.cancel"}
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          name="delete"
        >
          {"adminStore.assignSubscriptions.delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
