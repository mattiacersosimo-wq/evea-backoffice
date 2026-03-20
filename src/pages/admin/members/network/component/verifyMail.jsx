import { DialogContent } from "@material-ui/core";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const useHandleVerification = (id) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleVerification = async () => {
    try {
      const { data, status } = await axiosInstance(
        `api/admin/verify-email/${id}`
      );

      if (status === 200) {
        enqueueSnackbar(data.message);
        return true;
      }
      return false;
    } catch (err) {
      enqueueSnackbar(err.message);
      return false;
    }
  };

  return handleVerification;
};

const VerifyMail = ({ open, selectedId, onClose, fetchData }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const verify = useHandleVerification(selectedId);

  const handleVerify = async () => {
    const status = await verify();
    if (status) {
      onClose();
      fetchData();
    }
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="block-user"
      TransitionComponent={Transition}
    >
      <DialogTitle id="block-user">
        <Translate> {"network_members.verify_mail"}</Translate>
      </DialogTitle>
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
              <Translate> {"network_members.are_you_sure"}</Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          <Translate> {"network_members.cancel"}</Translate>
        </Button>
        <Button variant="contained" onClick={handleVerify}>
          <Translate>{"network_members.verify"}</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyMail;
