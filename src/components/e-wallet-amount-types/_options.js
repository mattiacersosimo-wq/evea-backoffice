import { PLANS } from "src/CONSTANTS";

const { binary, matrix, monoLine, roi, uniLevel } = PLANS;

const options = [
  { value: "all", label: "amount_types.all" },
  // { value: "referral_bonus", label: "amount_types.r_bonus" },
  {
    value: "deducted_by_admin",
    label: "amount_types.deducted_by_admin",
  },
  {
    value: "credited_by_admin",
    label: "amount_types.credited_by_admin",
  },
  { value: "fund_transfer", label: "amount_types.fund_transfer" },
  {
    plans: [roi],
    value: "roi_commission",
    label: "amount_types.roi_commission",
  },
  // {
  //   value: "first_order_bonus",
  //   label: "amount_types.first_order_bonus",
  // },
  // {
  //   value: "level_commission",
  //   label: "amount_types.level_commission",
  // },
  {
    plans: [binary, roi],
    value: "binary_bonus",
    label: "amount_types.b_bonus",
  },
  // {
  //   value: "rank_bonus",
  //   label: "amount_types.rank_bonus",
  // },
  {
    value: "go_mvp_bonus",
    label: "amount_types.go_mvp_bonus",
  },
  {
    value: "eveolving_bonus",
    label: "amount_types.eveolving_bonus",
  },
  {
    value: "rock_solid_bonus",
    label: "amount_types.rock_solid_bonus",
  },
  {
    value: "rock_solid_mvp_bonus",
    label: "amount_types.rock_solid_mvp_bonus",
  },
  {
    value: "rock_solid_mvp_additional_bonus",
    label: "amount_types.rock_solid_mvp_additional_bonus",
  },
  {
    value: "direct_sales_bonus",
    label: "amount_types.direct_sales_bonus",
  },
  {
    value: "pmb_bonus",
    label: "amount_types.pmb_bonus",
  },
  {
    value: "indirect_sales_bonus",
    label: "amount_types.indirect_sales_bonus",
  },
  {
    value: "leadership_bonus",
    label: "amount_types.leadership_bonus",
  },
  {
    value: "residual_bonus",
    label: "amount_types.residual_bonus",
  },
  {
    value: "residual_matching",
    label: "amount_types.residual_matching",
  },
  {
    plans: [binary, roi],
    value: "binary_matching_bonus",
    label: "amount_types.m_bonus",
  },
];

export default options;
