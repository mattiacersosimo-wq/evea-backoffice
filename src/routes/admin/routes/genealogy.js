import { lazy } from "react";
import { Navigate } from "react-router";
import { PLANS } from "src/CONSTANTS";
import PlanConfirm from "src/components/plan-confirm";
import Loadable from "src/routes/Loadable";

const Matrix = Loadable(
  lazy(() => import("src/pages/admin/genealogy/matrix/index"))
);

const Binary = Loadable(
  lazy(() => import("src/pages/admin/genealogy/binary/index"))
);

const MonoLine = Loadable(
  lazy(() => import("src/pages/admin/genealogy/mono-line/index"))
);
const Sponsor = Loadable(
  lazy(() => import("src/pages/admin/genealogy/sponsor/index"))
);
const Tree = Loadable(
  lazy(() => import("src/pages/admin/genealogy/tree/index"))
);

const List = Loadable(
  lazy(() => import("src/pages/admin/genealogy/list/index"))
);

const { binary, matrix, roi, uniLevel, monoLine } = PLANS;

const getPath = () => {
  const plan = localStorage.getItem("plan");

  switch (plan) {
    case binary: {
      return "binary";
    }

    case uniLevel: {
      return "sponsor";
    }

    case matrix: {
      return "matrix";
    }

    default: {
      return "binary";
    }
  }
};

const genealogy = [
  {
    path: "genealogy",
    children: [
      { element: <Navigate to={getPath()} />, index: true },
      {
        path: "binary",
        element: (
          <PlanConfirm types={[binary, roi]}>
            <Binary />
          </PlanConfirm>
        ),
      },
      {
        path: "matrix",
        element: (
          <PlanConfirm types={[matrix]}>
            <Matrix />
          </PlanConfirm>
        ),
      },
      {
        path: "sponsor",
        element: <Sponsor />,
      },
      { path: "tree", element: <Tree /> },
      { path: "list", element: <List /> },
      {
        path: "mono-line",
        element: (
          <PlanConfirm types={[monoLine]}>
            <MonoLine />
          </PlanConfirm>
        ),
      },
    ],
  },
];

export default genealogy;
