import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";

import useSubAdminDelete from "./hooks/useDelete";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const DeleteDialog = ({
  selectedId,
  name,
  openedDialog,
  onClose,
  fetchData,
}) => {
  const handleDelete = useSubAdminDelete(selectedId, (reload = false) => {
    if (reload) fetchData();
    handleClose();
  });
  const [open, setOpen] = useState(false);

  const { palette } = useTheme();
  useMemo(() => {
    setOpen(openedDialog === name);
  }, [openedDialog]);
  const handleClose = () => {
    onClose();
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      TransitionComponent={Transition}
    >
      <DialogTitle id="alert-dialog-title">
        <Translate>{"sub_admin.sub_admin_delete"}</Translate>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText id="alert-dialog-description">
          <Translate> {"sub_admin.reversed"}</Translate>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          autoFocus
          sx={{ color: palette.error.main }}
        >
          <Translate>{"sub_admin.cancel"}</Translate>
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          <Translate> {"sub_admin.delete"}</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
