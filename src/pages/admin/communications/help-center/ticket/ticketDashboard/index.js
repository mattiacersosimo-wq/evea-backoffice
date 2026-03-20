import { Card, Typography } from "@mui/material";
import { capitalCase } from "change-case";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import DataHandlerTable from "src/components/data-handler/table";
import FilterBar from "src/components/filterBar";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/pages/admin/settings/brand/@shared/tableMenu";
import { isMenuActive } from "src/utils/actionProtector";
import Filter from "./components/Filter";
import Actions from "./components/actions";
import DeleteDialog from "./components/deleteDialog";
import DataList from "./components/list/dataList";
import StatusPopup from "./components/statusPopup";
import useStatusChange from "./hooks/useStatusChange";
import useTicketList from "./hooks/useTicketsList";
import Translate from "src/components/translate";

const defaultValues = {
  email: null,
  department_id: null,
  priority_id: null,
  status: null,
  ticket_number: null,
  overdue: null,
  category_id: null,
  from_user: null,
};

const headers = [
  "help_center.table.no",
  "help_center.table.tkt_no",
  "help_center.table.tkt_from",
  "help_center.table.date",
  "help_center.table.subject",
  "help_center.table.status",
  "help_center.table.priority",
  "help_center.table.department",
  "help_center.table.category",
  "help_center.table.action",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    impersonate: test("impersonate-ticket"),
    view: test("view-ticket"),
    edit: test("edit-ticket"),
    delete: test("delete-ticket"),
    updateStatus: test("update-ticket-status"),
  };
};
const Index = () => {
  const methods = useForm({ defaultValues });
  const permission = genStatus(
    "nav.communication.title",
    "nav.communication.help_center"
  );

  const filter = methods.watch();
  const { state, fetchTicketList, rowStart, ...rest } = useTicketList(filter);
  const { data, ...dataProps } = state;
  const onFilter = methods.handleSubmit((inputData) => {
    fetchTicketList(1, inputData);
  });
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState("");
  const handleToggle = (id) => (e) => {
    setSelectedId(id);

    setOpen((prevOpen) => !prevOpen);
    anchorRef.current = e.currentTarget;
  };

  const handleClose = (event) => {
    if (!(anchorRef.current && anchorRef.current.contains(event.target)))
      setOpen(false);
  };

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id, user_id, subject) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setSelectedId(id);
    setUserId(user_id);
    setStatus(subject);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
    handleCloseMenu();
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = () => {
    setOpenDelete(true);
    handleClose();
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const changeStatus = useStatusChange(selectedId, () => {
    fetchTicketList();
    setOpen(false);
  });

  const location = useLocation();
  const heading = location.pathname.slice(41, 55);
  const checkHeading = (heading) => {
    switch (heading) {
      case "open": {
        return "network.openTickets";
      }
      case "all": {
        return "help_center.side_bar.all";
      }
      case "overdue": {
        return "global.overdue";
      }
      case "resolved": {
        return "global.resolved";
      }
      case "closed": {
        return "network_members.closedTickets";
      }
      case "inprogress": {
        return "global.inProgress";
      }
      case "responded": {
        return "global.responded";
      }
    }
  };

  return (
    <>
      <FilterBar>
        <Filter methods={methods} onFilter={onFilter} />
      </FilterBar>
      <Card>
        <Typography variant="subtitle2" sx={{ m: 2 }}>
          <Translate>{checkHeading(heading)}</Translate>{" "}
        </Typography>

        <DataHandlerTable
          name="ticket-table"
          headers={headers}
          dataProps={dataProps}
        >
          <Map
            list={data}
            render={(ticket, i) => (
              <DataList
                disableAction={
                  !(
                    permission.edit ||
                    permission.delete ||
                    permission.view ||
                    permission.impersonate
                  )
                }
                showAdd={permission.view}
                enableUpdateStatus={permission.updateStatus}
                handleToggle={handleToggle}
                handleOpenMenu={handleOpenMenu}
                ticket={ticket}
                rowNumber={rowStart + i}
              />
            )}
          />
        </DataHandlerTable>
      </Card>

      <TableMenu open={openMenu} onClose={handleCloseMenu}>
        <Actions
          permission={permission}
          openEdit={handleOpenEdit}
          openDelete={handleOpenDelete}
          id={selectedId}
          userId={userId}
          status={status}
        />
      </TableMenu>

      <StatusPopup
        changeStatus={changeStatus}
        onClose={handleClose}
        open={open}
        ref={anchorRef}
      />

      <DeleteDialog
        fetchData={fetchTicketList}
        onClose={handleCloseDelete}
        open={openDelete}
        selectedId={selectedId}
        handleCloseMenu={handleCloseMenu}
      />

      <PaginationButtons {...rest} />
    </>
  );
};

export default Index;
