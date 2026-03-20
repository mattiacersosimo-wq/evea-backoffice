import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useState } from "react";
import Iconify from "src/components/Iconify";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import useAddNotes from "./hooks/useAddNotes";
import Transition from "src/utils/dialog-animation";

const AddDialog = ({ fetchNotes }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { methods, onSubmit } = useAddNotes(() => {
    fetchNotes();
    handleClose();
  });
  const {
    formState: { errors },
  } = methods;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { t } = useTranslation();
  return (
    <div>
      <Button
        variant="contained"
        size="small"
        startIcon={<Iconify icon={"carbon:add"} />}
        onClick={handleClickOpen}
        name="add"
      >
        <Translate>profile.notes.button</Translate>
      </Button>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="tool-video"
        TransitionComponent={Transition}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogTitle id="responsive-dialog-title">
            <Translate>profile.notes.dialog.add.title</Translate>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Box mt={3}>
                <FormControl fullWidth>
                  <TextField
                    {...methods.register("notes")}
                    id="notes"
                    label={t("global.notes")}
                    variant="outlined"
                    error={Boolean(errors.notes)}
                    helperText={t(errors.notes?.message)}
                  />
                </FormControl>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={methods.formState.isSubmitting}
              type="submit"
              variant="contained"
              autoFocus
              name="submit"
              onClose={handleClose}
            >
              <Translate>profile.notes.dialog.add.submit</Translate>
            </LoadingButton>
            <Button onClick={handleClose} autoFocus color="error" name="close">
              <Translate>profile.notes.dialog.add.cancel</Translate>
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default AddDialog;
