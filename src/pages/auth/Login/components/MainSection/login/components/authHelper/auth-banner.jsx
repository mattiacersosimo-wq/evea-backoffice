import { Alert, Button, useMediaQuery, useTheme } from "@mui/material";

import Typography from "@mui/material/Typography";
import AlertText from "./alert-text";

const AuthBanner = ({ name, onClick, info }) => {
  const theme = useTheme();

  const { email, password } = info;

  const showButton = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Alert
      severity="info"
      sx={{
        fontSize: "0.8rem",
        backgroundColor: "#f7f9ff",
      }}
      onClick={onClick}
      action={
        showButton && (
          <Typography>
            <Button size="small" onClick={onClick}>
              USE
            </Button>
          </Typography>
        )
      }
    >
      <AlertText>
        {name} email:<b>{email}</b> password:
        <b>{password}</b>
      </AlertText>
    </Alert>
  );
};

export default AuthBanner;
