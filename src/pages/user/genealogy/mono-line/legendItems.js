import Iconify from "src/components/Iconify";

const legends = [
  {
    plan: "other",
    title: "genealogy.legends.name",
    key: "name",
    icon: <Iconify icon="wpf:name" width={20} height={20} />,
  },
  {
    plan: "other",
    title: "genealogy.legends.uname",
    key: "username",
    icon: <Iconify icon="bxs:user" width={20} height={20} />,
  },
  {
    plan: "other",
    title: "genealogy.legends.current_rank",
    key: "rank",
    icon: <Iconify icon="fa6-solid:ranking-star" width={20} height={20} />,
  },
  {
    plan: "other",
    title: "genealogy.legends.doj",
    key: "date",
    icon: <Iconify icon="ic:round-date-range" width={20} height={20} />,
  },
  {
    plan: "monoLine",
    title: "genealogy.legends.w_bv_l",
    key: "weeklyBvLeft",
    icon: <Iconify icon="bi:calendar-week-fill" width={20} height={20} />,
  },
  {
    plan: "monoLine",
    title: "genealogy.legends.w_bv_r",
    key: "weeklyBvRight",
    icon: <Iconify icon="bi:calendar2-week-fill" width={20} height={20} />,
  },
  {
    plan: "monoLine",
    title: "genealogy.legends.t_bv_l",
    key: "leftCarry",
    icon: <Iconify icon="akar-icons:arrow-down-left" width={20} height={20} />,
  },
  {
    plan: "monoLine",
    title: "genealogy.legends.t_bv_r",
    key: "rightCarry",
    icon: <Iconify icon="akar-icons:arrow-down-right" width={20} height={20} />,
  },
  {
    plan: "monoLine",
    title: "genealogy.legends.t_l_users",
    key: "leftUsers",
    icon: (
      <Iconify icon="ant-design:arrow-left-outlined" width={20} height={20} />
    ),
  },
  {
    plan: "monoLine",
    title: "genealogy.legends.t_r_users",
    key: "rightUsers",
    icon: (
      <Iconify icon="ant-design:arrow-right-outlined" width={20} height={20} />
    ),
  },
];

export default legends;
