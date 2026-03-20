import {
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";

import Translate from "src/components/translate";
import { isMenuActive } from "src/utils/actionProtector";
import DeleteDialog from "./components/deleteDialog";
import { AddForm, EditForm } from "./components/form";
import DataList from "./components/list/dataList";
import useArticleList from "./hooks/useArticleList";
import Transition from "src/utils/dialog-animation";

const headers = [
  "articles.articles.table.no",
  "articles.articles.table.title",
  "articles.articles.table.time",
  "articles.articles.table.actions",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add-article"),
    edit: test("edit-article"),
    delete: test("delete-article"),
  };
};

const DataTable = () => {
  const permission = genStatus(
    "nav.communication.title",
    "nav.communication.article"
  );

  const theme = useTheme();

  const [selectedId, setSelectedId] = useState(null);
  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id) => (event) => {
    setSelectedId(id);
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  const [openCreateArticle, setOpenCreateArticle] = useState(false);
  const handleClickOpenCreateArticle = () => {
    setOpenCreateArticle(true);
    handleCloseMenu();
  };

  const handleCloseCreateArticle = () => {
    setOpenCreateArticle(false);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => {
    setOpenEdit(true);
    handleCloseMenu();
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => {
    setOpenDelete(true);
    handleCloseMenu();
  };

  const handleCloseDelete = () => setOpenDelete(false);

  const { state, articleList, fetchArticleList, rowStart, ...rest } =
    useArticleList();
  const { data, ...dataProps } = state;

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };
  return (
    <>
      <div>
        <HeaderBreadcrumbs
          links={[{ name: "articles.articles.title" }]}
          action={
            <>
              <Box
                sx={{
                  display: "grid",
                  columnGap: 1,
                  rowGap: 3,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(1, 1fr)",
                  },
                }}
              >
                <Ternary
                  when={permission.add}
                  then={
                    <Button
                      {...buttonProps}
                      variant="contained"
                      startIcon={<Iconify icon={"eva:plus-fill"} />}
                      onClick={handleClickOpenCreateArticle}
                      size="small"
                      name="add-article"
                    >
                      <Translate>articles.articles.add_button</Translate>
                    </Button>
                  }
                />
              </Box>
            </>
          }
        />
        <Card>
          <Scrollbar>
            <DataHandlerTable
              name="article-table"
              headers={headers}
              dataProps={{ ...dataProps }}
            >
              <Map
                list={data}
                render={(articles, i) => (
                  <DataList
                    disabledActions={!(permission.edit || permission.delete)}
                    handleOpenMenu={handleOpenMenu}
                    articles={articles}
                    rowNumber={rowStart + i}
                  />
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>

        <TableMenu onClose={handleCloseMenu} open={openMenu}>
          <Ternary
            when={permission.edit}
            then={
              <MenuItem
                sx={{ color: "default.main" }}
                onClick={handleOpenEdit}
                name="edit"
              >
                <Iconify icon={"akar-icons:edit"} />
                <Translate>articles.articles.actions.edit</Translate>
              </MenuItem>
            }
          />

          <Ternary
            when={permission.delete}
            then={
              <MenuItem
                sx={{ color: "error.main" }}
                onClick={handleOpenDelete}
                name="delete"
              >
                <Iconify icon={"eva:trash-2-outline"} />
                <Translate>articles.articles.actions.delete</Translate>
              </MenuItem>
            }
          />
        </TableMenu>

        <Dialog
          fullWidth
          maxWidth="sm"
          open={openCreateArticle}
          onClose={handleCloseCreateArticle}
          aria-labelledby="create-article"
          TransitionComponent={Transition}
        >
          <DialogTitle id="create-article">
            <Translate>articles.articles.form.add_title</Translate>
          </DialogTitle>
          <AddForm
            onClose={handleCloseCreateArticle}
            reload={fetchArticleList}
          />
        </Dialog>

        <Dialog
          fullWidth
          maxWidth="sm"
          open={openEdit}
          onClose={handleCloseEdit}
          aria-labelledby="create-article"
          TransitionComponent={Transition}
        >
          <DialogTitle id="create-article">
            <Translate>articles.articles.form.edit_title</Translate>
          </DialogTitle>
          <EditForm
            selectedId={selectedId}
            onClose={handleCloseEdit}
            reload={fetchArticleList}
          />
        </Dialog>

        <DeleteDialog
          fetchData={fetchArticleList}
          onClose={handleCloseDelete}
          open={openDelete}
          selectedId={selectedId}
        />
      </div>
      <PaginationButtons {...rest} />
    </>
  );
};

export default DataTable;
