import { LoadingButton } from "@mui/lab";
import { Card, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import Password from "src/components/Password";
import { FormProvider } from "src/components/hook-form";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import useChangePassword from "./hooks/use-change-password";

const TransactionPassword = () => {
  const { methods, onSubmit } = useChangePassword();
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [status, setStatus] = useState({
    send: false,
    sending: false,
  });

  const [mailSend, setMailSend] = useState(false);
  const { send, sending } = status;

  const sendMail = async () => {
    setStatus({ send: false, sending: true });
    const { status, data } = await axiosInstance.post(
      `/api/send-transaction-email`
    );
    try {
      if (status === 200) {
        enqueueSnackbar(data.message);
        setStatus({ send: true, sending: false });

        setMailSend(true);
      }
    } catch (err) {
      setStatus({ send: false, sending: false });

      setMailSend(false);
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return (
    <div>
      <Card sx={{ p: 3, mt: 1 }}>
        <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          <Translate>global.transaction_password</Translate>
        </Typography>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} alignItems="flex-end">
            <Password name="old_password" label="global.old_password" />
            <Password
              name="new_password"
              label="profile.settings.password.new_password"
            />
            <Password
              name="confirmNewPassword"
              label="profile.settings.password.confirm"
            />
            <Stack
              sx={{
                width: "100%",
              }}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption">
                <Ternary
                  when={send || sending}
                  then={
                    <Ternary
                      when={sending}
                      then={
                        <span>
                          <Translate>impersonate.sending</Translate>
                        </span>
                      }
                      otherwise={
                        <span>
                          <Translate>impersonate.send</Translate>
                        </span>
                      }
                    />
                  }
                  otherwise={
                    <>
                      <Translate>global.transaction</Translate>
                      <span
                        onClick={sendMail}
                        style={{
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        <Translate>impersonate.click</Translate>
                      </span>{" "}
                      <Translate>global.sendMail</Translate>
                    </>
                  }
                />
              </Typography>
              <LoadingButton
                type="submit"
                variant="contained"
                mailSend={isSubmitting}
                name="submit"
                sx={{ alignSelf: "flex-end" }}
              >
                <Translate>profile.settings.password.save</Translate>
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Card>
    </div>
  );
};

export default TransactionPassword;
