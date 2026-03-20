import { PATH_DASHBOARD } from "src/routes/paths";

const useCrumps = () => {
  return [
    { name: "global.dashboard", href: PATH_DASHBOARD.root },
    {
      name: "sub_admin.sub_admin",
      href: PATH_DASHBOARD.subAdmin.sub_admins,
    },
    { name: "sub_admin.add_sub_admin" },
  ];
};
export default useCrumps;
