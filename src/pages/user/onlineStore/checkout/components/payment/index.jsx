import { Button, Grid } from "@mui/material";
import { createContext, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { ScannerDialog } from "src/components/coinPaymentScanner";
import { FormProvider } from "src/components/hook-form";

import { PATH_USER } from "src/routes/paths";
import Summary from "../summary";
import Accept from "./components/accept";
import { ErrorDialog } from "./components/depositWallet";
import Methods from "./components/methods";
import Stripe from "./components/stripe";
// import TafToken from "./components/taf-token";
import Translate from "src/components/translate";
import useFetchPurchaseMethods from "./components/methods/hooks/useFetchPurchaseMethods";
import usePurchase from "./hooks/usePurchase";

const openDialog = createContext(null);

export const useOpenDialog = () => useContext(openDialog);

const Payment = () => {
    const { methods, placeOrder, scannerData, closeScanner, error } =
        usePurchase();

    const { state } = useLocation();
    const { couponName } = state || {};
    const codeSelected = !Boolean(methods.watch("payment_code"));
    const {
        paymentMethods,
        depositWalletBalance,
        bankDetails,
        fetchPaymentMethods,
    } = useFetchPurchaseMethods();

    return (
        <>
            <FormProvider methods={methods} onSubmit={placeOrder}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Methods
                            placeOrder={placeOrder}
                            paymentMethods={paymentMethods}
                            bankDetails={bankDetails}
                            depositWalletBalance={depositWalletBalance}
                        />
                        <Button
                            LinkComponent={Link}
                            to={
                                PATH_USER.onlineStore.productSubscription
                                    .shipping
                            }
                            size="small"
                            color="inherit"
                            startIcon={
                                <Iconify icon={"eva:arrow-ios-back-fill"} />
                            }
                        >
                            <Translate>
                                user.online_store.product.back
                            </Translate>{" "}
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Summary
                            couponName={couponName}
                            showCoupon
                            fetchPaymentMethods={fetchPaymentMethods}
                        />
                        <Accept enableSubmit={codeSelected} />
                    </Grid>
                </Grid>
            </FormProvider>

            <ScannerDialog
                open={Boolean(scannerData)}
                paymentData={scannerData || {}}
                onClose={closeScanner}
            />
            {/* <TafToken /> */}
            <Stripe />
            <ErrorDialog message={error} />
        </>
    );
};

export default Payment;
