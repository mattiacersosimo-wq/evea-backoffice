import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import useDelete from "./hooks/use-delete";

const Delete = ({ id, onClose, reload }) => {
  const { onDelete, loading } = useDelete(id, () => {
    reload();
    onClose();
  });

  return (
    <Dialog open={Boolean(id)} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>Delete Field</DialogTitle>
      <DialogContent>
        Are you sure you want to continue?this action cannot be reversed.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          cancel
        </Button>
        <LoadingButton loading={loading} onClick={onDelete} variant="contained">
          delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default Delete;
