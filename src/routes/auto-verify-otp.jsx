import { Navigate } from "react-router";
import { ENABLE_VISITOR_MODE } from "src/config";
import { getSession } from "src/utils/jwt";
import { PATH_AUTH } from "./paths";

const AutoVerifyOtp = () => {
  const isLoggedIn = getSession();
  if (isLoggedIn && ENABLE_VISITOR_MODE) {
    localStorage.setItem("data-collected", true);
    return <Navigate to={PATH_AUTH.login} />;
  }

  return <Navigate to="/404" />;
};

export default AutoVerifyOtp;
