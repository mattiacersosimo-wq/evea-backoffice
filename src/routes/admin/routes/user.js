import { lazy } from "react";
import Loadable from "src/routes/Loadable";

const UserProfile = Loadable(
  lazy(() => import("src/pages/admin/dashboard/UserProfile"))
);

const Profile = Loadable(
  lazy(() => import("src/sections/user/profile/Profile"))
);

const EditProfile = Loadable(
  lazy(() => import("src/sections/user/profile/EditInfo"))
);

const ProfileSettings = Loadable(
  lazy(() => import("src/sections/user/profile/ProfileAccountSettings"))
);

const ProfileReferrals = Loadable(
  lazy(() => import("src/pages/user/profile/sub-pages/referrals/index"))
);
const ProfileNotes = Loadable(
  lazy(() => import("src/sections/user/profile/ProfileNotes"))
);

const user = [
  {
    path: "profile",
    element: <UserProfile />,
    children: [
      {
        element: <Profile />,
        index: true,
      },
      {
        path: "edit",
        element: <EditProfile />,
      },
      { path: "settings", element: <ProfileSettings /> },
      { path: "referrals", element: <ProfileReferrals /> },
      { path: "notes", element: <ProfileNotes /> },
    ],
  },
];

export default user;
