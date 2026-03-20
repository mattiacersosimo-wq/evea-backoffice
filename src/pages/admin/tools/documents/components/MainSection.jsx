import { Box, Button, Card, Divider, Grid, MenuItem } from "@mui/material";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";

import Translate from "src/components/translate";
import { isMenuActive } from "src/utils/actionProtector";
import useFetchDocuments from "../hooks/useFetchDocuments";
import DataList from "./dataList";
import DeleteDialog from "./deleteDialog";
import { AddDialog, EditDialog } from "./updateEditDialog";

const headers = [
  "tools.documents.no",
  "tools.documents.fileTitle",
  "tools.documents.sortOrder",
  "tools.documents.download",
  "tools.documents.created",
  "tools.documents.action",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add"),
    edit: test("edit"),
    remove: test("delete"),
  };
};

const MainSection = () => {
  const { state, documents, fetchDocuments, rowStart, ...rest } =
    useFetchDocuments();
  const { data, ...dataProps } = state;

  const [selectedId, setSelectedId] = useState(null);

  const [openMenu, setOpenMenuActions] = useState(false);
  const handleOpenMenu = (id) => (event) => {
    setSelectedId(id);
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(false);
  };

  const [openUpload, setOpenUpload] = useState(false);
  const handleOpenUpload = () => {
    setOpenUpload(true);
  };
  const handleCloseUpload = () => {
    setOpenUpload(false);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => {
    setOpenDelete(true);
    handleCloseMenu();
  };

  const handleCloseDelete = () => setOpenDelete(false);

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => {
    handleCloseMenu();
    setOpenEdit(true);
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const { add, edit, remove } = genStatus(
    "nav.tools.title",
    "nav.tools.documents"
  );

  return (
    <>
      <Card>
        <Grid container>
          <Grid item sm={12} mr={1.5} mb={1.5} mt={1.5}>
            <Ternary
              when={add}
              then={
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Iconify icon={"carbon:add"} />}
                    onClick={handleOpenUpload}
                    name="add"
                  >
                    <Translate>tools.documents.fileUpload</Translate>
                  </Button>
                </Box>
              }
            />
          </Grid>
        </Grid>

        <Scrollbar>
          <DataHandlerTable
            name="documents"
            headers={headers}
            dataProps={dataProps}
          >
            <Map
              list={data}
              render={(documents, i) => (
                <DataList
                  disabledActions={!(edit || remove)}
                  handleOpenMenu={handleOpenMenu}
                  documents={documents}
                  rowNumber={rowStart + i}
                />
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
        <Divider />
      </Card>

      <TableMenu open={openMenu} onClose={handleCloseMenu}>
        <Ternary
          when={edit}
          then={
            <MenuItem
              sx={{ color: "default.main" }}
              onClick={handleOpenEdit}
              name="edit"
            >
              <Iconify icon={"akar-icons:edit"} />
              <Translate>tools.documents.edit</Translate>
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
              <Translate>tools.documents.delete</Translate>
            </MenuItem>
          }
        />
      </TableMenu>

      <AddDialog
        open={openUpload}
        onClose={handleCloseUpload}
        reload={fetchDocuments}
      />

      <EditDialog
        open={openEdit}
        onClose={handleCloseEdit}
        reload={fetchDocuments}
        selectedId={selectedId}
      />

      <DeleteDialog
        open={openDelete}
        deleteId={selectedId}
        onClose={handleCloseDelete}
        reload={fetchDocuments}
      />

      <Ternary
        when={!dataProps.isArrayEmpty}
        then={<PaginationButtons {...rest} />}
      />
    </>
  );
};

export default MainSection;
