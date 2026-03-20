import { useState } from "react";

import { Box, Card, Divider, MenuItem } from "@mui/material";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import DataList from "./components/categoryRow";

import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useQueryParams from "src/hooks/useQueryParams";
import DeleteDialog from "./components/DeleteDialog";
import UpdateCategory from "./components/UpdateCategory";
import Wrapper from "./components/Wrapper";
import AddDialog from "./components/addDialog";
import useBlogCategoryList from "./hooks/useBlogCategoryList";

const headers = [
  "blogs.categories.table.no",
  "blogs.categories.table.name",
  "blogs.categories.table.desc",
  "blogs.categories.table.action",
];

const Index = () => {
  const { state, fetchCategoryList, rowStart, ...rest } = useBlogCategoryList();
  const { data, ...dataProps } = state;
  const [openActionMenu, setOpenMenuActions] = useState(null);
  const { addParam, clear } = useQueryParams();

  const openMenu = (id) => (event) => {
    addParam("selected_id", id);
    setOpenMenuActions(event.currentTarget);
  };

  const [openAddCategory, setOpenAddCategory] = useState(false);
  const handleClickOpenAddCategory = () => {
    setOpenAddCategory(true);
  };
  const handleCloseAddCategory = () => {
    setOpenAddCategory(false);
  };
  const handleCloseMenu = () => {
    clear();
    setOpenMenuActions(null);
  };

  return (
    <>
      <Wrapper handleClickOpenAddCategory={handleClickOpenAddCategory}>
        <Card sx={{ pt: 2, mt: 0 }}>
          <Scrollbar>
            <DataHandlerTable
              name="name-category"
              headers={headers}
              dataProps={{ ...dataProps }}
            >
              <Map
                list={data}
                render={(category, i) => (
                  <DataList
                    openMenu={openMenu}
                    category={category}
                    rowNumber={rowStart + i}
                  />
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
      </Wrapper>

      <TableMenu onClose={handleCloseMenu} open={openActionMenu}>
        <MenuItem
          sx={{ color: "default.main" }}
          onClick={() => addParam("open", "edit")}
          name="edit"
        >
          <Iconify icon={"akar-icons:edit"} />
          <Translate>actions.edit</Translate>
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => addParam("open", "delete")}
          name="delete"
        >
          <Iconify icon={"eva:trash-2-outline"} />
          <Translate>actions.delete</Translate>
        </MenuItem>
      </TableMenu>
      <DeleteDialog fetchData={fetchCategoryList} onClose={handleCloseMenu} />
      <UpdateCategory onClose={handleCloseMenu} fetchData={fetchCategoryList} />

      <AddDialog
        reload={fetchCategoryList}
        onClose={handleCloseAddCategory}
        open={openAddCategory}
      />

      <Ternary
        when={!dataProps.isArrayEmpty}
        then={<PaginationButtons {...rest} />}
      />
    </>
  );
};

export default Index;
