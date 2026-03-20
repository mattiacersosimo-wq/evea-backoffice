import { LoadingButton } from "@mui/lab";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { STRIPE_PK } from "src/config";
import axiosInstance from "src/utils/axios";

const stripePromise = loadStripe(STRIPE_PK);

const submitToken = async (token) => {
  const reqData = new FormData();
  reqData.append("token", token);
  const { data } = await axiosInstance.post(
    "api/user/stripe-card-update",
    reqData
  );

  return data;
};

const CardInput = ({ closeDialog, reload }) => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { enqueueSnackbar } = useSnackbar();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    var result = await stripe.createToken(cardElement, {});

    if (result.token) {
      try {
        const { status, message } = await submitToken(result.token.id);
        if (status) {
          enqueueSnackbar(message);
          closeDialog();
          reload();
          setLoading(false);
        }
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
        setLoading(false);
      }
      return;
    }
    setLoading(false);
    enqueueSnackbar(result.error.message, { variant: "error" });
  };
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Update your card</DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              complete: {},
              base: {
                fontSize: "20px",
              },
            },
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={closeDialog} variant="outlined" color="warning">
          Cancel
        </Button>
        <LoadingButton loading={loading} variant="contained" type="submit">
          Save
        </LoadingButton>
      </DialogActions>
    </form>
  );
};

const UpdateStripeCard = (props) => {
  return (
    <>
      <Elements stripe={stripePromise}>
        <CardInput {...props} />
      </Elements>
    </>
  );
};

export default UpdateStripeCard;
