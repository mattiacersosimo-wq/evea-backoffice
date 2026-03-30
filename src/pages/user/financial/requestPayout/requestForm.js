import { LoadingButton } from "@mui/lab";
import { Box, Card, Dialog, DialogContent, DialogTitle, Grid, Stack, Switch, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import { useGetCurrencySymbol } from "src/components/with-prefix";
import useAuth from "src/hooks/useAuth";
import fetchUser from "src/utils/fetchUser";
import Transition from "src/utils/dialog-animation";
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
  const [showSetup, setShowSetup] = useState(false);
  const [qrData, setQrData] = useState(null);
  const enabled = Boolean(user?.payout_2fa_enabled);
  const hasAuthenticator = Boolean(parseInt(user?.google2fa_secret_url));

  const handleToggle = async () => {
    if (!hasAuthenticator && !enabled) {
      // Show setup dialog
      try {
        const { data } = await fetchUser.get("twofa");
        if (data.status) {
          setQrData({ key: data.key, qr: data.qr });
          setShowSetup(true);
        }
      } catch (err) {
        enqueueSnackbar("Errore nel caricamento del QR code", { variant: "error" });
      }
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

  const handleSetupComplete = async (code) => {
    try {
      const reqData = new FormData();
      reqData.append("secret", code);
      reqData.append("verify", 1);
      const { data } = await fetchUser.post("enable-twofa", reqData);
      if (data.status) {
        // Now enable payout 2FA
        const { data: toggleData } = await fetchUser.post("toggle-payout-2fa");
        if (toggleData.status) {
          enqueueSnackbar("Google Authenticator configurato e 2FA prelievo attivato!");
          getUser();
        }
        setShowSetup(false);
        setQrData(null);
      }
    } catch (err) {
      enqueueSnackbar(err?.message || "Codice non valido", { variant: "error" });
    }
  };

  return (
    <>
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
      {showSetup && qrData && (
        <SetupAuthenticatorDialog
          open={showSetup}
          qrUrl={qrData.qr}
          secretKey={qrData.key}
          onClose={() => { setShowSetup(false); setQrData(null); }}
          onComplete={handleSetupComplete}
        />
      )}
    </>
  );
};

const SetupAuthenticatorDialog = ({ open, qrUrl, secretKey, onClose, onComplete }) => {
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} maxWidth="xs" fullWidth>
      <DialogTitle>Configura Google Authenticator</DialogTitle>
      <DialogContent>
        <Stack spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Scansiona il QR code con l'app Google Authenticator, poi inserisci il codice a 6 cifre per verificare.
          </Typography>
          <Box component="img" src={qrUrl} alt="QR Code" sx={{ width: 200, height: 200 }} />
          <Typography variant="caption" color="text.secondary" sx={{ wordBreak: "break-all", textAlign: "center" }}>
            Chiave manuale: {secretKey}
          </Typography>
          <TextField
            label="Codice a 6 cifre"
            type="number"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            fullWidth
            size="small"
          />
          <LoadingButton
            loading={verifying}
            variant="contained"
            fullWidth
            onClick={async () => {
              setVerifying(true);
              await onComplete(code);
              setVerifying(false);
            }}
          >
            Verifica e attiva
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
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
