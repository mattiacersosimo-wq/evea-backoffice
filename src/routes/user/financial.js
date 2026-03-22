import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "../Loadable";

const FundTransfer = Loadable(
  lazy(() => import("src/pages/user/financial/fundTransfer"))
);

const EWallet = Loadable(
  lazy(() => import("src/pages/user/financial/ewallet"))
);

const DepositWallet = Loadable(
  lazy(() => import("src/pages/user/financial/deposit"))
);
const PendingCommissions = Loadable(
  lazy(() => import("src/pages/user/financial/pendingCommissions/index"))
);

const AddCredit = Loadable(
  lazy(() => import("src/pages/user/financial/deposit/addCredit"))
);

const RequestPayout = Loadable(
  lazy(() => import("src/pages/user/financial/requestPayout/index"))
);

const Autofatture = Loadable(
  lazy(() => import("src/pages/user/financial/autofatture/index"))
);

const Wallet = Loadable(
  lazy(() => import("src/pages/user/financial/wallet/index"))
);

const financial = {
  path: "financial",
  children: [
    { index: true, element: <Navigate to="wallet" /> },
    { path: "wallet", element: <Wallet /> },
    { path: "e-wallet", element: <EWallet /> },
    {
      path: "deposit-wallet",
      children: [
        { index: true, element: <DepositWallet /> },
        { path: "add-credit", element: <AddCredit /> },
      ],
    },
    { path: "funds-transfer", element: <FundTransfer /> },
    { path: "pendingcommissions", element: <PendingCommissions /> },
    { path: "payout", element: <RequestPayout /> },
    { path: "autofatture", element: <Autofatture /> },
  ],
};

export default financial;
