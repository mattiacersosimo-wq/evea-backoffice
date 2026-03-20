import { TreeWithLegend } from "src/components/tree";

import { PATH_DASHBOARD } from "src/routes/paths";
import legends from "./legendItems";

const AdminBinaryTree = () => {
  return (
    <TreeWithLegend
      title="genealogy.binary.title"
      url="api/admin/binarytree"
      legends={legends}
      links={[
        { name: "global.dashboard", href: PATH_DASHBOARD.root },
        { name: "genealogy.binary.title" },
      ]}
    />
  );
};

export default AdminBinaryTree;
