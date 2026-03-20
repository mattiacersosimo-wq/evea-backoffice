import { lazy } from "react";
import { Navigate } from "react-router";
import { PLANS } from "src/CONSTANTS";
import PlanConfirm from "src/components/plan-confirm";
import Loadable from "../Loadable";

const BinaryTree = Loadable(
    lazy(() => import("src/pages/user/genealogy/binary/index"))
);

const BinaryLeg = Loadable(
    lazy(() => import("src/pages/user/genealogy/binaryLeg/index"))
);

const Sponsor = Loadable(
    lazy(() => import("src/pages/user/genealogy/sponsor/index"))
);

const Affiliate = Loadable(
    lazy(() => import("src/pages/user/genealogy/affiliate/index"))
);

const Matrix = Loadable(
    lazy(() => import("src/pages/user/genealogy/matrix/index"))
);
const List = Loadable(
    lazy(() => import("src/pages/user/genealogy/list/index"))
);

const Tree = Loadable(
    lazy(() => import("src/pages/user/genealogy/tree/index"))
);

const MonoLine = Loadable(
    lazy(() => import("src/pages/user/genealogy/mono-line/index"))
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

const genealogy = {
    path: "genealogy",
    children: [
        { index: true, element: <Navigate to={getPath()} /> },
        {
            path: "binaryLeg",
            element: (
                <PlanConfirm types={[binary, roi]}>
                    <BinaryLeg />
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
            path: "mono-line",
            element: (
                <PlanConfirm types={[monoLine]}>
                    <MonoLine />
                </PlanConfirm>
            ),
        },

        {
            path: "binary",
            element: (
                <PlanConfirm types={[binary, roi]}>
                    <BinaryTree />
                </PlanConfirm>
            ),
        },
        { path: "sponsor", element: <Sponsor /> },
        { path: "affiliate", element: <Affiliate /> },
        { path: "list", element: <List /> },
        { path: "tree", element: <Tree /> },
    ],
};

export default genealogy;
