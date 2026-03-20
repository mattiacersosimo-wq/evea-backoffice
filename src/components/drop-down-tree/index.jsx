import { Box } from "@mui/material";
import Progress from "src/components/Progress";
import SearchByUser from "src/components/tree/components/search";
import { BasicTreeView } from "src/pages/user/genealogy/tree/components/tree";
import useGetTree from "./hooks/use-get-tree";

const DropDownTree = ({ URL }) => {
  const {
    treeData: data,
    onSearch,
    expandedUsers,
    handleExpand,
    handleReset,
  } = useGetTree(URL);

  const isLoaded = Boolean(Object.keys(data).length);

  if (!isLoaded) return <Progress />;
  return (
    <>
      <SearchByUser search={onSearch} handleReset={handleReset} />
      <Box marginLeft={1}>
        <BasicTreeView
          data={data}
          search={onSearch}
          expandedUsers={expandedUsers}
          handleExpand={handleExpand}
        />
      </Box>
    </>
  );
};

export default DropDownTree;
