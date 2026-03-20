import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Button, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormProvider } from "src/components/hook-form";
import Iconify from "src/components/Iconify";
import { onBackStep, onGotoStep, onNextStep } from "src/redux/slices/product";
import { useDispatch, useSelector } from "src/redux/store";
import * as Yup from "yup";
import CheckoutPaymentMethods from "./CheckoutPaymentMethods";
import CheckoutSummary from "./CheckoutSummary";

const PAYMENT_OPTIONS = [
  {
    value: "paypal",
    title: "Pay with Paypal",
    description:
      "You will be redirected to PayPal website to complete your purchase securely.",
    icons: [],
  },
  {
    value: "credit_card",
    title: "Credit / Debit Card",
    description: "We support Mastercard, Visa, Discover and Stripe.",
    icons: [],
  },
];

const CARDS_OPTIONS = [
  { value: "ViSa1", label: "**** **** **** 1212 - Jimmy Holland" },
  { value: "ViSa2", label: "**** **** **** 2424 - Shawn Stokes" },
  { value: "MasterCard", label: "**** **** **** 4545 - Cole Armstrong" },
];

export default function CheckoutPayment() {
  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const { total, discount, subtotal, shipping } = checkout;

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required("Payment is required!"),
  });

  const defaultValues = {
    delivery: shipping,
    payment: "",
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      handleNextStep();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            paymentOptions={PAYMENT_OPTIONS}
          />
          <Button
            size="small"
            color="inherit"
            onClick={handleBackStep}
            startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
            name="back"
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary
            enableEdit
            total={total}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            onEdit={() => handleGotoStep(0)}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            name="complete-order"
          >
            Complete Order
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
