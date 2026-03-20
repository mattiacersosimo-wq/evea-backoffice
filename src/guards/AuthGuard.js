import PropTypes from "prop-types";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
import { useAppConfig } from "src/store/app-config";
import buildPath from "src/utils/build-path";
import { clearSession } from "src/utils/jwt";
import LoadingScreen from "../components/LoadingScreen";
import useAuth from "../hooks/useAuth";
import Login from "../pages/auth/Login";

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      clearSession();
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}

export const AdminGuard = ({ children }) => {
  const { isAdmin, isSubAdmin } = useAuth();

  if (isAdmin || isSubAdmin) {
    return <>{children}</>;
  }
  return <Navigate to="/user" />;
};

export const SubAdminGuard = ({ children }) => {
  const { isSubAdmin } = useAuth();

  if (isSubAdmin) {
    return <Navigate to={PATH_DASHBOARD.dashboard.root} />;
  }

  return <>{children}</>;
};

export const UserGuard = ({ children }) => {
  const { isAdmin, isSubAdmin } = useAuth();
  const packageStatus = JSON.parse(localStorage.getItem("package_status"));
  const { pathname } = useLocation();

  if (
    packageStatus &&
    pathname !== PATH_USER.onlineStore.productSubscription.packages.root &&
    pathname !== PATH_USER.onlineStore.productSubscription.checkout &&
    pathname !==
      buildPath(PATH_USER.onlineStore.productSubscription.checkout, "payment")
  ) {
    return (
      <Navigate to={PATH_USER.onlineStore.productSubscription.packages.root} />
    );
  }

  if (isAdmin || isSubAdmin) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
};

export const HideLeads = ({ children }) => {
  const { config } = useAppConfig();

  if (Object.keys(config).length > 0) {
    const leadsEnable = Boolean(config?.leads_enable?.status);

    if (leadsEnable) return <>{children}</>;

    return <Navigate to="/404" replace />;
  }

  return <LoadingScreen />;
};
