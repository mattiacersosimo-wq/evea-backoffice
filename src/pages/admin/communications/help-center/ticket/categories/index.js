import { Box, Button, Card, Dialog, Grid, Typography } from "@mui/material";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import Ternary from "src/components/ternary";

import Translate from "src/components/translate";
import TableMenu from "src/pages/admin/settings/brand/@shared/tableMenu";
import { isMenuActive } from "src/utils/actionProtector";
import Actions from "./components/Actions";
import { AddForm, EditForm } from "./components/form";
import DataList from "./components/list/dataList";
import useCategoriesList from "./hooks/useCategoriesList";
import Transition from "src/utils/dialog-animation";

const headers = [
  "help_center.categories.table.no",
  "help_center.categories.table.name",
  "help_center.categories.table.status",
  "help_center.categories.table.desc",
  "help_center.categories.table.actions",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add-categories"),
    edit: test("edit-categories"),
    delete: test("delete-categories"),
  };
};

const Index = () => {
  const status = genStatus(
    "nav.communication.title",
    "nav.communication.help_center"
  );

  const { state, categoriesList, fetchCategoriesList, rowStart, ...rest } =
    useCategoriesList();
  const { data, ...dataProps } = state;

  const [openAddCategories, setOpenAddCategories] = useState(false);
  const [categoriesId, setCategoriesId] = useState(null);

  const handleClickOpenAddCategories = () => {
    setOpenAddCategories(true);
  };

  const handleCloseAddCategories = () => {
    setOpenAddCategories(false);
  };

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setCategoriesId(id);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => {
    setOpenEdit(true);
    handleCloseMenu();
  };

  const handleCloseEdit = () => setOpenEdit(false);

  return (
    <Box sx={{ pb: 2 }}>
      <Grid container>
        <Grid item sm={12} mr={1} mb={1} mt={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography ml={2} mt={1} variant="subtitle2">
              <Translate>help_center.categories.add_button</Translate>
            </Typography>
            <Ternary
              when={status.add}
              then={
                <Button
                  variant="contained"
                  startIcon={<Iconify icon={"eva:plus-fill"} />}
                  onClick={handleClickOpenAddCategories}
                  name="category"
                  size="small"
                >
                  <Translate>help_center.categories.add_button</Translate>
                </Button>
              }
            />
          </Box>
        </Grid>
      </Grid>
      <Card>
        <Scrollbar>
          <DataHandlerTable
            name="category-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(categories, i) => (
                <DataList
                  disableAction={!(status.edit || status.delete)}
                  handleOpenMenu={handleOpenMenu}
                  categories={categories}
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
          status={status}
          openEdit={handleOpenEdit}
          categoriesId={categoriesId}
          fetchCategoriesList={fetchCategoriesList}
          close={handleCloseMenu}
        />
      </TableMenu>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAddCategories}
        onClose={handleCloseAddCategories}
        aria-labelledby="add-categories"
        TransitionComponent={Transition}
      >
        <AddForm
          onClose={handleCloseAddCategories}
          reload={fetchCategoriesList}
        />
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="add-categories"
        TransitionComponent={Transition}
      >
        <EditForm
          selectedId={categoriesId}
          onClose={handleCloseEdit}
          reload={fetchCategoriesList}
        />
      </Dialog>
    </Box>
  );
};

export default Index;
