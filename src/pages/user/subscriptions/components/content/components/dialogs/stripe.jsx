import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import Translate from "src/components/translate";

import { useSubscriptionContext } from "src/pages/user/subscriptions/store/subscription";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const enableRecurring = async (inputData) => {
  const reqData = new FormData();
  Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));
  const { data } = await axiosInstance.post(
    "/api/user/stripe-recurring-enable",
    reqData
  );

  return data;
};

const EnableStripe = ({ open, onClose, reload }) => {
  const data = useSubscriptionContext();
  const user_payment_id = data.user_purchase.user_payment.id;

  const { enqueueSnackbar } = useSnackbar();
  const { immediate_charge, product_id } = data;

  const enableStripe = async () => {
    try {
      const { status, message } = await enableRecurring({
        product_id: product_id,
        immediate_charge,
        user_payment: user_payment_id,
      });
      if (status) {
        reload();
        onClose();
        enqueueSnackbar(message);
      }
    } catch (err) {
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
      <DialogTitle>
        <Translate>user.subscriptions.enable_recurring</Translate>
      </DialogTitle>
      <DialogContent mt={3}>
        <Typography variant="subtitle2" sx={{ color: "#637381", marginTop: 2 }}>
          <Translate>
            user.subscriptions.stripe_recurring_enable_message
          </Translate>
        </Typography>
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
        <Button color="warning" variant="outlined" onClick={onClose}>
          <Translate>global.cancel</Translate>
        </Button>
        <Button onClick={enableStripe} variant="contained">
          <Translate>user.subscriptions.recurring_payment</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnableStripe;
