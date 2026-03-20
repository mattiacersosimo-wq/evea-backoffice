import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";

const Documents = Loadable(
  lazy(() => import("src/pages/admin/tools/documents/index"))
);
const Videos = Loadable(lazy(() => import("src/pages/admin/tools/videos")));

const tools = [
  {
    path: "tools",
    children: [
      { element: <Navigate to="documents" />, index: true },
      { path: "documents", element: <Documents /> },
      { path: "videos", element: <Videos /> },
    ],
  },
];

export default tools;
