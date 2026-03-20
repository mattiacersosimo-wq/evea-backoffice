import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import Translate from "src/components/translate";

const ApproveCancelDialog = ({ open, onClose, onConfirm, message }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", mb: 1 }}>
        <Translate>{message}</Translate>
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <Typography textAlign="center">
          <Translate>tools.videos.areYouSure</Translate>
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error">
          <Translate>global.cancel</Translate>
        </Button>
        <Button onClick={onConfirm} variant="contained">
          <Translate>global.confirm</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveCancelDialog;
