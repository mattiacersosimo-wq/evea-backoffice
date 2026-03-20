import { Card, IconButton } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import PaginationButtons from "src/components/pagination";

import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import useGroupTable from "src/pages/admin/subAdmin/groups/components/groupTable/hooks/useGroupTable.js";
import Actions from "./actions";
import DeleteDialog from "./deleteDialog";

const headers = [
  "sub_admin.no",
  "sub_admin.name",
  "sub_admin.createdAt",
  "sub_admin.action",
];

const GroupTable = ({ reload }) => {
  const { state, groupList, fetchData, rowStart, ...rest } = useGroupTable();
  const [openMenu, setOpenMenu] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [openedDialog, setOpenedDialog] = useState(null);

  const toggleMenu = (id) => (e) => {
    if (id) setActiveId(id);
    setOpenMenu(openMenu ? null : e.currentTarget);
    setOpenedDialog(null);
  };

  const handleAction = (name = null) => {
    toggleMenu()();
    setOpenedDialog(name);
  };

  useEffect(() => {
    if (reload) {
      fetchData();
    }
  }, [reload]);

  const { data, ...dataProps } = state;

  return (
    <>
      <Card sx={{ py: 1 }}>
        <DataHandlerTable headers={headers} dataProps={dataProps}>
          <Map
            list={data}
            render={(row, i) => {
              return (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {rowStart + i}
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">
                    <ParseDate date={row.created_at} />
                  </TableCell>
                  <TableCell align="left">
                    <IconButton onClick={toggleMenu(row.id)}>
                      <Iconify icon="ic:outline-more-vert" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            }}
          />
        </DataHandlerTable>
      </Card>
      <PaginationButtons {...rest} />
      <Actions
        forwardRef={openMenu}
        onClose={handleAction}
        activeId={activeId}
      />

      <DeleteDialog
        fetchData={fetchData}
        name="delete"
        openedDialog={openedDialog}
        selectedId={activeId}
        onClose={() => setOpenedDialog(null)}
      />
    </>
  );
};

export default GroupTable;
