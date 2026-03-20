import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import { useTheme } from "@mui/material/styles";

const DeleteDialog = ({ open, onClose, selectedId, reload }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const reqData = new FormData();

    reqData.append("_method", "DELETE");

    try {
      const { data } = await axiosInstance.post(
        `/api/admin/currency/${selectedId}`,
        reqData
      );

      const { message, status } = data;
      if (status) {
        enqueueSnackbar(message);
        reload();
        onClose();
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };
  const { palette } = useTheme();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Translate>settings.currency.delete_dialog</Translate>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Translate>settings.currency.are_you</Translate>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{color: palette.error.main}}>
          <Translate>settings.currency.cancel</Translate>
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          <Translate>settings.currency.delete</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
