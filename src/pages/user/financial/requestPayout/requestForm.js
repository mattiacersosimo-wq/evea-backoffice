import { LoadingButton } from "@mui/lab";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import { useGetCurrencySymbol } from "src/components/with-prefix";
import AvailablePayouts from "./components/available-payouts";
import BankInfo from "./components/bank-info";
import CoinTypes from "./components/coin-types";
import FiscalePreview from "./components/FiscalePreview";
import StripeInfo from "./components/stripe-info";
import useRequestForm from "./hooks/useRequestForm";

const RequestForm = ({ fetchData, minimumWithdrawal, availableToday }) => {
  const { methods, onSubmit } = useRequestForm(fetchData, minimumWithdrawal);
  const {
    formState: { isSubmitting },
  } = methods;
  const symbol = useGetCurrencySymbol();

  const { t } = useTranslation();

  return (
    <div>
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ mb: 3 }} variant="subtitle2">
          <Translate>financial.payout.request.title</Translate>
        </Typography>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item md={4}>
              <Stack spacing={2}>
                <RHFTextField
                  type="number"
                  name="amount"
                  label={`${t("financial.payout.request.amount")} ${symbol}`}
                  size="small"
                  onWheel={(e) => e.target.blur()}
                />
                <AvailablePayouts />
                <CoinTypes />
                <FiscalePreview />
                <LoadingButton
                  disabled={!availableToday}
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                  name="request"
                >
                  <Translate>global.request</Translate>
                </LoadingButton>
              </Stack>
            </Grid>
            <Grid item md={6}>
              <BankInfo />
              <StripeInfo />
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </div>
  );
};

export default RequestForm;
