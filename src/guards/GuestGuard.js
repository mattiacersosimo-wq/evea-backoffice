import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";
import useIsUser from "src/hooks/use-is-user";
import useAuth from "src/hooks/useAuth";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard() {
  const { isAuthenticated } = useAuth();
  const isUser = useIsUser();

  if (isAuthenticated) {
    if (isUser) {
      return <Navigate to={PATH_USER.root} replace />;
    }
    return <Navigate to={PATH_DASHBOARD.root} replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
