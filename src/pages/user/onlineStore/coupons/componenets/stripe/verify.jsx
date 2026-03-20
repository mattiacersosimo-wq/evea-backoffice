import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { STRIPE_PK } from "src/config";
import useQueryParams from "src/hooks/useQueryParams";
import { PATH_USER } from "src/routes/paths";
import axiosInstance from "src/utils/axios";

const finalizePayment = async (inputData) => {
  const reqData = new FormData();
  Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));
  try {
    const { status, data } = await axiosInstance.post(
      "api/user/product-purchase-stripe",
      reqData
    );
    if (status === 200) {
      return data;
    }
  } catch (err) {
    console.log(err);
  }
};

const PaymentStatus = () => {
  const stripe = useStripe();
  const [message, setMessage] = useState(
    "Payment processing. Waiting for confirmation"
  );
  const { queryObject } = useQueryParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    payment_intent_client_secret: clientSecret,
    purchase_id: userPurchase,
  } = queryObject;
  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(async ({ paymentIntent }) => {
        switch (paymentIntent.status) {
          case "succeeded":
            const res = await finalizePayment({
              payment_intent: paymentIntent.id,
              payment_method: paymentIntent.payment_method,
              user_payment: userPurchase,
            });

            if (res) {
              enqueueSnackbar(res.message);
              setMessage("Success! Payment received.");
              navigate(PATH_USER.my_orders.view(res.invoice_id));
              return;
            }

            break;

          case "processing":
            setMessage(
              "Payment processing. We'll update you when payment is received."
            );
            break;

          case "requires_payment_method":
            setMessage("Payment failed. Please try another payment method.");
            break;

          default:
            setMessage("Something went wrong.");
            break;
        }
      });
  }, [stripe, clientSecret]);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Stack spacing={5} alignItems="center">
        <CircularProgress size="5rem" />
        <Typography>{message}</Typography>
      </Stack>
    </Stack>
  );
};

const stripePromise = loadStripe(STRIPE_PK);

const Verify = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentStatus />
    </Elements>
  );
};

export default Verify;
