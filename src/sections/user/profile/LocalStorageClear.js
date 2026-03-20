import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const LocalStorageClear = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClearLocalStorage = () => {
    localStorage.clear();
    handleClose();
    enqueueSnackbar("Your local storage data is clear");
    window.location = "/auth/login";
  };

  return (
    <>
      <Card sx={{ p: 3, mt: 1 }}>
        <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          <Translate>profile.settings.cache.title</Translate>
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid xs={12} md={12} lg={12}>
              <Box>
                <CardHeader
                  disableTypography
                  avatar={
                    <Iconify
                      icon="mdi:pan-right"
                      sx={{ fontSize: "3rem", color: "#cacacac7" }}
                    />
                  }
                  title={
                    <Typography variant="subtitle2" color="text.primary">
                      <Translate>profile.settings.cache.body</Translate>
                    </Typography>
                  }
                  subheader={
                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "text.secondary" }}
                    >
                      <Translate>profile.settings.cache.sub</Translate>
                    </Typography>
                  }
                  action={
                    <Tooltip title="delete" arrow>
                      <IconButton
                        aria-label="settings"
                        color="error"
                        onClick={handleClickOpen}
                        name="clear-localstorage"
                      >
                        <Iconify icon="fluent:delete-16-regular" />
                      </IconButton>
                    </Tooltip>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Dialogue  */}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
        TransitionComponent={Transition}
      >
        <DialogTitle id="alert-dialog-title">
          <Typography variant="subtitle1">
            <Translate>profile.settings.cache.dialog.title</Translate>
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="subtitle2"
            sx={{ color: "#637381", mt: 2, mb: 3 }}
          >
            <Translate>profile.settings.cache.dialog.body</Translate>
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={handleClose}
              color="error"
              mr={2}
              size="small"
              name="cancel"
            >
              <Translate>profile.settings.cache.dialog.cancel</Translate>
            </Button>
            <Button
              onClick={handleClearLocalStorage}
              autoFocus
              variant="contained"
              size="small"
              name="clear"
            >
              <Translate>profile.settings.cache.dialog.save</Translate>
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocalStorageClear;
