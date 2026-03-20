import {
  Box,
  Button,
  Card,
  Dialog,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
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
import usePriorities from "./hooks/usePriorities";
import Transition from "src/utils/dialog-animation";

const headers = [
  "help_center.priorities.table.no",
  "help_center.priorities.table.name",
  "help_center.priorities.table.desc",
  "help_center.priorities.table.color",
  "help_center.priorities.table.status",
  "help_center.priorities.table.actions",
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

  const [openAddPriority, setOpenAddPriority] = useState(false);
  const [priorityId, setPriorityId] = useState(null);

  const { state, fetchPriorities, priorities, rowStart, ...rest } =
    usePriorities();
  const { data, ...dataProps } = state;

  const handleClickOpenAddPriority = () => {
    setOpenAddPriority(true);
  };

  const handleCloseAddPriority = () => {
    setOpenAddPriority(false);
  };

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setPriorityId(id);
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
            <Typography sx={{ ml: 2, mt: 1 }} variant="subtitle2">
              <Translate>help_center.priorities.add_button</Translate>
            </Typography>

            <Ternary
              when={status.add}
              then={
                <Button
                  variant="contained"
                  startIcon={<Iconify icon={"eva:plus-fill"} />}
                  onClick={handleClickOpenAddPriority}
                  name="priority"
                  size="small"
                >
                  <Translate>help_center.priorities.add_button</Translate>
                </Button>
              }
            />
          </Box>
        </Grid>
      </Grid>
      <Card>
        <Scrollbar>
          <DataHandlerTable
            name="prioritys-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(prioritys, i) => (
                <DataList
                  disableAction={!(status.edit || status.delete)}
                  handleOpenMenu={handleOpenMenu}
                  prioritys={prioritys}
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
          priorityId={priorityId}
          fetchPriorityList={fetchPriorities}
          close={handleCloseMenu}
          openEdit={handleOpenEdit}
        />
      </TableMenu>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAddPriority}
        onClose={handleCloseAddPriority}
        aria-labelledby="add-priority"
        TransitionComponent={Transition}
      >
        <AddForm onClose={handleCloseAddPriority} refresh={fetchPriorities} />
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="add-priority"
        TransitionComponent={Transition}
      >
        <EditForm
          onClose={handleCloseEdit}
          refresh={fetchPriorities}
          editId={priorityId}
        />
      </Dialog>

      {/* <PaginationButtons {...rest} /> */}
    </Box>
  );
};

export default Index;
