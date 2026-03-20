import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";

const PendingRanks = Loadable(
  lazy(() => import("src/pages/admin/pendingranks/index"))
);

const pendingranks = [
  {
    path: "pendingranks",
    children: [
      { element: <Navigate to="PendingRanks" />, index: true },
      { path: "PendingRanks", element: <PendingRanks /> },
    ],
  },
];

export default pendingranks;
