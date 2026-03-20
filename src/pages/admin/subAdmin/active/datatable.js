import {
  Divider,
  IconButton,
  MenuItem,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import ParseDate from "src/components/date";
import Loop from "src/components/loop";
import Ternary from "src/components/ternary";
import TimeOutTable from "src/components/timout-table";
import useImpersonate from "src/hooks/useImpersonate";

import Translate from "src/components/translate";
import TableMenu from "src/pages/admin/settings/@shared/tableMenu.jsx";
import { PATH_DASHBOARD } from "src/routes/paths";
import BlockDialog from "./BlockDialog";
import DeleteDialog from "./DeleteDialog";
import EditDialog from "./EditDialog";

const headers = [
  "sub_admin.no",
  "sub_admin.name",
  "sub_admin.userName",
  "sub_admin.email",
  "sub_admin.user_group",
  "sub_admin.created",
  "sub_admin.action",
];

const DataTable = ({ data, fetchData, rowStart, timeout }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [userId, setUserId] = useState(null);
  const onImpersonate = useImpersonate(userId);
  const [openMenu, setOpenMenuActions] = useState(null);
  const [isBlocked, setIsBlocked] = useState(true);

  const handleOpenMenu = (id, blockedStatus, uid) => (event) => {
    setUserId(uid);
    setSelectedId(id);
    setIsBlocked(blockedStatus);
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setSelectedId(null);
    setOpenMenuActions(null);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => {
    setOpenDelete(false);
    handleCloseMenu();
  };

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => {
    setOpenEdit(false);
    handleCloseMenu();
  };

  const [openBlockUser, setOpenBlockUser] = useState(false);
  const handleOpenBlockUser = () => setOpenBlockUser(true);
  const handleCloseBlockUser = () => {
    setOpenBlockUser(false);
    handleCloseMenu();
  };

  const isNotEmpty = Boolean(data.length);

  return (
    <div>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <TimeOutTable
            headers={headers}
            isTimedOut={timeout}
            length={data.length}
          >
            <Ternary
              when={isNotEmpty}
              then={
                <Loop
                  list={data}
                  render={(row, i) => (
                    <TableRow key={row.id}>
                      <TableCell>{i + rowStart}</TableCell>
                      <TableCell>
                        {row.user?.user_profile?.first_name}
                      </TableCell>
                      <TableCell>{row.user.username}</TableCell>
                      <TableCell>{row.user.email}</TableCell>
                      <TableCell>{row.user_group.name}</TableCell>
                      <TableCell>
                        <ParseDate date={row.created_at} />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={handleOpenMenu(
                            row.id,
                            Boolean(row.active),
                            row.user_id
                          )}
                        >
                          <Iconify
                            icon={"eva:more-vertical-fill"}
                            width={20}
                            height={20}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )}
                />
              }
            />
          </TimeOutTable>
        </TableContainer>
      </Scrollbar>

      <TableMenu onClose={handleCloseMenu} open={openMenu}>
        <MenuItem sx={{ color: "default.main" }} onClick={onImpersonate}>
          <Iconify icon={"ant-design:user-switch-outlined"} />
          <Translate>{"sub_admin.impersonate"}</Translate>
        </MenuItem>
        <MenuItem sx={{ color: "default.main" }} onClick={handleOpenEdit}>
          <Iconify icon={"akar-icons:edit"} />
          <Translate> {"sub_admin.edit"}</Translate>
        </MenuItem>
        <MenuItem
          sx={{ color: "default.main" }}
          component={Link}
          to={`${PATH_DASHBOARD.members.member_profile}/${userId}`}
        >
          <Iconify icon={"ant-design:user-outlined"} />
          <Translate> {"sub_admin.profile"}</Translate>
        </MenuItem>
        <MenuItem sx={{ color: "warning.main" }} onClick={handleOpenBlockUser}>
          <Iconify icon={"akar-icons:block"} />
          {!isBlocked ? (
            <Translate>sub_admin.un_block_user</Translate>
          ) : (
            <Translate>sub_admin.block_user</Translate>
          )}
        </MenuItem>
        <Divider />
        <MenuItem sx={{ color: "error.main" }} onClick={handleOpenDelete}>
          <Iconify icon={"eva:trash-2-outline"} />
          <Translate> {"sub_admin.delete"}</Translate>
        </MenuItem>
      </TableMenu>

      <DeleteDialog
        fetchData={fetchData}
        open={openDelete}
        selectedId={selectedId}
        onClose={handleCloseDelete}
      />

      <EditDialog
        fetchData={fetchData}
        onClose={handleCloseEdit}
        open={openEdit}
        selectedId={selectedId}
      />

      <BlockDialog
        isBlocked={isBlocked}
        fetchData={fetchData}
        onClose={handleCloseBlockUser}
        open={openBlockUser}
        selectedId={selectedId}
      />
    </div>
  );
};

export default DataTable;
