import { LoadingButton } from "@mui/lab";
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { PATH_AUTH } from "src/routes/paths";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import Iconify from "src/components/Iconify";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import useAuth from "src/hooks/useAuth";
import useIsMountedRef from "src/hooks/useIsMountedRef";
import { AuthWraper } from "../ResetPassword";
import useNewPasswordForm from "./hooks/use-new-password-form";

const NewPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const methods = useNewPasswordForm();

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting, ...rest },
  } = methods;
  const { t } = useTranslation();
  const onSubmit = async (data) => {
    try {
      const isSuccess = await resetPassword(data);
      if (isSuccess) {
        navigate("/auth/password-reset/success", { replace: true });
        reset();
      }
    } catch (error) {
      console.error(error);

      reset();
      if (isMountedRef.current) {
        setError("afterSubmit", {
          ...error,
          message: Object.values(error).toString(),
        });
      }
    }
  };

  return (
    <>
      <AuthWraper>
        <Typography variant="h3" paragraph>
          <Translate>global.your_password</Translate>
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 5 }}>
          <Translate>global.your_new_password</Translate>
        </Typography>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFTextField name="email" label={t("register.email")} disabled />
            <RHFTextField
              name="password"
              label={t("register.password")}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Iconify
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="repassword"
              label={t("register.re_enter_password")}
              type={showRePassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowRePassword(!showRePassword)}
                    >
                      <Iconify
                        icon={
                          showRePassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              <Translate>assign_subscriptions.submit</Translate>
            </LoadingButton>
          </Stack>
        </FormProvider>

        <Button
          fullWidth
          size="large"
          sx={{ mt: 1 }}
          component={RouterLink}
          to={PATH_AUTH.login}
        >
          <Translate>global.back_to</Translate>
        </Button>
      </AuthWraper>
    </>
  );
};

export default NewPassword;
