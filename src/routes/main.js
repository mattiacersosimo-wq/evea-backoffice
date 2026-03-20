import { lazy } from "react";
import { Navigate } from "react-router";
import EnableForDevMode from "src/components/enable-for-dev-mode";
import LogoOnlyLayout from "src/layouts/LogoOnlyLayout";
import MainLayout from "../layouts/main";
import Loadable from "./Loadable";

const VerifyStripe = Loadable(
  lazy(() =>
    import(
      "src/pages/user/onlineStore/checkout/components/payment/components/stripe/verify.jsx"
    )
  )
);

const Maintenance = Loadable(lazy(() => import("src/pages/Maintenance")));
const Page500 = Loadable(lazy(() => import("src/pages/Page500")));
const MenuBuilder = Loadable(
  lazy(() => import("src/pages/menu-builder/index"))
);
const NotFound = Loadable(lazy(() => import("src/pages/Page404")));

const main = [
  {
    path: "build-menu",
    element: (
      <EnableForDevMode>
        <MenuBuilder />
      </EnableForDevMode>
    ),
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [{ element: <Navigate to="/auth/login" />, index: true }],
  },
  {
    path: "*",
    element: <LogoOnlyLayout />,
    children: [
      { path: "maintenance", element: <Maintenance /> },
      { path: "500", element: <Page500 /> },
      { path: "404", element: <NotFound /> },
      { path: "verify-payment", element: <VerifyStripe /> },
      { path: "*", element: <Navigate to="/404" replace /> },
    ],
  },
];

export default main;
