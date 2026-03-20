import { TreeWithLegend } from "src/components/tree";

import { PATH_DASHBOARD } from "src/routes/paths";
import legends from "./legendItems";

const UserMonoLineTree = () => {
  return (
    <TreeWithLegend
      title="genealogy.mono_line.title"
      url="api/user/monolinetree"
      legends={legends}
      links={[
        { name: "global.dashboard", href: PATH_DASHBOARD.root },
        { name: "genealogy.mono_line.title" },
      ]}
    />
  );
};

export default UserMonoLineTree;
