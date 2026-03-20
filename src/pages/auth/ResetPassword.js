import { Box, Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { SentIcon } from "src/assets";
import Page from "src/components/Page";
import Translate from "src/components/translate";
import LogoOnlyLayout from "src/layouts/LogoOnlyLayout";
import { PATH_AUTH } from "src/routes/paths";
import { ResetPasswordForm } from "src/sections/auth/reset-password";
import axiosInstance from "src/utils/axios";

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

const SendEmailSection = ({ onSent, validationError }) => {
  return (
    <>
      <Typography variant="h3" paragraph>
        <Translate>register.forgot_yur</Translate>
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 5 }}>
        <Translate>register.pls_enter</Translate>
      </Typography>

      <ResetPasswordForm onSent={onSent} validationError={validationError} />

      <Button
        fullWidth
        size="large"
        component={RouterLink}
        to={PATH_AUTH.login}
        sx={{ mt: 1 }}
        name="reset-back"
      >
        <Translate>register.back</Translate>
      </Button>
    </>
  );
};

const AfterSend = ({ mail }) => (
  <Box sx={{ textAlign: "center" }}>
    <SentIcon sx={{ mb: 5, mx: "auto", height: 160 }} />

    <Typography variant="h3" gutterBottom>
      <Translate>register.request</Translate>
    </Typography>
    <Typography>
      <Translate>register.we_have</Translate> &nbsp;
      <strong>{mail}</strong>
      <br />
      <Translate>register.please</Translate>
    </Typography>

    <Button
      size="large"
      variant="contained"
      component={RouterLink}
      to={PATH_AUTH.login}
      sx={{ mt: 5 }}
    >
      <Translate>register.back</Translate>
    </Button>
  </Box>
);

export default function ResetPassword() {
  const [sent, setSent] = useState(false);
  const [sentMailId, setSentMailId] = useState("");
  const [validationError, setValidationError] = useState();

  const { t } = useTranslation();
  const sendResetRequest = async (email) => {
    const formData = new FormData();
    formData.append("email", email);
    setValidationError();
    try {
      const res = await axiosInstance.post("/api/forgot-password", formData, {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=<calculated when request is sent>",
        },
      });
      if (res.status === 200) {
        setSentMailId(email);
        setSent(true);
      }
    } catch (err) {
      setValidationError(err.message);
    }
  };

  return (
    <AuthWraper>
      {sent ? (
        <AfterSend mail={sentMailId} />
      ) : (
        <SendEmailSection
          onSent={sendResetRequest}
          validationError={validationError}
        />
      )}
    </AuthWraper>
  );
}

export const AuthWraper = ({ children }) => {
  return (
    <Page title="Reset Password" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />
        <Container>
          <Box sx={{ maxWidth: 480, mx: "auto" }}>{children}</Box>
        </Container>
      </RootStyle>
    </Page>
  );
};
