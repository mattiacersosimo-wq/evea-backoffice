import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";

const Report = Loadable(lazy(() => import("src/pages/admin/reports/index")));
const FundReport = Loadable(
  lazy(() => import("src/pages/admin/reports/fund/index"))
);
const BuilderReport = Loadable(
  lazy(() => import("src/pages/admin/reports/builder/index"))
);
const PayoutReport = Loadable(
  lazy(() => import("src/pages/admin/reports/payout/index"))
);

const PointReport = Loadable(
  lazy(() => import("src/pages/admin/reports/point/index"))
);
const SalesReport = Loadable(
  lazy(() => import("src/pages/admin/reports/sales/index"))
);
const JoiningReport = Loadable(
  lazy(() => import("src/pages/admin/reports/joining/index"))
);

const IncomeReport = Loadable(
  lazy(() => import("src/pages/admin/reports/income/index"))
);

const TopEarnersReport = Loadable(
  lazy(() => import("src/pages/admin/reports/top-earners/index"))
);

const reports = [
  {
    path: "report",
    element: <Report />,
    children: [
      {
        element: <Navigate to="builder" />,
        index: true,
      },
      {
        path: "builder",
        element: (
          <BuilderReport
            title="settings.reports.business_builder"
            heading="settings.reports.business_builder"
          />
        ),
      },
      {
        path: "fund/credit",
        element: (
          <FundReport
            title="settings.reports.fund_transfer"
            heading="settings.reports.fund_transfer"
          />
        ),
      },
      {
        path: "joining",
        element: (
          <JoiningReport
            title="settings.reports.joining_report"
            heading="settings.reports.joining_report"
          />
        ),
      },
      {
        path: "income",
        element: (
          <IncomeReport
            title="settings.reports.member_income"
            heading="settings.reports.member_income"
          />
        ),
      },
      {
        path: "payout",
        element: (
          <PayoutReport
            title="settings.reports.payout_report"
            heading="settings.reports.payout_report"
          />
        ),
      },

      {
        path: "point/history",
        element: (
          <PointReport
            title="settings.reports.point_history"
            heading="settings.reports.point_history"
          />
        ),
      },
      {
        path: "earners",
        element: (
          <TopEarnersReport
            title="settings.reports.top_earners"
            heading="settings.reports.top_earners"
          />
        ),
      },
      {
        path: "sales",
        element: (
          <SalesReport
            title="settings.reports.sales"
            heading="settings.reports.sales"
          />
        ),
      },
    ],
  },
];

export default reports;
