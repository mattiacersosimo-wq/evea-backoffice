import { TreeWithoutLegend } from "src/components/tree";

import { PATH_DASHBOARD } from "src/routes/paths";

const AdminSponsorTree = () => {
  return (
    <TreeWithoutLegend
      url="api/admin/sponsortree"
      title="genealogy.sponsor.title"
      links={[
        { name: "global.dashboard", href: PATH_DASHBOARD.root },
        { name: "genealogy.sponsor.title" },
      ]}
    />
  );
};

export default AdminSponsorTree;
