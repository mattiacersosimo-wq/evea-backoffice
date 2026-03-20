import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";

const Ewallet = Loadable(
  lazy(() => import("src/pages/admin/financial/ewallet"))
);
const DepositWallet = Loadable(
  lazy(() => import("src/pages/admin/financial/deposit"))
);
const FundCredits = Loadable(
  lazy(() => import("src/pages/admin/financial/fundCredit/index"))
);
const Payout = Loadable(
  lazy(() => import("src/pages/admin/financial/payout/index"))
);
const PendingCommission = Loadable(
  lazy(() => import("src/pages/admin/financial/pendingcommission/index"))
);
const PayoutRequest = Loadable(
  lazy(() =>
    import("src/pages/admin/financial/payout/components/request/index")
  )
);
const PayoutHistory = Loadable(
  lazy(() =>
    import("src/pages/admin/financial/payout/components/history/index")
  )
);
const FinancialReport = Loadable(
  lazy(() =>
    import("src/pages/admin/financial/financialReport/financialReport")
  )
);

const LatestSales = Loadable(
  lazy(() => import("src/pages/admin/financial/sales/index"))
);

const AdminAutofatture = Loadable(
  lazy(() => import("src/pages/admin/financial/autofatture/index"))
);

const financial = [
  {
    path: "financial",
    children: [
      { element: <Navigate to="e-wallet" />, index: true },
      { path: "e-wallet", element: <Ewallet /> },
      { path: "pendingcommission", element: <PendingCommission/> },
      { path: "deposit-wallet", element: <DepositWallet /> },
      { path: "fund-credits", element: <FundCredits /> },
      {
        path: "payout",
        element: <Payout />,
        children: [
          { index: true, element: <Navigate to="request" replace /> },
          { path: "request", element: <PayoutRequest /> },
          { path: "history", element: <PayoutHistory /> },
        ],
      },
      { path: "report", element: <FinancialReport /> },
      { path: "sales", element: <LatestSales /> },
      { path: "autofatture", element: <AdminAutofatture /> },
    ],
  },
];

export default financial;
