import { Box, Button, Card, Dialog, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
import useCannedResponseList from "./hooks/useCannedRespnoseList";
import Transition from "src/utils/dialog-animation";

const headers = [
  "help_center.canned_response.table.no",
  "help_center.canned_response.table.name",
  "help_center.canned_response.table.subject",
  "help_center.canned_response.table.actions",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add-canned"),
    edit: test("edit-canned"),
    delete: test("delete-canned"),
  };
};

const Index = () => {
  const theme = useTheme();
  const [openAddCanned, setOpenAddCanned] = useState(false);
  const [cannedId, setCannedId] = useState(null);

  const { state, cannedList, fetchCannedList, rowStart, ...rest } =
    useCannedResponseList();
  const { data, ...dataProps } = state;

  const handleClickOpenAddCannedResponse = () => {
    setOpenAddCanned(true);
  };

  const handleCloseAddCanned = () => {
    setOpenAddCanned(false);
  };

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setCannedId(id);
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
  const status = genStatus(
    "nav.communication.title",
    "nav.communication.help_center"
  );

  return (
    <Box sx={{ pb: 2 }}>
      <Grid container>
        <Grid item sm={12} mb={1} mt={1} mr={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography ml={2} mt={1} variant="subtitle2">
              <Translate>help_center.canned_response.add_button</Translate>
            </Typography>

            <Ternary
              when={status.add}
              then={
                <Button
                  variant="contained"
                  startIcon={<Iconify icon={"eva:plus-fill"} />}
                  onClick={handleClickOpenAddCannedResponse}
                  name="canned-response"
                  size="small"
                >
                  <Translate>help_center.canned_response.add_button</Translate>
                </Button>
              }
            />
          </Box>
        </Grid>
      </Grid>
      <Card>
        <Scrollbar>
          <DataHandlerTable
            name="canned-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(canned, i) => (
                <DataList
                  disableAction={!(status.edit || status.delete)}
                  handleOpenMenu={handleOpenMenu}
                  canned={canned}
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
          cannedId={cannedId}
          fetchCannedList={fetchCannedList}
          close={handleCloseMenu}
        />
      </TableMenu>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAddCanned}
        onClose={handleCloseAddCanned}
        aria-labelledby="add-categories"
        TransitionComponent={Transition}
      >
        <AddForm onClose={handleCloseAddCanned} reload={fetchCannedList} />
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
          selectedId={cannedId}
          onClose={handleCloseEdit}
          reload={fetchCannedList}
        />
      </Dialog>
      {/* <PaginationButtons {...rest} /> */}
    </Box>
  );
};

export default Index;
