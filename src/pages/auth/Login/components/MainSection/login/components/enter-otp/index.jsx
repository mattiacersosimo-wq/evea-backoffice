import { LoadingButton } from "@mui/lab";
import { Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import useTwoFactorAuthentication from "./hooks/use-2fa-login";
import Transition from "src/utils/dialog-animation";

const EnterOtp = ({ data }) => {
  const { secret } = data;
  const { methods, onSubmit } = useTwoFactorAuthentication(data);
  const open = Boolean(secret);

  const {
    formState: { isSubmitting },
  } = methods;

  return (
    <Dialog open={open} TransitionComponent={Transition}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Two-Factor Authentication (2FA)
          </Typography>
          <Stack spacing={3}>
            <RHFTextField
              autoFocus
              label="Enter OTP"
              type="number"
              name="code"
            />
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
            >
              verify
            </LoadingButton>
          </Stack>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};

export default EnterOtp;
