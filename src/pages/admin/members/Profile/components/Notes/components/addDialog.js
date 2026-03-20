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

import useAddNotes from "./hooks/useAddNotes";
import Translate from "src/components/translate";
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
  return (
    <div>
      <Button
        variant="contained"
        size="small"
        startIcon={<Iconify icon={"carbon:add"} />}
        onClick={handleClickOpen}
        name="add"
      >
        <Translate>{"tools.videos.addVideo"}</Translate>
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
            <Translate>{"tools.videos.addVideo"}</Translate>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Box mt={3}>
                <FormControl fullWidth>
                  <TextField
                    {...methods.register("title")}
                    id="video-title"
                    label={"tools.videos.title"}
                    variant="outlined"
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                  />
                </FormControl>
              </Box>
              <Box mt={3}>
                <FormControl fullWidth>
                  <TextField
                    {...methods.register("video_tool_url")}
                    id="video-url"
                    label={"tools.videos.videoURLs"}
                    variant="outlined"
                    error={Boolean(errors.video_tool_url)}
                    helperText={errors.video_tool_url?.message}
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
              {"tools.videos.submit"}
            </LoadingButton>
            <Button onClick={handleClose} autoFocus color="error" name="close">
              {"tools.videos.close"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default AddDialog;
