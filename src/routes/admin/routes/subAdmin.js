// import { lazy } from "react";
// import { Navigate } from "react-router";
// import Loadable from "src/routes/Loadable";

// const SubAdmin = Loadable(lazy(() => import("src/pages/admin/subAdmin/index")));

// const AddSubAdminGroup = Loadable(
//   lazy(() => import("src/pages/admin/subAdmin/groups/index"))
// );
// const SubAdminProfile = Loadable(
//   lazy(() => import("src/pages/admin/subAdmin/Profile"))
// );
// const AddSubAdmin = Loadable(
//   lazy(() => import("src/pages/admin/subAdmin/subAdmins"))
// );

// const subAdmin = [
//   {
//     path: "sub-admin",
//     children: [
//       { index: true, element: <SubAdmin /> },
//       { path: ":sid", element: <SubAdminProfile /> },
//       { path: "add", element: <AddSubAdmin /> },
//       {
//         path: "group",
//         children: [
//           { index: true, element: <Navigate to="add" /> },
//           { path: ":sid", element: <AddSubAdminGroup /> },
//           { path: "add", element: <AddSubAdminGroup /> },
//         ],
//       },
//     ],
//   },
// ];

// export default subAdmin;

import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";

const SubAdmin = Loadable(lazy(() => import("src/pages/admin/subAdmin/index")));

const AddSubAdminGroup = Loadable(
  lazy(() => import("src/pages/admin/subAdmin/groups/index"))
);
const SubAdminProfile = Loadable(
  lazy(() => import("src/pages/admin/subAdmin/Profile"))
);
const AddSubAdmin = Loadable(
  lazy(() => import("src/pages/admin/subAdmin/subAdmins"))
);

const Active = Loadable(
  lazy(() => import("src/pages/admin/subAdmin/active/index"))
);
const InActive = Loadable(
  lazy(() => import("src/pages/admin/subAdmin/inactive/index"))
);

const Trashed = Loadable(
  lazy(() => import("src/pages/admin/subAdmin/trashed/index"))
);

const subAdmin = [
  {
    path: "sub-admin",
    children: [
      { index: true, element: <Navigate to="list/active" /> },
      {
        path: "list",
        element: <SubAdmin />,
        children: [
          { path: "active", element: <Active /> },
          { path: "in-active", element: <InActive /> },
          { path: "trashed", element: <Trashed /> },
        ],
      },
      { path: ":sid", element: <SubAdminProfile /> },
      { path: "add", element: <AddSubAdmin /> },
      {
        path: "group",
        children: [
          { index: true, element: <Navigate to="add" /> },
          { path: "add", element: <AddSubAdminGroup /> },
          { path: ":sid", element: <AddSubAdminGroup /> },
        ],
      },
    ],
  },
];

export default subAdmin;
