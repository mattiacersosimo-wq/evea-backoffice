import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack, Switch, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import { useGetCurrencySymbol } from "src/components/with-prefix";
import useAuth from "src/hooks/useAuth";
import fetchUser from "src/utils/fetchUser";
import AvailablePayouts from "./components/available-payouts";
import BankInfo from "./components/bank-info";
import CoinTypes from "./components/coin-types";
import FiscalePreview from "./components/FiscalePreview";
import PayoutOtpDialog from "./components/payout-otp-dialog";
import StripeInfo from "./components/stripe-info";
import useRequestForm from "./hooks/useRequestForm";

const Payout2faToggle = () => {
  const { user, getUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const enabled = Boolean(user?.payout_2fa_enabled);
  const hasAuthenticator = Boolean(parseInt(user?.google2fa_secret_url));

  const handleToggle = async () => {
    if (!hasAuthenticator && !enabled) {
      enqueueSnackbar("Devi prima attivare Google Authenticator dal tuo profilo", { variant: "warning" });
      return;
    }
    setLoading(true);
    try {
      const { data } = await fetchUser.post("toggle-payout-2fa");
      if (data.status) {
        enqueueSnackbar(data.message);
        getUser();
      }
    } catch (err) {
      enqueueSnackbar(err?.message || "Errore", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 2, mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Iconify icon="mdi:shield-lock-outline" width={22} sx={{ color: enabled ? "#4CAF50" : "#bbb" }} />
        <Box>
          <Typography variant="subtitle2">Verifica 2FA per i prelievi</Typography>
          <Typography variant="caption" color="text.secondary">
            {enabled ? "Attiva — verrà richiesto il codice OTP per ogni prelievo" : "Disattiva — i prelievi non richiedono verifica OTP"}
          </Typography>
        </Box>
      </Stack>
      <Switch checked={enabled} onChange={handleToggle} disabled={loading} />
    </Card>
  );
};

const RequestForm = ({ fetchData, minimumWithdrawal, availableToday }) => {
  const { methods, onSubmit, showOtp, onOtpVerified, onOtpClose } =
    useRequestForm(fetchData, minimumWithdrawal);
  const {
    formState: { isSubmitting },
  } = methods;
  const symbol = useGetCurrencySymbol();

  const { t } = useTranslation();

  return (
    <div>
      <Box sx={{ mt: 3 }}>
        <Payout2faToggle />
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
      <PayoutOtpDialog
        open={showOtp}
        onClose={onOtpClose}
        onVerified={onOtpVerified}
      />
    </div>
  );
};

export default RequestForm;
