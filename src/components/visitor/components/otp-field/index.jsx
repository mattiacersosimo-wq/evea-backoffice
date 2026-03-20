import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Ternary from "src/components/ternary";
import useCountDown from "src/hooks/use-count-down";
import visitorServer from "src/utils/visitor";
import { object, string } from "yup";
import useResendMail from "./hooks/use-resend-mail";

const schema = object().shape({
  otp: string().required("OTP is required").typeError("OTP is required"),
});

const OtpField = ({ id, setDataCollected, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    defaultValues: {
      id: "",
      otp: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    setError,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (id) {
      setValue("id", id);
    }
  }, [id]);

  const timeout = useMemo(() => {
    if (id) {
      return Date.parse(
        moment().add(30, "seconds").format("YYYY-MM-DD HH:mm:ss")
      );
    }
    return 0;
  }, [id]);

  const onSubmit = handleSubmit(async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).map(([k, v]) => reqData.append(k, v));

    try {
      const { data } = await visitorServer.post("/user-verification", reqData);
      localStorage.setItem("data-collected", true);
      setDataCollected(true);
      setOpen(false);
      enqueueSnackbar(data.message);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message, { variant: "error" });
      Object.entries(err?.response?.data?.errors).forEach(([k, v]) => {
        setError(k, { message: v?.find(Boolean) });
      });
    }
  });
  const { resendMail, otpSend } = useResendMail(id);
  const { seconds } = useCountDown(timeout);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack justifyContent="center" height="100%">
        <Stack spacing={2}>
          <RHFTextField label="Enter OTP" name="otp" />
          <LoadingButton
            fullWidth
            variant="contained"
            type="submit"
            loading={isSubmitting}
          >
            Verify
          </LoadingButton>

          <Button
            sx={{
              whiteSpace: "nowrap",
            }}
            disabled={seconds > 0}
            onClick={resendMail}
            fullWidth
          >
            <Ternary
              when={seconds > 0}
              then={`Resend OTP in ${seconds}`}
              otherwise={otpSend ? "OTP Send" : "Resend OTP"}
            />
          </Button>

          <Typography variant="caption">
            If you don't see this email in your inbox, please check your spam or
            junk folder. Sometimes legitimate emails can get filtered there by
            mistake.
          </Typography>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default OtpField;
