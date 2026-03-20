import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { enablePayPalRecurring } from "src/api/user/subscriptions";
import Translate from "src/components/translate";
import { useSubscriptionContext } from "src/pages/user/subscriptions/store/subscription";
import Transition from "src/utils/dialog-animation";

const EnablePaypal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  const data = useSubscriptionContext();

  const { id, product_id, purchase_id, immediate_charge } = data;

  const handleEnable = async () => {
    setLoading(true);
    try {
      const { status, data } = await enablePayPalRecurring({
        product_id,
        purchase_id,
        user_purchase_product_id: id,
        immediate_charge,
      });
      if (status) {
        window.open(data, "_self");
        return;
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <Translate>user.subscriptions.enable_recurring</Translate>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Translate>
            user.subscriptions.paypal_recurring_enable_message
          </Translate>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="warning" onClick={onClose}>
          <Translate>global.cancel</Translate>
        </Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          onClick={handleEnable}
        >
          <Translate>user.subscriptions.recurring_payment</Translate>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EnablePaypal;
