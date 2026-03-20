import { TreeWithLegend } from "src/components/tree";

import { PATH_DASHBOARD } from "src/routes/paths";
import legends from "./legendItems";

const AdminMonoLineTree = () => {
  return (
    <TreeWithLegend
      title="genealogy.mono_line.title"
      url="api/admin/monolinetree"
      legends={legends}
      links={[
        { name: "global.dashboard", href: PATH_DASHBOARD.root },
        { name: "genealogy.mono_line.title" },
      ]}
    />
  );
};

export default AdminMonoLineTree;
