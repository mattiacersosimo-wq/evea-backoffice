import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";

import { isMenuActive } from "src/utils/actionProtector";
import AddDialog from "./components/add";
import DeleteCategory from "./components/delete";
import EditDialog from "./components/edit";
import useGetSubscriptionCategory from "./hooks/useGetSubscriptionCategory";
import Translate from "src/components/translate";

const headers = [
  "assign_subscriptions.no",
  "assign_subscriptions.category",
  "assign_subscriptions.action",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add-category"),
    edit: test("edit-category"),
    remove: test("delete-category"),
  };
};

const Categories = () => {
  const { state, fetchSubCategoryList, rowStart, ...rest } =
    useGetSubscriptionCategory();
  const { data, ...dataProps } = state;
  const [selectedId, setSelectedId] = useState(null);

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setSelectedId(id);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => {
    setOpenDelete(true);
    handleCloseMenu();
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedId(null);
  };

  const [openAddCategory, setOpenAddCategory] = useState(false);
  const handleClickOpenAddCategory = () => {
    setOpenAddCategory(true);
  };

  const handleCloseAddCategory = () => {
    setOpenAddCategory(false);
  };

  const [openEditCategory, setOpenEditCategory] = useState(false);
  const handleClickOpenEditCategory = () => {
    setOpenEditCategory(true);
    handleCloseMenu();
  };
  const handleCloseEditCategory = () => {
    setOpenEditCategory(false);
    setSelectedId(null);
  };

  const { add, remove, edit } = genStatus("nav.store.title", "nav.store.assign");

  return (
    <div>
      <Page title="Assign Subscriptions Categories: Store">
        <Ternary
          when={add}
          then={
            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                p: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                size="small"
                startIcon={<Iconify icon={"eva:plus-fill"} />}
                onClick={handleClickOpenAddCategory}
                name="add"
              >
                <Translate>{"assign_subscriptions.category"}</Translate>
              </Button>
            </Box>
          }
        />

        <Card sx={{ p: 2 }}>
          <Scrollbar>
            <DataHandlerTable
              name="faq-table"
              headers={headers}
              dataProps={{ ...dataProps }}
            >
              <Map
                list={data}
                render={(row, i) => (
                  <TableRow key={row.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <IconButton
                        disabled={!(edit || remove)}
                        onClick={handleOpenMenu(row.id)}
                        name="more-button"
                      >
                        <Iconify
                          icon={"eva:more-vertical-fill"}
                          width={20}
                          height={20}
                          name="more-button"
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
        <PaginationButtons {...rest} />
      </Page>

      <TableMenu open={openMenu} onClose={handleCloseMenu}>
        <Ternary
          when={edit}
          then={
            <MenuItem
              sx={{ color: "default.main" }}
              onClick={handleClickOpenEditCategory}
              name="edit"
            >
              <Iconify icon={"akar-icons:edit"} />
              <Translate>{"assign_subscriptions.edit"}</Translate>
            </MenuItem>
          }
        />

        <Ternary
          when={remove}
          then={
            <MenuItem
              sx={{ color: "error.main" }}
              onClick={handleOpenDelete}
              name="delete"
            >
              <Iconify icon={"eva:trash-2-outline"} />
              <Translate> {"assign_subscriptions.delete"}</Translate>
            </MenuItem>
          }
        />
      </TableMenu>

      <AddDialog
        open={openAddCategory}
        onClose={handleCloseAddCategory}
        fetchData={fetchSubCategoryList}
      />

      <DeleteCategory
        onClose={handleCloseDelete}
        open={openDelete}
        deleteId={selectedId}
        fetchData={fetchSubCategoryList}
      />

      <EditDialog
        open={openEditCategory}
        onClose={handleCloseEditCategory}
        editId={selectedId}
        fetchData={fetchSubCategoryList}
      />
    </div>
  );
};

export default Categories;
