import { DialogContent } from "@material-ui/core";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useState } from "react";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const ActionDialog = ({
  title,
  open,
  selectedId,
  onClose,
  statusKyc,
  fetchData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState();
  const handleDelete = async () => {
    setLoading(true);
    const data = new FormData();

    const { status, data: responseData } = await axiosInstance.post(
      `/api/admin/kyc-status/${selectedId}/${statusKyc}`,
      data
    );

    if (status === 200) {
      setLoading(false);
      enqueueSnackbar(responseData.message);
      onClose();
      fetchData();
      return;
    }
    enqueueSnackbar("Failed to delete the blog", { variant: "error" });
  };

  const { palette } = useTheme();

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-blog"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-blog">{title} KYC</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Box
            sx={{
              display: "grid",
              rowGap: 3,
              columnGap: 2,
              marginTop: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
              },
            }}
          >
            <Typography>
              <Translate>tools.videos.areYouSure</Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          autoFocus
          sx={{ color: palette.error.main }}
          name="close"
        >
          <Translate>tools.videos.close</Translate>
        </Button>
        <LoadingButton
          loading={loading}
          onClick={handleDelete}
          variant="contained"
          name="delete"
        >
          {title}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
