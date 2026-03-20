import { PATH_DASHBOARD } from "src/routes/paths";

import { TreeWithoutLegend } from "src/components/tree";

const UserSponsorTree = () => {
  return (
    <TreeWithoutLegend
      url="api/user/sponsortree"
      title="genealogy.sponsor.title"
      links={[
        { name: "global.dashboard", href: PATH_DASHBOARD.root },
        { name: "genealogy.sponsor.title" },
      ]}
    />
  );
};

export default UserSponsorTree;
