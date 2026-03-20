import { TreeWithLegend } from "src/components/tree";

import legends from "src/pages/admin/genealogy/matrix/legendItems";
import { PATH_USER } from "src/routes/paths";

const UserMatrixTree = () => {
  return (
    <TreeWithLegend
      url="api/user/binarytree"
      legends={legends}
      title={"matrix"}
      links={[{ name: "dashboard", href: PATH_USER.root }, { name: "matrix" }]}
    />
  );
};

export default UserMatrixTree;
