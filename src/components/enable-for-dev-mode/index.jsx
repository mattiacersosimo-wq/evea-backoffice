import { Navigate } from "react-router";
import { IS_DEV_MODE } from "src/config";
import Ternary from "../ternary";

const EnableForDevMode = ({ children }) => {
  return (
    <Ternary
      when={IS_DEV_MODE}
      then={children}
      otherwise={<Navigate to="/404" />}
    />
  );
};

export default EnableForDevMode;
