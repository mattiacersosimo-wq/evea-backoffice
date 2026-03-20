import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "../Loadable";

const Wrapper = Loadable(lazy(() => import("src/pages/user/profile/index")));
const Profile = Loadable(
  lazy(() => import("src/pages/user/profile/sub-pages/profile/index"))
);

const Settings = Loadable(
  lazy(() => import("src/pages/user/profile/sub-pages/account-settings/index"))
);

const Referrals = Loadable(
  lazy(() => import("src/pages/user/profile/sub-pages/referrals/index"))
);

const Notes = Loadable(
  lazy(() => import("src/pages/user/profile/sub-pages/notes/index"))
);

const Edit = Loadable(
  lazy(() => import("src/pages/user/profile/sub-pages/edit/index"))
);
const Kyc = Loadable(
  lazy(() => import("src/pages/user/profile/sub-pages/approveKyc/approvekyc"))
);
const Payout = Loadable(
  lazy(() => import("src/pages/user/profile/sub-pages/payout/index"))
);

const profile = {
  path: "profile",
  element: <Wrapper />,
  children: [
    { index: true, element: <Navigate to="activity" /> },
    { path: "activity", element: <Profile /> },
    { path: "settings", element: <Settings /> },
    { path: "referrals", element: <Referrals /> },
    { path: "notes", element: <Notes /> },
    { path: "edit", element: <Edit /> },
    { path: "kyc", element: <Kyc /> },
    { path: "payout", element: <Payout /> },
  ],
};

export default profile;
