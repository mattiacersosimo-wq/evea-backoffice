import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Scrollbar from "src/components/Scrollbar";
import useUsersList from "src/components/UsersAutoComplete/hooks/useUsersList";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";
import useQueryParams from "src/hooks/useQueryParams";
import DataList from "src/pages/admin/members/holdingTank/components/dataList.js";
import { isMenuActive } from "src/utils/actionProtector";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";
import { object, string } from "yup";
import BlockDialog from "../../network/component/BlockDialog";
import useMembers from "../../network/component/hooks/useMembers";
import TurnOfMail from "../../network/component/turnOfMailDialog";
import Actions from "./Actions";
import Filter from "./filter";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const defaultValues = {
  start_date: null,
  end_date: null,
  user_id: null,
  active: null,
};
const schema = object().shape({
  start_date: string()
    .test("is-valid", "errors.date.valid_start.test", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.end_date === null) return true;
      return (
        moment(ctx.parent.end_date, "YYYY/MM/DD").diff(
          moment(v, "YYYY/MM/DD")
        ) > 0
      );
    })
    .test("is-valid", "errors.date.valid_date.test", (v) => {
      if (v === null) return true;
      return moment(v, "YYYY/MM/DD").isValid();
    })
    .transform((v) => serializeDate(v))
    .nullable(),
  end_date: string()
    .test("is-valid", "errors.date.valid_end.test", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.start_date === null) return true;
      return (
        moment(ctx.parent.start_date, "YYYY/MM/DD").diff(
          moment(v, "YYYY/MM/DD")
        ) < 0
      );
    })
    .test("is-valid", "errors.date.valid_date.test", (v) => {
      if (v === null) return true;
      return moment(v, "YYYY/MM/DD").isValid();
    })
    .transform((v) => serializeDate(v))
    .nullable(),
});

const headers = [
  "holding_tank.no",
  "holding_tank.userName",
  "holding_tank.email",
  "holding_tank.paidActive",
  "holding_tank.joinedAt",
  "holding_tank.add_to_binary",
  "holding_tank.action",
];

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add"),
  };
};
const DataTable = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [tankId, setTank] = useState(null);
  const usersList = useUsersList("network");

  const [userId, setUserId] = useState(null);
  const [impersonationId, setImpersonationId] = useState(null);
  const [mailTurnedOn, setMailTurnedOn] = useState(false);
  const [openMenu, setOpenMenuActions] = useState(null);
  const [openTunOfMail, setOpenTurnOfMail] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [errorText, setErrorText] = useState("");

  const selectedUser = useMemo(() => {
    if (userId) {
      return usersList.find(({ user_id }) => user_id === userId);
    }
    return null;
  }, [userId]);

  const status = genStatus("nav.members.title", "nav.members.holding");

  const handleOpenMenu = (id, user_id, isMailTurnedOn, active) => (event) => {
    setIsBlocked(active);
    setOpenMenuActions(event.currentTarget);
    setTank(id);
    setSelectedId(user_id);
    setImpersonationId(user_id);
    setMailTurnedOn(Boolean(isMailTurnedOn));
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleOpenToggleMail = () => {
    setOpenTurnOfMail(true);
    handleCloseMenu();
  };

  const handleCloseToggleMail = () => {
    setOpenTurnOfMail(false);
  };

  const [openBlock, setOpenBlock] = useState(false);
  const handleOpenBlock = () => setOpenBlock(true);
  const handleCloseBlock = () => {
    setOpenBlock(false);
    handleCloseMenu();
  };

  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });
  const filter = methods.watch();

  const {
    state,
    fetchMemberList: fetchHoldingTankList,
    membersList: holdingTankList,
    rowStart,
    ...rest
  } = useMembers("holding-tank", filter);

  const { data, ...dataProps } = state;

  const [addingToBinary, setAddingToBinary] = useState(false);
  const addToBinary = (id) => async () => {
    setAddingToBinary(true);
    const reqData = new FormData();
    reqData.append("user_id", userId);
    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/add-to-binary/${id}`,
        reqData
      );
      if (status === 200) {
        setAddingToBinary(false);
        fetchHoldingTankList(rest.page);
        enqueueSnackbar(data.message);
        handleClose();
        setUserId(null);
      }
    } catch (err) {
      setUserId(null);
      setAddingToBinary(false);
      console.error(err);
      setErrorText("username is required");
    }
  };

  const onFilter = methods.handleSubmit((inputData) => {
    fetchHoldingTankList(1, inputData);
  });

  // modal
  const { queryObject, deleteParam, addParam } = useQueryParams();
  const { team_id } = queryObject;

  const open = Boolean(team_id);
  const handleClickOpen = (id) => () => {
    addParam("team_id", id);
    setTank(id);
  };

  const handleClose = () => {
    deleteParam("team_id");
  };

  return (
    <>
      <Card>
        <Filter methods={methods} onFilter={onFilter} />

        <Scrollbar>
          <DataHandlerTable
            name="holding-tank"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(holdingtank, i) => (
                <DataList
                  status={status}
                  handleOpenMenu={handleOpenMenu}
                  handleClickOpen={handleClickOpen}
                  holdingtank={holdingtank}
                  rowNumber={rowStart + i}
                />
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
      </Card>
      <TableMenu onClose={handleCloseMenu} open={openMenu}>
        <Actions
          isMailTurnedOn={mailTurnedOn}
          impersonationId={impersonationId}
          tankId={tankId}
          fetchHoldingTankList={() => fetchHoldingTankList(rest.page)}
          close={handleCloseMenu}
          openToggleMail={handleOpenToggleMail}
          openBlock={handleOpenBlock}
          isBlocked={isBlocked}
        />
      </TableMenu>

      <Ternary
        when={!dataProps.isArrayEmpty}
        then={<PaginationButtons {...rest} />}
      />

      <BlockDialog
        isHoldingTank
        isBlocked={isBlocked}
        onClose={handleCloseBlock}
        open={openBlock}
        selectedId={selectedId}
        fetchData={() => fetchHoldingTankList(rest.page)}
      />

      <TurnOfMail
        fetchData={() => fetchHoldingTankList(rest.page)}
        isMailTurnedOn={mailTurnedOn}
        selectedId={impersonationId}
        onClose={handleCloseToggleMail}
        open={openTunOfMail}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Translate>holding_tank.add_to_network</Translate>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                marginTop: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                },
              }}
            >
              <Box>
                <Autocomplete
                  onChange={(_, v) => {
                    if (v) {
                      const { user_id } = v;
                      setUserId(user_id);
                    } else {
                      setUserId(null);
                    }
                  }}
                  value={selectedUser}
                  options={usersList}
                  getOptionLabel={(option) => option.username}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="user_name"
                      id="outlined-basic"
                      label="Enter Username"
                      variant="outlined"
                      size="small"
                      helperText={
                        <Typography variant="caption" color="error">
                          {errorText}
                        </Typography>
                      }
                    />
                  )}
                />
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button name="close" onClick={handleClose} color="error">
            <Translate>holding_tank.close</Translate>
          </Button>
          <LoadingButton
            loading={addingToBinary}
            variant="contained"
            name="confirm"
            onClick={addToBinary(team_id)}
          >
            <Translate>holding_tank.add</Translate>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DataTable;
