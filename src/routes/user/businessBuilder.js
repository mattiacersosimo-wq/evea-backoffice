import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "../Loadable";

const Subscriptions = Loadable(
  lazy(() => import("src/pages/user/businessBuilder/subscriptions/index"))
);

const PayNow = Loadable(
  lazy(() =>
    import("src/pages/user/businessBuilder/subscriptions/payNow/index")
  )
);

const Materials = Loadable(
  lazy(() => import("src/pages/user/businessBuilder/materials/index"))
);

const OrderHistory = Loadable(
  lazy(() => import("src/pages/user/businessBuilder/orderHistory/index"))
);

const Documents = Loadable(
  lazy(() =>
    import("src/pages/user/businessBuilder/materials/subPages/documents/index")
  )
);

const Videos = Loadable(
  lazy(() =>
    import("src/pages/user/businessBuilder/materials/subPages/blog/index")
  )
);

const BusinessBuilderInvoice = Loadable(
  lazy(() => import("src/pages/invoice/businessBuilderInvoice/index"))
);

const businessBuilder = {
  path: "business-builder",
  children: [
    {
      index: true,
      element: <Navigate to="subscriptions" />,
    },
    {
      path: "subscriptions",
      children: [
        {
          index: true,
          element: <Subscriptions />,
        },
        {
          path: ":id",
          element: <BusinessBuilderInvoice />,
        },

        {
          path: "pay-now",
          element: <PayNow />,
        },
      ],
    },
    {
      path: "history",
      element: <OrderHistory />,
    },
    {
      path: "materials",
      element: <Materials />,
      children: [
        {
          index: true,
          element: <Navigate to="documents" />,
        },

        {
          path: "documents",
          element: <Documents />,
        },

        {
          path: "videos",
          element: <Videos />,
        },
      ],
    },
  ],
};

export default businessBuilder;
