import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";

const UserSubscriptions = Loadable(
  lazy(() => import("src/pages/admin/userSubscriptions/index"))
);

const subscriptions = [
  {
    path: "subscriptions",
    children: [
      { index: true, element: <Navigate to="user" /> },
      { path: "user", element: <UserSubscriptions /> },
    ],
  },
];

export default subscriptions;
