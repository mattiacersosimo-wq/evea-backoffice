import React from "react";
import { useAppConfig } from "src/store/app-config";
import Ternary from "../ternary";

const ShowTwoFactorAuth = ({ children }) => {
  const { config } = useAppConfig();
  return <Ternary when={config["2fa_enable"]?.status} then={children} />;
};

export default ShowTwoFactorAuth;
