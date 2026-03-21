import { lazy } from "react";
import Loadable from "src/routes/Loadable";

const KpiDashboard = Loadable(
  lazy(() => import("src/pages/admin/kpi-dashboard/index"))
);

const dashboard = [
  {
    path: "dashboard",
    element: <KpiDashboard />,
  },
];

export default dashboard;
