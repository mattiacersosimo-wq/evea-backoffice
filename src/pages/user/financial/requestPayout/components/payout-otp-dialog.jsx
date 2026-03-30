import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const PayoutOtpDialog = ({ open, onClose, onVerified }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [verifying, setVerifying] = useState(false);
  const methods = useForm({ defaultValues: { code: "" } });

  const onSubmit = async (data) => {
    setVerifying(true);
    try {
      const reqData = new FormData();
      reqData.append("code", data.code);
      reqData.append("action", "payout");
      const { status } = await axiosInstance.post("api/twofaverify", reqData);
      if (status === 200) {
        methods.reset();
        onVerified();
      }
    } catch (err) {
      enqueueSnackbar(
        err?.message || "Codice non valido. Riprova.",
        { variant: "error" }
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>Verifica di sicurezza</DialogTitle>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Inserisci il codice a 6 cifre dalla tua app Authenticator per
            confermare il prelievo.
          </Typography>
          <Stack spacing={2}>
            <RHFTextField
              autoFocus
              label="Codice OTP"
              type="number"
              name="code"
              placeholder="000000"
            />
            <LoadingButton
              loading={verifying}
              type="submit"
              variant="contained"
              fullWidth
            >
              Verifica e preleva
            </LoadingButton>
          </Stack>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};

export default PayoutOtpDialog;
