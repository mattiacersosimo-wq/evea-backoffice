import { Box, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import Ternary from "src/components/ternary";
import { AUTH_INFO, USE_LOGIN } from "src/config";
import AuthBanner from "./auth-banner";

const AuthHelper = () => {
  const { setValue } = useFormContext();
  const { admin, user } = AUTH_INFO;

  const selectCredentials = (info) => () => {
    setValue("email", info.email);
    setValue("password", info.password);
  };

  return (
    <Ternary
      when={USE_LOGIN}
      then={
        <Stack spacing={1} mb={2}>
          <AuthBanner
            name="Admin"
            info={admin}
            onClick={selectCredentials(admin)}
          />
          <AuthBanner
            name="User"
            info={user}
            onClick={selectCredentials(user)}
          />
        </Stack>
      }
    />
  );
};

export default AuthHelper;
