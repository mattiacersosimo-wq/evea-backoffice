import {
  Box,
  Container,
  Grid,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import useIsMountedRef from "src/hooks/useIsMountedRef";

import useSettings from "src/hooks/useSettings";
import { createBilling, getCart } from "src/redux/slices/product";
import { useDispatch, useSelector } from "src/redux/store";
import { PATH_USER } from "src/routes/paths";
import {
  CheckoutCart,
  CheckoutOrderComplete,
  CheckoutPayment,
} from "src/sections/checkout";

const STEPS = ["Cart", "Payment"];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: "calc(-50% + 20px)",
  right: "calc(50% + 20px)",
  "& .MuiStepConnector-line": {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  "&.Mui-active, &.Mui-completed": {
    "& .MuiStepConnector-line": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? "primary.main" : "text.disabled",
      }}
    >
      {completed ? (
        <Iconify
          icon={"eva:checkmark-fill"}
          sx={{ zIndex: 1, width: 20, height: 20, color: "primary.main" }}
        />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "currentColor",
          }}
        />
      )}
    </Box>
  );
}

export default function EcommerceCheckout() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { checkout } = useSelector((state) => state.product);
  const { cart } = checkout;
  const [activeStep, setActiveStep] = useState(0);
  const isComplete = activeStep === STEPS.length;

  useEffect(() => {
    if (isMountedRef.current) {
      dispatch(getCart(cart));
    }
  }, [dispatch, isMountedRef, cart]);

  useEffect(() => {
    if (activeStep === 1) {
      dispatch(createBilling(null));
    }
  }, [dispatch, activeStep]);

  return (
    <Page title={"userBusinessBuilder.subscription.CheckoutTitile"}>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading={"userBusinessBuilder.subscription.checkout"}
          links={[
            { name: "dashboard", href: PATH_USER.root },
            {
              name: "userBusinessBuilder.subscription.productSubscription",
              href: PATH_USER.onlineStore.productSubscription.root,
            },
            { name: "userBusinessBuilder.subscription.checkout" },
          ]}
        />

        <Grid container justifyContent={isComplete ? "center" : "flex-start"}>
          <Grid item xs={12} md={8} sx={{ mb: 5 }}>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<QontoConnector />}
            >
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      "& .MuiStepLabel-label": {
                        typography: "subtitle2",
                        color: "text.disabled",
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>

        {!isComplete ? (
          <>
            {activeStep === 0 && (
              <CheckoutCart nextStep={() => setActiveStep(1)} />
            )}
            {activeStep === 1 && <CheckoutPayment />}
          </>
        ) : (
          <CheckoutOrderComplete open={isComplete} />
        )}
      </Container>
    </Page>
  );
}
