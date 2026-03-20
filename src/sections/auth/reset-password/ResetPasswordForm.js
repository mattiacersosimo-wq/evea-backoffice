import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
// hooks
import useIsMountedRef from "../../../hooks/useIsMountedRef";
// components
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import Translate from "src/components/translate";
import { FormProvider, RHFTextField } from "../../../components/hook-form";

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func,
};

export default function ResetPasswordForm({ onSent, validationError }) {
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("errors.login.email.email")
      .required("errors.login.email.required"),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if (isMountedRef.current) await onSent(data.email);
  };
  useEffect(() => {
    if (Boolean(validationError)) {
      setError("email", { message: validationError });
    }
  }, [validationError]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="register.email" />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          name="ResetPassword"
        >
          <Translate>register.reset</Translate>
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
