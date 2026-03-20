import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";

import { useSubscriptionContext } from "src/pages/user/subscriptions/store/subscription";
import Transition from "src/utils/dialog-animation";
import fetchUser from "src/utils/fetchUser";

const CancelRecurringConfirm = ({ open, onClose, reload }) => {
  const { enqueueSnackbar } = useSnackbar();
  const data = useSubscriptionContext();

  const { id } = data;
  const cancelSubscription = async () => {
    try {
      const { data, status } = await fetchUser.post(
        `cancel-product-subscription/${id}`
      );
      if (status === 200) {
        reload();
        enqueueSnackbar(data.message);
        onClose();
      }
    } catch (err) {
      onClose();
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="recurring-payment"
      TransitionComponent={Transition}
    >
      <DialogTitle>{"userMySubscriptions.cancelSubscription"}</DialogTitle>
      <DialogContent mt={3}>
        <Typography variant="subtitle2" sx={{ color: "#637381", marginTop: 2 }}>
          {"userMySubscriptions.areYouSure"}
          <br />
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#637381", marginTop: 1 }}>
          {"userMySubscriptions.sub"}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={cancelSubscription} variant="contained">
          {"userMySubscriptions.continue"}
        </Button>
        <Button onClick={onClose} variant="outlined" color="warning">
          {"cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelRecurringConfirm;
