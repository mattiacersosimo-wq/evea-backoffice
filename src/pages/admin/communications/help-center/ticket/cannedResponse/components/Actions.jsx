import { useTheme } from "@emotion/react";
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
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const Actions = ({ cannedId, fetchCannedList, close, openEdit, status }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirmDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/support-ticket-canned-responses/${cannedId}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        fetchCannedList();
        close();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const { palette } = useTheme();

  return (
    <>
      <Ternary
        when={status.edit}
        then={
          <MenuItem
            sx={{ color: "default.main" }}
            onClick={openEdit}
            name="edit"
          >
            <Iconify icon={"akar-icons:edit"} />
            <Translate>help_center.canned_response.actions.edit</Translate>
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
            <Translate>help_center.canned_response.actions.delete</Translate>
          </MenuItem>
        }
      />

      <Dialog
        maxWidth="sm"
        fullWidth
        open={openConfirmDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Translate>help_center.canned_response.dialog.delete.title</Translate>
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
                <Translate>
                  help_center.canned_response.dialog.delete.msg
                </Translate>
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            autoFocus
            sx={{ color: palette.warning.normal }}
            name="close"
          >
            <Translate>
              help_center.canned_response.dialog.delete.cancel
            </Translate>
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            name="delete"
          >
            <Translate>
              help_center.canned_response.dialog.delete.submit
            </Translate>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Actions;
