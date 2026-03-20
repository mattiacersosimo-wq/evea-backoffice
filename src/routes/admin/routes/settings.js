import { lazy, useMemo } from "react";
import { Navigate } from "react-router";
import { PLANS } from "src/CONSTANTS";
import PlanConfirm from "src/components/plan-confirm";
import Loadable from "src/routes/Loadable";
import { usePlan } from "src/store/plan";

const BrandSettings = Loadable(
  lazy(() => import("src/pages/admin/settings/brand"))
);
const BusinessSettings = Loadable(
  lazy(() => import("src/pages/admin/settings/business/index"))
);
const NetworkSettings = Loadable(
  lazy(() => import("src/pages/admin/settings/network/index"))
);

const Withdrawal = Loadable(
  lazy(() => import("src/pages/admin/settings/withdrawal/index"))
);

const AdvancedSettings = Loadable(
  lazy(() => import("src/pages/admin/settings/advanced-settings/index"))
);

// const Lead = Loadable(lazy(() => import("src/pages/lead/admin/list/index")));
// const DefaultTemplate = Loadable(
//   lazy(() => import("src/pages/lead/admin/default/index"))
// );

const AdvancedSettingsSubPages = {
  currency: Loadable(
    lazy(() =>
      import("src/pages/admin/settings/advanced-settings/pages/currency/index")
    )
  ),
  kyc: Loadable(
    lazy(() =>
      import("src/pages/admin/settings/advanced-settings/pages/kyc/index")
    )
  ),
  lead: Loadable(
    lazy(() =>
      import("src/pages/admin/settings/advanced-settings/pages/leads/index")
    )
  ),
  payments: Loadable(
    lazy(() =>
      import(
        "src/pages/admin/settings/advanced-settings/pages/payment-methods/index"
      )
    )
  ),
  membershipSettings: Loadable(
    lazy(() =>
      import(
        "src/pages/admin/settings/advanced-settings/pages/membership-settings/index"
      )
    )
  ),
  twoFactorAuthentication: Loadable(
    lazy(() =>
      import("src/pages/admin/settings/advanced-settings/pages/2fa/index")
    )
  ),
  emailVerify: Loadable(
    lazy(() =>
      import(
        "src/pages/admin/settings/advanced-settings/pages/email-verify/index"
      )
    )
  ),
  packagePurchase: Loadable(
    lazy(() =>
      import(
        "src/pages/admin/settings/advanced-settings/pages/package-purchase/index"
      )
    )
  ),
};

const Referral = {
  binary: Loadable(
    lazy(() => import("src/pages/admin/settings/network/@pages/referral/index"))
  ),
  nonBinary: Loadable(
    lazy(() => import("src/pages/admin/settings/network/@pages/settings/index"))
  ),
};

const Bonus = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/first/index"))
);

const Level = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/level/index"))
);
const GoMvpBonus = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/gomvpbonus/index"))
);
const RspBonus = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/rsp-bonus-settings/index"))
);
const DirectSalesBonus = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/direct-sales-bonus-settings/index"))
);
const RobBonus = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/rob-bonus-settings/index"))
);
const ResidualMatching = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/residual-matching/index"))
);
const ThreeForFree = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/three-ff-bonus/index"))
);
const LeadershipBonus = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/leadership-bonus/index"))
);
const MvpMentorBonus = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/mvp-mentor-bonus/index"))
);
const Placementlaunchsettings = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/placementlaunchsettings/index"))
);
const IndirectSales = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/indirect-sales-bonus/index"))
);
const EveolvingBonus = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/eveloving-bonus/index"))
);
const RockSolidBonus = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/rock-solid-bonus/index"))
);
const Bronze = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/binary/index"))
);

const Roi = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/roi/index"))
);
const Binary = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/binary/index"))
);
const Rank = Loadable(
  lazy(() =>
    import("src/pages/admin/settings/network/@pages/rank-settings/index")
  )
);
const RankConfiguration = Loadable(
  lazy(() =>
    import(
      "src/pages/admin/settings/network/@pages/rank-settings-configuration/index"
    )
  )
);
const Matrix = Loadable(
  lazy(() => import("src/pages/admin/settings/network/@pages/matrix/index"))
);
const BinaryMatching = Loadable(
  lazy(() =>
    import("src/pages/admin/settings/network/@pages/binaryMatching/index")
  )
);
const MailSettings = Loadable(
  lazy(() => import("src/pages/admin/settings/mail/list/index"))
);

const DefaultTemplate = Loadable(
  lazy(() => import("src/pages/admin/settings/mail/template/index"))
);

// const Stair = Loadable(
//   lazy(() => import("src/pages/admin/settings/network/@pages/stair/index"))
// );

const { binary, roi, uniLevel, matrix, monoLine } = PLANS;

const CustomNavigate = () => {
  const plan = usePlan();

  const defaultRoute = useMemo(() => {
    if (plan) {
      switch (plan) {
        case binary: {
          return "binary";
        }

        case uniLevel: {
          return "rank";
        }

        case monoLine: {
          return "rank";
        }
        case matrix: {
          return "rank";
        }

        default: {
          return "binary";
        }
      }
    }
    return "binary";
  }, [plan]);

  return <Navigate to={defaultRoute} />;
};

const settings = [
  {
    path: "settings",
    children: [
      { element: <Navigate to="brand" />, index: true },
      { path: "brand", element: <BrandSettings /> },
      {
        path: "business",
        element: <BusinessSettings />,
      },
      {
        path: "network",
        element: <NetworkSettings />,
        children: [
          {
            index: true,
            element: <CustomNavigate />,
          },
          {
            path: "referral",
            element: <Referral.binary />,
          },
          {
            path: "bonus",
            element: <Bonus />,
          },

          {
            path: "level",
            element: <Level />,
          },
          {
            path: "gomvpbonus",
            element: <GoMvpBonus />,
          },
          {
            path: "rspbonus",
            element: <RspBonus />,
          },
          {
            path: "directsalesbonus",
            element: <DirectSalesBonus />,
          },
          {
            path: "robbonus",
            element: <RobBonus />,
          },
          {
            path: "residualmatching",
            element: <ResidualMatching />,
          },
          {
            path: "threeforfree",
            element: <ThreeForFree />,
          },
          {
            path: "leadershipbonus",
            element: <LeadershipBonus />,
          },
          {
            path: "pmbbonus",
            element: <MvpMentorBonus />,
          },
          {
            path: "isbonus",
            element: <IndirectSales />,
          },
          {
            path: "eveolvingbonus",
            element: <EveolvingBonus />,
          },
          {
            path: "rocksolidbonus",
            element: <RockSolidBonus />,
          },
          {
            path: "placementlaunchsettings",
            element: <Placementlaunchsettings />,
          },
          // {
          //   path: "stair",
          //   element: (
          //     <PlanConfirm>
          //       <Stair />
          //     </PlanConfirm>
          //   ),
          // },
          {
            path: "binary",
            element: (
              <PlanConfirm types={[binary, roi]}>
                <Binary />
              </PlanConfirm>
            ),
          },
          {
            path: "binaryMatching",
            element: (
              <PlanConfirm types={[binary, roi]}>
                <BinaryMatching />
              </PlanConfirm>
            ),
          },
          {
            path: "rank",
            element: <Rank />,
          },
          {
            path: "rank-configuration",
            element: <RankConfiguration />,
          },

          {
            path: "bronze",
            element: <Bronze />,
          },
          {
            path: "roi",
            element: (
              <PlanConfirm types={[roi]}>
                <Roi />
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
        ],
      },
      { path: "withdrawal", element: <Withdrawal /> },
      {
        path: "advanced-settings",
        element: <AdvancedSettings />,
        children: [
          { index: true, element: <Navigate to="currency" /> },
          {
            path: "currency",
            element: <AdvancedSettingsSubPages.currency />,
          },
          {
            path: "kyc",
            element: <AdvancedSettingsSubPages.kyc />,
          },
          {
            path: "leads",
            element: <AdvancedSettingsSubPages.lead />,
          },
          {
            path: "payments",
            element: <AdvancedSettingsSubPages.payments />,
          },

          {
            path: "membership-settings",
            element: <AdvancedSettingsSubPages.membershipSettings />,
          },
          {
            path: "2fa",
            element: <AdvancedSettingsSubPages.twoFactorAuthentication />,
          },
          {
            path: "email-verify",
            element: <AdvancedSettingsSubPages.emailVerify />,
          },
          {
            path: "package-purchase",
            element: <AdvancedSettingsSubPages.packagePurchase />,
          },
        ],
      },

      {
        path: "mail",
        children: [
          { index: true, element: <MailSettings /> },
          { path: ":id", element: <DefaultTemplate /> },
        ],
      },
    ],
  },
];

export default settings;
