import { async } from "@firebase/util";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useState } from "react";
import PaginationButtons from "src/components/pagination";

import axiosInstance from "src/utils/axios";
import Actions from "../../../../../components/Actions";
import TableMenu from "../../../../../components/tableMenu";
import AddGuidance from "./AddGuidance";
import EditForm from "./EditForm";
import GuidanceTable from "./guidanceTable";
import useGetStartedList from "./hooks/useGetStartedList";
import Transition from "src/utils/dialog-animation";

const GetStarted = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();
  const { fetchGetStartedList, getStartedList, rowStart, ...rest } =
    useGetStartedList();

  const [selectedGuidanceId, setSelectedGuidanceId] = useState(null);
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setSelectedGuidanceId(id);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [openEditGuidance, setOpenEditGuidance] = useState(false);
  const handleOpenGuidance = () => {
    setOpenEditGuidance(true);
  };

  const handleCloseGuidance = () => {
    setOpenEditGuidance(false);
    handleCloseMenu();
  };

  const [openDeleteGuidance, setOpenDeleteGuidance] = useState(false);
  const handleOpenDeleteGuidance = () => setOpenDeleteGuidance(true);

  const handleCloseDeleteGuidance = () => {
    setOpenDeleteGuidance(false);
    handleCloseMenu();
  };

  const onDelete = async () => {
    const formData = new FormData();
    formData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/brand-user-guidances/${selectedGuidanceId}`,
        formData
      );
      if (status === 200) {
        fetchGetStartedList();
        enqueueSnackbar(data.message);
        handleCloseDeleteGuidance();
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return (
    <div>
      <AddGuidance fetchData={fetchGetStartedList} />
      <Divider sx={{ m: 3 }} />
      <GuidanceTable
        handleOpenMenu={handleOpenMenu}
        dataList={getStartedList}
        rowStart={rowStart}
      />

      <TableMenu onClose={handleCloseMenu} open={openMenu}>
        <Actions
          openEdit={handleOpenGuidance}
          openDelete={handleOpenDeleteGuidance}
        />
      </TableMenu>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openEditGuidance}
        onClose={handleCloseGuidance}
        aria-labelledby="edit-guidance"
        TransitionComponent={Transition}
      >
        <DialogTitle id="edit-guidance">
          {"adminSettings.brand.editGuidance"}
        </DialogTitle>
        <EditForm
          fetchData={fetchGetStartedList}
          selectedGuidanceId={selectedGuidanceId}
          handleClose={handleCloseGuidance}
        />
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDeleteGuidance}
        onClose={handleCloseDeleteGuidance}
        aria-labelledby="edit-guidance"
        TransitionComponent={Transition}
      >
        <DialogTitle id="edit-guidance">
          {"adminSettings.brand.editGuidance"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"adminSettings.brand.thisActionCannot"}
          </DialogContentText>

          <DialogActions>
            <Button
              onClick={handleCloseDeleteGuidance}
              color="error"
              name="cancel"
            >
              {"adminSettings.brand.cancel"}
            </Button>
            <Button onClick={onDelete} variant="contained" name="delete">
              {"adminSettings.brand.delete"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <PaginationButtons {...rest} />
    </div>
  );
};

export default GetStarted;
