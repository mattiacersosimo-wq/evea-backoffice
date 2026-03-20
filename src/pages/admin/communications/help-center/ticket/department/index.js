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
import useFetchDepartmentList from "./hooks/useFetchDepartmentList";
import Transition from "src/utils/dialog-animation";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add-department"),
    edit: test("edit-department"),
    delete: test("delete-department"),
  };
};

const headers = [
  "help_center.department.table.no",
  "help_center.department.table.name",
  "help_center.department.table.status",
  "help_center.department.table.desc",
  "help_center.department.table.actions",
];

const Index = () => {
  const [openAddDepartment, setOpenAddDepartment] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);

  const { state, fetchDepartmentList, rowStart, ...rest } =
    useFetchDepartmentList();

  const { data, ...dataProps } = state;

  const handleClickOpenAddDepartment = () => {
    setOpenAddDepartment(true);
  };

  const handleCloseAddDepartment = () => {
    setOpenAddDepartment(false);
  };

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setDepartmentId(id);
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
        <Grid item sm={12} mr={1} mb={1} mt={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle2" sx={{ mt: 1, ml: 2 }}>
              <Translate>help_center.department.add_button</Translate>
            </Typography>
            <Ternary
              when={status.add}
              then={
                <Button
                  variant="contained"
                  startIcon={<Iconify icon={"eva:plus-fill"} />}
                  onClick={handleClickOpenAddDepartment}
                  name="department"
                  size="small"
                >
                  <Translate>help_center.department.add_button</Translate>
                </Button>
              }
            />
          </Box>
        </Grid>
      </Grid>
      <Card>
        <Scrollbar>
          <DataHandlerTable
            name="department-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(department, i) => (
                <DataList
                  disableAction={!(status.edit || status.delete)}
                  handleOpenMenu={handleOpenMenu}
                  department={department}
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
          departmentId={departmentId}
          fetchDepartmentList={fetchDepartmentList}
          close={handleCloseMenu}
          openEdit={handleOpenEdit}
        />
      </TableMenu>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAddDepartment}
        onClose={handleCloseAddDepartment}
        aria-labelledby="create-article"
        TransitionComponent={Transition}
      >
        <AddForm
          onClose={handleCloseAddDepartment}
          reload={fetchDepartmentList}
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
        <EditForm
          editId={departmentId}
          onClose={handleCloseEdit}
          reload={fetchDepartmentList}
        />
      </Dialog>
    </Box>
  );
};

export default Index;
