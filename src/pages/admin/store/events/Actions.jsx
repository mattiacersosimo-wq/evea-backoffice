import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const Actions = ({ eventId, fetchEventsList, close, status }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirmDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/events/${eventId}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        fetchEventsList();
        close();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Ternary
        when={status.edit}
        then={
          <MenuItem
            component={NavLink}
            to={`${PATH_DASHBOARD.store.events_edit}/${eventId}`}
            sx={{ color: "default.main" }}
            name="event"
          >
            <Iconify icon={"carbon:view"} />
            <Translate>events.add_event.edit</Translate>
          </MenuItem>
        }
      />

      <Ternary
        when={status.delete}
        then={
          <MenuItem
            sx={{ color: "error.main" }}
            onClick={() => setOpenDialog(true)}
            name="delete"
          >
            <Iconify icon={"eva:trash-2-outline"} />
            <Translate>events.add_event.delete</Translate>
          </MenuItem>
        }
      />

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Translate>events.delete</Translate>
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
              <Typography>
                <Translate>events.are_you_sure</Translate>
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            name="delete"
          >
            <Translate>events.add_event.delete</Translate>
          </Button>
          <Button onClick={() => setOpenDialog(false)} name="cancel">
            <Translate>events.add_event.cancel</Translate>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Actions;
