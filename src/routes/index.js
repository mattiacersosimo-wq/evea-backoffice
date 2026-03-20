import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import ViewPDF from "src/components/pdf-viewer";
import useAuth from "src/hooks/useAuth";
import Loadable from "./Loadable";
import genAdmin from "./admin";
import auth from "./auth";
import main from "./main";
import AutoVerifyOtp from "./auto-verify-otp";
import user from "./user";

const Lead = Loadable(lazy(() => import("src/pages/lead/register/index")));

const Router = () => {
  const { isSubAdmin } = useAuth();

  return useRoutes(getRoutes(isSubAdmin));
};
const getRoutes = (isSubAdmin) => {
  const routes = [
    ...auth,
    ...user,
    ...genAdmin(isSubAdmin),
    ...main,
    { path: "lead/:referral", element: <Lead /> },
    {
      path: "/document/:name",
      element: <ViewPDF />,
    },

    {
      path: "auto-verify-otp",
      element: <AutoVerifyOtp />,
    },
  ];

  return routes;
};

export default Router;
