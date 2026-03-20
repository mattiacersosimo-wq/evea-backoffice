import { lazy } from "react";
import Loadable from "src/routes/Loadable";

const Statistics = Loadable(lazy(() => import("src/pages/admin/statistics")));

const SubscriptionsUsers = Loadable(
  lazy(() => import("src/pages/admin/statistics/components/pages/index"))
);
const ProfileUser = Loadable(
  lazy(() => import("src/pages/admin/statistics/components/pages/profileUser"))
);

const statistics = [
  {
    path: "statistics",
    children: [
      { index: true, element: <Statistics /> },
      { path: "subscriptions_users", element: <SubscriptionsUsers /> },
      { path: "profile_user", element: <ProfileUser /> },
    ],
  },
];

export default statistics;
