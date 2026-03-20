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

import useAddVideo from "./hooks/useAddVideo";
import Translate from "src/components/translate";
import { useTranslation } from "react-i18next";
import Transition from "src/utils/dialog-animation";

const AddDialog = ({ fetchVideo }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { methods, onSubmit } = useAddVideo(() => {
    fetchVideo();
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
        <Translate> {"tools.videos.addVideo"}</Translate>
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
                    label={t("tools.videos.title")}
                    variant="outlined"
                    error={Boolean(errors.title)}
                    helperText={t(errors.title?.message)}
                  />
                </FormControl>
              </Box>
              <Box mt={3}>
                <FormControl fullWidth>
                  <TextField
                    {...methods.register("video_tool_url")}
                    id="video-url"
                    label={t("tools.videos.videoURLs")}
                    variant="outlined"
                    error={Boolean(errors.video_tool_url)}
                    helperText={t(errors.video_tool_url?.message)}
                  />
                </FormControl>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus color="error" name="close">
              <Translate>{"tools.videos.close"}</Translate>
            </Button>
            <LoadingButton
              loading={methods.formState.isSubmitting}
              type="submit"
              variant="contained"
              autoFocus
              name="submit"
              onClose={handleClose}
            >
              <Translate>{"tools.videos.submit"}</Translate>
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default AddDialog;
