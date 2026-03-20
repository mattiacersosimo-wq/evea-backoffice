import { LoadingButton } from "@mui/lab";
import { Box, Link, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Password from "src/components/Password";
import ChoosePlan from "src/components/choose-plan";
import {
  FormProvider,
  RHFCheckbox,
  RHFTextField,
} from "src/components/hook-form";
import Translate from "src/components/translate";
import GoogleOAuthButton from "src/pages/auth/components/google-login";
import { PATH_AUTH } from "src/routes/paths";
import AuthHelper from "./components/authHelper";
import EnterOtp from "./components/enter-otp";
import ErrorBanner from "./components/error-banner";
import useLogin from "./hooks/use-login";

const LoginForm = () => {
  const { onSubmit, methods } = useLogin();

  const {
    watch,
    formState: { isSubmitting },
  } = methods;

  const data = watch();

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2} mb={2}>
          <AuthHelper />
          <ErrorBanner />
        </Stack>

        <Box>
          <Stack spacing={2}>
            <RHFTextField name="email" label="register.email" />
            <Password name="password" label="register.password" />
            <ChoosePlan />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ my: 2 }}
          >
            <RHFCheckbox name="remember" label="register.remember" />
            <Link
              component={RouterLink}
              variant="subtitle2"
              sx={{
                color: "GrayText",
              }}
              to={PATH_AUTH.resetPassword}
            >
              <Translate>register.forgot</Translate>
            </Link>
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            name="login"
          >
            <Translate>register.login</Translate>
          </LoadingButton>
          {/* <GoogleOAuthButton
            plan={methods.getValues("plan")}
            buttonLabel="register.google_login"
          /> */}
        </Box>
      </FormProvider>

      <EnterOtp data={data} />
    </>
  );
};

export default LoginForm;
