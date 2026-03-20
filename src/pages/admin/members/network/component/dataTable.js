import { Card, Divider } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";
import DataList from "src/pages/admin/members/network/component/dataList.js";
import BlockDialog from "./BlockDialog";
import Actions from "./actions";
import DataFilter from "./data-filter";
import EditUserNameDialog from "./editUserNameDialog";
import useMembers from "./hooks/useMembers";
import TurnOfMail from "./turnOfMailDialog";
import UpdatePasswordDialog from "./updatePasswordDialog";
import VerifyMail from "./verifyMail";
import UserDatesDialog from "./userDatesDialog";

const defaultValues = {
  user_id: null,
  email: null,
  rank_id: null,
  active: null,
};

const headers = [
  "network_members.no",
  "network_members.username",
  "network_members.email",
  "network_members.unique_id",
  "network_members.rank",
  "network_members.usertype",
  "network_members.smart_ship_status",
  "network_members.paidActive",
  "network_members.engagedstatus",
  "network_members.createdAt",
  "",
  "network_members.action",
];

const DataTable = () => {
  const methods = useForm({ defaultValues });
  const filter = methods.watch();

  const { state, fetchMemberList, membersList, rowStart, ...rest } = useMembers(
    "network",
    filter,
  );

  const { data, ...dataProps } = state;
  const [openMenu, setOpenMenuActions] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isMailTurnedOn, setIsMailTurnedOn] = useState(false);
  const [isMailVerified, setIsMailVerified] = useState(false);

  const handleOpenMenu =
    (id, blockedStatus, isMailTurnedOn, mailVerified) => (event) => {
      setIsBlocked(blockedStatus);
      setOpenMenuActions(event.currentTarget);
      setSelectedId(id);
      setIsMailTurnedOn(isMailTurnedOn);
      setIsMailVerified(mailVerified);
    };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [openChangePassword, setOpenChangePassword] = useState(false);

  const handleClickOpenChangePassword = () => {
    setUserName(getUserName());
    setOpenChangePassword(true);
    handleCloseMenu();
  };
  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
    setUserName(null);
  };

  const [username, setUserName] = useState(null);
  const getUserName = () =>
    membersList.find((member) => member.id === selectedId).username;

  const [openChangeUsername, setOpenChangeUsername] = useState(false);

  const [openUserDates, setOpenUserDates] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleOpenUserDates = (id) => () => {
    setSelectedUserId(id);
    setOpenUserDates(true);
  };

  const handleCloseUserDates = () => {
    setOpenUserDates(false);
    setSelectedUserId(null);
  };

  const handleClickOpenChangeUsername = () => {
    setUserName(getUserName());
    setOpenChangeUsername(true);
    handleCloseMenu();
  };
  const handleCloseChangeUsername = () => {
    setOpenChangeUsername(false);
    setUserName(null);
  };

  const [openBlock, setOpenBlock] = useState(false);
  const handleOpenBlock = () => setOpenBlock(true);
  const handleCloseBlock = () => {
    setOpenBlock(false);
    handleCloseMenu();
  };

  const [openTurnOnMail, setOpenTurnOnMail] = useState(false);

  const handleOpenTurnOnMail = () => {
    setOpenTurnOnMail(true);
    handleCloseMenu();
  };

  const handleCloseTurnOnMail = () => {
    setOpenTurnOnMail(false);
  };

  const [openVerify, setOpenVerify] = useState(false);
  const handleOpenVerify = () => {
    setOpenVerify(true);
    handleCloseMenu();
  };

  const handleCloseVerify = () => {
    setOpenVerify(false);
  };
  const onFilter = methods.handleSubmit((inputData) => {
    fetchMemberList(1, inputData);
  });
  return (
    <>
      <Card>
        <DataFilter methods={methods} onFilter={onFilter} />

        <Scrollbar>
          <DataHandlerTable
            name="network-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(network, i) => (
                <DataList
                  handleOpenMenu={handleOpenMenu}
                  network={network}
                  rowNumber={rowStart + i}
                  onOpenChangeDates={handleOpenUserDates}
                />
              )}
            />
          </DataHandlerTable>
        </Scrollbar>

        <Divider />
      </Card>

      <TableMenu onClose={handleCloseMenu} open={openMenu}>
        <Actions
          isMailVerified={isMailVerified}
          handleOpenVerify={handleOpenVerify}
          handleOpenTurnOnMail={handleOpenTurnOnMail}
          isMailTurnedOn={isMailTurnedOn}
          isBlocked={isBlocked}
          openChangePassword={handleClickOpenChangePassword}
          openChangeUsername={handleClickOpenChangeUsername}
          openBlock={handleOpenBlock}
          selectedId={selectedId}
        />
      </TableMenu>

      <BlockDialog
        isBlocked={isBlocked}
        onClose={handleCloseBlock}
        open={openBlock}
        selectedId={selectedId}
        fetchData={() => fetchMemberList(rest.page)}
      />

      <TurnOfMail
        isMailTurnedOn={isMailTurnedOn}
        onClose={handleCloseTurnOnMail}
        open={openTurnOnMail}
        selectedId={selectedId}
        fetchData={() => fetchMemberList(rest.page)}
      />

      <VerifyMail
        fetchData={() => fetchMemberList(rest.page)}
        onClose={handleCloseVerify}
        open={openVerify}
        selectedId={selectedId}
      />
      <UpdatePasswordDialog
        open={openChangePassword}
        username={username}
        fetchData={() => fetchMemberList(rest.page)}
        onClose={handleCloseChangePassword}
      />
      <EditUserNameDialog
        open={openChangeUsername}
        onClose={handleCloseChangeUsername}
        username={username}
        fetchData={() => fetchMemberList(rest.page)}
      />
      <UserDatesDialog
        open={openUserDates}
        onClose={handleCloseUserDates}
        selectedId={selectedUserId}
        reload={() => fetchMemberList(rest.page || 1)}
      />
      <Ternary
        when={!dataProps.isArrayEmpty}
        then={<PaginationButtons {...rest} />}
      />
    </>
  );
};

export default DataTable;
