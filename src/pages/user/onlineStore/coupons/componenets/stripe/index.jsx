import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { STRIPE_PK } from "src/config";

import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router";
import Ternary from "src/components/ternary";
import useQueryParams from "src/hooks/useQueryParams";
import fetchUser from "src/utils/fetchUser";
import Transition from "src/utils/dialog-animation";

const cancelCheckout = async (userPayment) => {
  const reqData = new FormData();
  reqData.append("user_payment", userPayment);
  try {
    const { status } = await fetchUser.post(
      "product-purchase-stripe-cancel",
      reqData
    );
    return status === 200;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { queryObject, clear } = useQueryParams();
  const { user_payment: userPayment } = queryObject;
  const [errorMessage, setErrorMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    setSubmitting(true);
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.origin}/verify-payment?purchase_id=${userPayment}`,
      },
    });
    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
    }
  };

  const onClose = async () => {
    const cancelled = await cancelCheckout(userPayment);
    if (cancelled) {
      clear();
      navigate(0);
      return;
    }
    setErrorMessage("Failed to cancel try again");
  };

  return (
    <form>
      <PaymentElement />
      <Ternary
        when={Boolean(errorMessage)}
        then={
          <Typography
            sx={{
              marginTop: 3,
            }}
            color="error"
            variant="caption"
          >
            {errorMessage}
          </Typography>
        }
      />
      <DialogActions>
        <Button
          disableElevation
          variant="outlined"
          color="warning"
          onClick={onClose}
        >
          Cancel
        </Button>
        <LoadingButton
          loading={submitting}
          onClick={handleSubmit}
          disableElevation
          variant="contained"
        >
          Confirm & Pay
        </LoadingButton>
      </DialogActions>
    </form>
  );
};

const stripePromise = loadStripe(STRIPE_PK);

const Stripe = () => {
  const { queryObject } = useQueryParams();
  const { stripe: clientSecret } = queryObject;

  const options = {
    clientSecret: clientSecret,
    loader: "always",
  };

  const open = Boolean(clientSecret);
  return (
    <Dialog open={open} fullWidth TransitionComponent={Transition}>
      <DialogContent>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default Stripe;
