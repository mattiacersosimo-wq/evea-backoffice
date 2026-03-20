import { TreeWithLegend } from "src/components/tree";

import { PATH_DASHBOARD } from "src/routes/paths";
import legends from "./legendItems";

const AdminMatrixTree = () => {
  return (
    <TreeWithLegend
      title="Matrix"
      url="api/admin/binarytree"
      legends={legends}
      links={[
        { name: "dashboard", href: PATH_DASHBOARD.root },
        { name: "matrix" },
      ]}
    />
  );
};

export default AdminMatrixTree;
