import { Box, Button, Card, Dialog, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";

import Translate from "src/components/translate";
import { isMenuActive } from "src/utils/actionProtector";
import Actions from "./components/Actions";
import { AddForm, EditForm } from "./components/form";
import DataList from "./components/list/dataList";
import useCategories from "./hooks/useCategories";
import Transition from "src/utils/dialog-animation";

const headers = [
  "faq.categories.table.no",
  "faq.categories.table.name",
  "faq.categories.table.desc",
  "faq.categories.table.action",
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

  const [categoryId, setCategoryId] = useState([]);
  const [openMenu, setOpenMenuActions] = useState(null);
  const status = genStatus("nav.communication.title", "nav.communication.faqs");

  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setCategoryId(id);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [openFaq, setOpenFaq] = useState(false);
  const handleClickOpenFaq = () => {
    setOpenFaq(true);
  };

  const handleCloseFaq = () => {
    setOpenFaq(false);
  };

  const [openEdit, setOpenEdit] = useState(false);

  const handleOpenEdit = () => {
    setOpenEdit(true);
    handleCloseMenu();
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const { state, fetchCategoryList, rowStart, ...rest } = useCategories();
  const { data, ...dataProps } = state;

  return (
    <>
      <Card>
        <Grid container>
          <Grid item sm={12} mr={1} mb={1} mt={1}>
            <Ternary
              when={status.add}
              then={
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Iconify icon={"carbon:add"} />}
                    onClick={handleClickOpenFaq}
                    name="add-category"
                  >
                    <Translate>faq.categories.add</Translate>
                  </Button>
                </Box>
              }
            />
          </Grid>
        </Grid>

        <Scrollbar>
          <DataHandlerTable
            name="faq-category"
            headers={headers}
            dataProps={dataProps}
          >
            <Map
              list={data}
              render={(category, i) => (
                <DataList
                  disableAction={!(status.edit || status.delete)}
                  handleOpenMenu={handleOpenMenu}
                  category={category}
                  rowNumber={rowStart + i}
                />
              )}
            />
          </DataHandlerTable>
        </Scrollbar>

        <TableMenu onClose={handleCloseMenu} open={openMenu}>
          <Actions
            status={status}
            openEdit={handleOpenEdit}
            categoryId={categoryId}
            fetchCategoryList={fetchCategoryList}
            close={handleCloseMenu}
            {...rest}
          />
        </TableMenu>
      </Card>
      <Ternary
        when={!dataProps.isArrayEmpty}
        then={<PaginationButtons {...rest} />}
      />
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openFaq}
        onClose={handleCloseFaq}
        aria-labelledby="faqs-category"
        TransitionComponent={Transition}
      >
        <AddForm onClose={handleCloseFaq} reload={fetchCategoryList} />
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="faqs-category"
        TransitionComponent={Transition}
      >
        <EditForm
          editId={categoryId}
          onClose={handleCloseEdit}
          reload={fetchCategoryList}
          {...rest}
        />
      </Dialog>
    </>
  );
};

export default DataTable;
