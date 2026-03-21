import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";

const Business = Loadable(
  lazy(() => import("src/pages/admin/dashboard/business/index"))
);
const Network = Loadable(
  lazy(() => import("src/pages/admin/dashboard/network"))
);
const KpiDashboard = Loadable(
  lazy(() => import("src/pages/admin/kpi-dashboard/index"))
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
      {
        path: "kpi",
        element: <KpiDashboard />,
      },
    ],
  },
];

export default dashboard;
