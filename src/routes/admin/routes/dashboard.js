import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";

const Business = Loadable(
  lazy(() => import("src/pages/admin/dashboard/business/index"))
);
const Network = Loadable(
  lazy(() => import("src/pages/admin/dashboard/network"))
);

const dashboard = [
  {
    path: "dashboard",
    children: [
      { index: true, element: <Navigate to="business" /> },
      {
        path: "business",
        element: <Business />,
      },
      {
        path: "network",
        element: <Network />,
      },
    ],
  },
];

export default dashboard;
