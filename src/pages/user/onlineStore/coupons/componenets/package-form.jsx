import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { createContext, useContext } from "react";
import { useTranslation } from "react-i18next";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";
import Methods from "../../checkout/components/payment/components/methods";
import useFetchPurchaseMethods from "../../checkout/components/payment/components/methods/hooks/useFetchPurchaseMethods";
import useCouponPurchase from "../hooks/use-coupon-purchase";
import Cards from "./cards";
import { ScannerDialog } from "./coinPaymentScanner";
import Stripe from "./stripe";

const openDialog = createContext(null);
export const useOpenDialog = () => useContext(openDialog);

const PackageForm = () => {
  const { t } = useTranslation();
  const { scannerData, closeScanner, methods, onSubmit } = useCouponPurchase();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { paymentMethods, depositWalletBalance } = useFetchPurchaseMethods();
  const totalAmount = methods.watch("total_amount");

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ my: 3 }}>
              <CardHeader
                title={
                  <Typography variant="subtitle2">
                    {t("coupons.package_details")}
                  </Typography>
                }
              />
              <CardContent>
                <Cards />
                <Box
                  sx={{
                    display: "grid",
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: {
                      xs: "repeat(1, 1fr)",
                      sm: "repeat(1, 1fr)",
                    },
                  }}
                >
                  <RHFTextField name="name" label={t("coupons.coupons_name")} />
                  <RHFTextField name="no_of_coupon" label={t("coupons.number_of_coupons")} />
                </Box>
                <Box sx={{ mt: 4 }}>
                  <Typography>
                    {t("coupons.total_amount")} :{" "}
                    <Currency style={{ fontWeight: "bold" }}>
                      {totalAmount}
                    </Currency>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Methods
              name="payment_type"
              paymentMethods={paymentMethods}
              depositWalletBalance={depositWalletBalance}
            />
            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                name="review"
              >
                {t("coupons.checkout")}
              </LoadingButton>
            </Stack>
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
      {/* <ErrorDialog message={error} /> */}
    </>
  );
};

export default PackageForm;
