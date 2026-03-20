import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";

const NetworkMembers = Loadable(
  lazy(() => import("src/pages/admin/members/network"))
);

const MemberProfile = Loadable(
  lazy(() => import("src/pages/admin/members/Profile"))
);

const HoldingTank = Loadable(
  lazy(() => import("src/pages/admin/members/holdingTank/index"))
);

const Profile = Loadable(
  lazy(() => import("src/pages/admin/members/Profile/components/Profile"))
);

const Edit = Loadable(
  lazy(() =>
    import("src/pages/admin/members/Profile/components/EditInfo/index")
  )
);
const Settings = Loadable(
  lazy(() =>
    import("src/pages/admin/members/Profile/components/ProfileAccountSettings")
  )
);

const Referral = Loadable(
  lazy(() =>
    import("src/pages/admin/members/Profile/components/ProfileReferrals")
  )
);

const Notes = Loadable(
  lazy(() => import("src/pages/admin/members/Profile/components/ProfileNotes"))
);
const KYC = Loadable(lazy(() => import("src/pages/admin/members/kyc/index")));

const members = [
  {
    path: "members",
    children: [
      { element: <Navigate to="network" />, index: true },
      { path: "network", element: <NetworkMembers /> },
      {
        path: "holding-tank",
        element: <HoldingTank />,
      },

      {
        path: "kyc-details",
        element: <KYC />,
      },

      {
        path: "profile/:mid",
        element: <MemberProfile />,
        children: [
          { index: true, element: <Navigate to="profile" /> },
          { path: "profile", element: <Profile /> },
          { path: "edit", element: <Edit /> },
          { path: "settings", element: <Settings /> },
          { path: "referrals", element: <Referral /> },
          { path: "notes", element: <Notes /> },
        ],
      },
    ],
  },
];

export default members;
