import { PLANS } from "src/CONSTANTS";
const { binary, matrix, roi, uniLevel, monoLine } = PLANS;
const tabs = [
  {
    value: "settings.network.binary_bonus_settings",
    icon: "clarity:list-solid-badged",
    name: "binary",
    plans: [binary, roi],
  },
  {
    value: "global.binary_matching_bonus_settings",
    icon: "tabler:binary-tree-2",
    name: "binaryMatching",
    plans: [binary, roi],
  },
  {
    value: "settings.network.rank_settings",
    icon: "fa6-solid:ranking-star",
    name: "rank",
    plans: [binary, roi, uniLevel, matrix, monoLine],
  },
  {
    value: "settings.network.go_mvp_bonus_settings",
    icon: "mdi:stairs-up",
    name: "gomvpbonus",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },
  {
    value: "settings.network.rock_solid_mvp_bonus",
    icon: "tabler:binary-tree-2",
    name: "rspbonus",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },
  {
    value: "settings.network.rob_bonus_settings",
    icon: "fluent-mdl2:chat-invite-friend",
    name: "robbonus",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },
  {
    value: "settings.network.three_ff_bonus_settings",
    icon: "streamline-plump:graph-bar-increase",
    name: "threeforfree",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },
  {
    value: "settings.network.direct_sales_bonus_settings",
    icon: "carbon:sales-ops",
    name: "directsalesbonus",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },
  {
    value: "settings.network.pmb_bonus_settings",
    icon: "material-symbols:social-leaderboard-outline-rounded",
    name: "pmbbonus",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },
  {
    value: "settings.network.is_bonus_settings",
    icon: "material-symbols:fan-indirect",
    name: "isbonus",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },
  {
    value: "settings.network.eveolving_bonus_settings",
    icon: "fluent-mdl2:commitments",
    name: "eveolvingbonus",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },
  // {
  //   value: "Rank Settings Configuration",
  //   icon: "fa6-solid:ranking-star",
  //   name: "rank-configuration",
  //   plans: [binary, roi, uniLevel, matrix, monoLine],
  // },
  // {
  //   value: "settings.network.referral_commission_settings",
  //   icon: "fluent-mdl2:chat-invite-friend",
  //   name: "referral",
  //   plans: [binary, roi, uniLevel, matrix, monoLine],
  // },
  // {
  //   value: "settings.network.first_order_bonus",
  //   icon: "ic:round-receipt",
  //   name: "bonus",
  //   plans: [binary, roi, matrix, uniLevel, monoLine],
  // },
  {
    value: "settings.network.residual_bonus",
    icon: "mdi:graph-line-variant",
    name: "level",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },
  {
    value: "settings.network.leadership_bonus",
    icon: "fluent-mdl2:party-leader",
    name: "leadershipbonus",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },
  {
    value: "settings.network.residual_matching",
    icon: "clarity:list-solid-badged",
    name: "residualmatching",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },

  {
    value: "settings.network.rocksolid_bonus_settings",
    icon: "solar:pen-2-linear",
    name: "rocksolidbonus",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },

  {
    value: "settings.network.placement_lounge_settings",
    icon: "ph:ranking-bold",
    name: "placementlaunchsettings",
    plans: [binary, roi, matrix, uniLevel, monoLine],
  },

  {
    value: "settings.network.roi_settings",
    icon: "mdi:graph-line-variant",
    name: "roi",
    plans: [roi],
  },
  {
    value: "Stair Step Settings",
    icon: "mdi:stairs-up",
    name: "stair",
    plans: [],
  },
  {
    value: "Matrix",
    icon: "mdi:stairs-up",
    name: "matrix",
    plans: [matrix],
  },
];

export default tabs;
