import { useState } from "react";

const useTreeNavigation = (fetchTreeData) => {
  const [parentIds, setParentId] = useState([]);

  const goBack = () => {
    const lastParent = parentIds.pop();
    setParentId(parentIds);
    lastParent ? fetchTreeData(lastParent) : fetchTreeData();
  };

  const goToNode = (id, parentId) => {
    setParentId([...parentIds, parentId]);
    fetchTreeData(id);
  };

  return { goToNode, goBack };
};

export default useTreeNavigation;
