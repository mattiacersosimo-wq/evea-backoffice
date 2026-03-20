import { Box, Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Page from "src/components/Page";
import LogoOnlyLayout from "src/layouts/LogoOnlyLayout";
import { PATH_AUTH } from "src/routes/paths";
import EmailInboxIcon from "./assets/EmailInboxIcon";

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
  alignItems: "center",
  padding: theme.spacing(12, 0),
}));

export default function VerifyCode() {
  const navigate = useNavigate();
  return (
    <Page title="Verify" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: "auto" }}>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <EmailInboxIcon sx={{ width: "30%" }} />
            </Box>

            <Typography variant="h3" paragraph>
              Success
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Your Email has been successfully verified.
            </Typography>

            <Box sx={{ mt: 5, mb: 3 }}>
              <Button
                onClick={() => navigate(PATH_AUTH.login)}
                fullWidth
                size="large"
                variant="contained"
                sx={{ mt: 3 }}
              >
                Go back to sign in
              </Button>
            </Box>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
