import { TreeWithLegend } from "src/components/tree";

import legends from "src/pages/admin/genealogy/binary/legendItems";
import { PATH_USER } from "src/routes/paths";

const UserBinaryTree = () => {
  return (
    <TreeWithLegend
      url="api/user/binarytree"
      legends={legends}
      title="genealogy.binary.title"
      links={[
        { name: "global.dashboard", href: PATH_USER.root },
        { name: "genealogy.binary.title" },
      ]}
    />
  );
};

export default UserBinaryTree;
