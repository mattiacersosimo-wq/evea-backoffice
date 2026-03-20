import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";
import * as yup from "yup";

const VideoEditDialog = ({
  selectedId,
  open,
  onClose,
  title,
  methods,
  fetchVideos,
}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async ({ title, video_tool_url, id }) => {
    const reqData = new FormData();
    reqData.append("title", title);
    reqData.append("video_tool_url", video_tool_url);
    reqData.append("_method", "PUT");

    try {
      const { status, data: resData } = await axiosInstance.post(
        `/api/admin/tool-videos/${selectedId}`,
        reqData
      );
      if (status === 200) {
        fetchVideos();
        onClose();
        enqueueSnackbar(resData.message);
      }
    } catch (err) {}
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="tool-doc"
      TransitionComponent={Transition}
    >
      <DialogTitle id="tool-doc">
        <Typography>
          <Translate>tools.videos.edit_video</Translate>
        </Typography>
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            <Box mt={3}>
              <FormControl fullWidth>
                <RHFTextField
                  name="title"
                  id="doc-title"
                  label={"tools.videos.title"}
                  variant="outlined"
                />
              </FormControl>
            </Box>

            <Box mt={3}>
              <FormControl fullWidth>
                <RHFTextField
                  name="video_tool_url"
                  id="video-url"
                  label={"tools.videos.videoURLs"}
                  variant="outlined"
                />
              </FormControl>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} autoFocus color="error">
            <Translate>{"tools.videos.close"}</Translate>
          </Button>
          <Button
            type="submit"
            autoFocus
            variant="contained"
            // startIcon={<Iconify icon={"bi:upload"} />}
          >
            <Translate>tools.videos.update</Translate>
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default VideoEditDialog;
