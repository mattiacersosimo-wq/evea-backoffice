import { useState } from "react";

import { Card, Dialog, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";
import { isMenuActive } from "src/utils/actionProtector";
import Actions from "./components/actions";
import ArticleWrapper from "./components/articleWrapper";
import DeleteDialog from "./components/deleteDialog";
import { EditForm } from "./components/form";
import DataList from "./components/list/dataList";
import useArticleCategoryList from "./hooks/useArticleCategoryList";
import Transition from "src/utils/dialog-animation";

const headers = [
  "articles.categories.table.no",
  "articles.categories.table.title",
  "articles.categories.table.time",
  "articles.categories.table.actions",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add-category"),
    edit: test("edit-category"),
    delete: test("delete-category"),
  };
};

const DataTable = () => {
  const theme = useTheme();

  const { state, categoryList, fetchCategoryList, rowStart, ...rest } =
    useArticleCategoryList();
  const { data, ...dataProps } = state;
  const [selectedId, setSelectedId] = useState(null);
  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setSelectedId(id);
  };
  const handleCloseMenu = () => setOpenMenuActions(null);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => {
    setOpenDelete(true);
    handleCloseMenu();
  };
  const handleCloseDelete = () => setOpenDelete(false);

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => {
    setOpenEdit(true);
    handleCloseMenu();
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const permission = genStatus(
    "nav.communication.title",
    "nav.communication.article"
  );

  return (
    <>
      <ArticleWrapper
        fetchCategoryList={fetchCategoryList}
        showAdd={permission.add}
      >
        <Card>
          <Scrollbar>
            <DataHandlerTable
              name="category-table"
              headers={headers}
              dataProps={{ ...dataProps }}
            >
              <Map
                list={data}
                render={(category, i) => (
                  <DataList
                    disabledActions={!(permission.edit || permission.delete)}
                    handleOpenMenu={handleOpenMenu}
                    category={category}
                    rowNumber={rowStart + i}
                  />
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
        <Ternary
          when={!dataProps.isArrayEmpty}
          then={<PaginationButtons {...rest} />}
        />
        <TableMenu onClose={handleCloseMenu} open={openMenu}>
          <Actions
            permission={permission}
            openDelete={handleOpenDelete}
            openEdit={handleOpenEdit}
          />
        </TableMenu>
      </ArticleWrapper>

      <DeleteDialog
        fetchData={fetchCategoryList}
        onClose={handleCloseDelete}
        open={openDelete}
        selectedId={selectedId}
      />

      <Dialog
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="add-article-category"
      >
        <EditForm
          selectedId={selectedId}
          fetchData={fetchCategoryList}
          onClose={handleCloseEdit}
        />
      </Dialog>
    </>
  );
};

export default DataTable;
