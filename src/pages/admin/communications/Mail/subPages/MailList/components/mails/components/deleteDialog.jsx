import { DialogContent } from "@material-ui/core";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Transition from "src/utils/dialog-animation";

const DeleteDialog = ({ selectedId, open, onClose, handleDelete }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-mail"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-mail">
        {"adminCommunication.mail.deleteMail"}{" "}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography>{"adminCommunication.mail.areYouSure"}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{"adminCommunication.mail.cancel"}</Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          {"adminCommunication.mail.delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
