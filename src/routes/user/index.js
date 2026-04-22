import { lazy } from "react";
import { Navigate, Outlet } from "react-router";
import AuthGuard, { HideLeads, PromoterGuard, UserGuard } from "src/guards/AuthGuard";
import Layout from "src/layouts/layout";
import Loadable from "../Loadable";
import businessBuilder from "./businessBuilder";
import financial from "./financial";
import genealogy from "./genealogy";
import helpCenter from "./helpCenter";
import profile from "./profile";
import subscriptions from "./subscriptions";
import RecurringOrder from "src/pages/user/recurringOrders";

const LetteraIncarico = Loadable(
  lazy(() => import("src/pages/user/lettera-incarico/index"))
);
const Onboarding = Loadable(
  lazy(() => import("src/pages/user/onboarding/index"))
);
const TesserinoPage = Loadable(
  lazy(() => import("src/pages/user/tesserino/index"))
);

const ProductList = Loadable(
  lazy(() =>
    import("src/pages/user/onlineStore/productSubscription/productList/index")
  )
);
const ProductDetails = Loadable(
  lazy(() =>
    import("src/pages/user/onlineStore/productSubscription/details/index")
  )
);

const MyOrders = Loadable(
  lazy(() => import("src/pages/user/onlineStore/myOrders/index"))
);
const Referals = Loadable(
  lazy(() => import("src/pages/user/referals/index"))
);
// const PendingCommissions = Loadable(
//   lazy(() => import("src/pages/user/pendingCommissions/index"))
// );

const ViewOrderById = Loadable(
  lazy(() => import("src/pages/invoice/myOrders/index"))
);

const BlogPosts = Loadable(
  lazy(() => import("src/pages/user/blogs/BlogPosts"))
);
const BlogPost = Loadable(lazy(() => import("src/pages/user/blogs/BlogPost")));

const Dashboard = Loadable(
  lazy(() => import(`src/pages/user/dashboardRouter`))
);

const CommunityPage = Loadable(
  lazy(() => import("src/pages/user/community/index"))
);

const AffiliateDashboard = Loadable(
  lazy(() => import(`src/pages/user/affiliateDashboard`))
);

const IncomeReport = Loadable(
  lazy(() => import("src/pages/user/reports/index"))
);
const MissedPoints = Loadable(
  lazy(() => import("src/pages/user/missedPoints"))
);

const Events = Loadable(lazy(() => import("src/pages/user/events/index")));

const Checkout = Loadable(
  lazy(() => import("src/pages/user/onlineStore/checkout/index"))
);

const Cart = Loadable(
  lazy(() =>
    import("src/pages/user/onlineStore/checkout/components/cart/index")
  )
);

const Shipping = Loadable(
  lazy(() =>
    import("src/pages/user/onlineStore/checkout/components/shipping/index")
  )
);

const Payment = Loadable(
  lazy(() =>
    import("src/pages/user/onlineStore/checkout/components/payment/index")
  )
);

const Leads = Loadable(lazy(() => import("src/pages/lead/user/list/index")));
const LeadsDefaultTemplate = Loadable(
  lazy(() => import("src/pages/lead/user/default/index"))
);

const CouponPackage = Loadable(
  lazy(() => import("src/pages/user/onlineStore/coupons/index"))
);

const PendingPayments = Loadable(
  lazy(() =>
    import("src/pages/user/onlineStore/pending-payments/components/index")
  )
);
const TeamOrders = Loadable(
  lazy(() =>
    import("src/pages/user/onlineStore/teamOrders/index")
  )
);

const ViewCouponId = Loadable(
  lazy(() =>
    import("src/pages/user/onlineStore/coupons/componenets/view-packages")
  )
);

const CouponPurchase = Loadable(
  lazy(() => import("src/pages/user/onlineStore/coupon-purchase-list/index"))
);
const user = [
  {
    path: "user",
    element: (
      <AuthGuard>
        <UserGuard>
          <Layout />
        </UserGuard>
      </AuthGuard>
    ),
    children: [
      { element: <Navigate to="dashboard" />, index: true },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "affiliate-dashboard",
        element: <PromoterGuard><AffiliateDashboard /></PromoterGuard>,
      },
      {
        path: "events",
        element: <Events />,
      },

      // {
      //   path: "checkout",
      //   element: <Checkout />,
      //   children: [
      //     { index: true, element: <Cart /> },
      //     { path: "shipping", element: <Shipping /> },
      //     { path: "payment", element: <Payment /> },
      //   ],
      // },
      {
        path: "online-store",
        children: [
          {
            path: ":product_type",
            children: [
              { index: true, element: <ProductList /> },
              // { path: ":name", element: <ProductDetails /> },
            ],
          },
          {
            path: "my-orders",
            children: [
              { index: true, element: <MyOrders /> },
              {
                path: ":id",
                element: <ViewOrderById />,
              },
            ],
          },

          {
            path: "order-history",
            element: <PendingPayments />,
          },
          {
            path: "team-orders",
            element: <TeamOrders />,
          },

        ],
      },
      {
        path: "referals",
        element: <PromoterGuard><Referals /></PromoterGuard>,
      },
      // {
      //   path: "pendingcommissions",
      //   element: <PendingCommissions />,
      // },

      {
        path: "coupons",
        children: [
          { index: true, element: <Navigate to="list" /> },
          {
            path: "list",
            element: <CouponPurchase />,
          },
          // {
          //   path: "packages",
          //   children: [
          //     { index: true, element: <CouponPackage /> },
          //     {
          //       path: ":id",
          //       element: <ViewCouponId />,
          //     },
          //   ],
          // },
        ],
      },

      {
        path: "recurring-orders",
        children: [
          { index: true, element: <RecurringOrder /> }
        ],
      },
      {
        path: "blogs",
        children: [
          { index: true, element: <BlogPosts /> },
          { path: ":id", element: <BlogPost /> },
        ],
      },
      { path: "income-report", element: <PromoterGuard><IncomeReport /></PromoterGuard> },
      { path: "missed-points", element: <PromoterGuard><MissedPoints /></PromoterGuard> },
      {
        path: "leads",
        children: [
          {
            index: true,
            element: (
              <PromoterGuard>
                <HideLeads>
                  <Leads />
                </HideLeads>
              </PromoterGuard>
            ),
          },
          {
            path: "default",
            element: (
              <PromoterGuard>
                <HideLeads>
                  <LeadsDefaultTemplate />
                </HideLeads>
              </PromoterGuard>
            ),
          },
        ],
      },
      { ...businessBuilder, element: <PromoterGuard>{businessBuilder.element || <Outlet />}</PromoterGuard> },
      { ...genealogy, element: <PromoterGuard>{genealogy.element || <Outlet />}</PromoterGuard> },
      { ...subscriptions },
      { ...financial, element: <PromoterGuard>{financial.element || <Outlet />}</PromoterGuard> },
      { path: "community", element: <CommunityPage /> },
      { ...helpCenter },
      { ...profile },
      { path: "onboarding", element: <PromoterGuard><Onboarding /></PromoterGuard> },
      { path: "lettera-incarico", element: <PromoterGuard><LetteraIncarico /></PromoterGuard> },
      { path: "tesserino", element: <PromoterGuard><TesserinoPage /></PromoterGuard> },
    ],
  },
];

export default user;
