import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import warning from "src/images/warning.png";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import axiosInstance from "src/utils/axios";

import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useQueryParams from "src/hooks/useQueryParams";
import Transition from "src/utils/dialog-animation";

const UpdateDialog = ({ fetchTicket }) => {
  const { queryObject, deleteParam } = useQueryParams();
  const { id } = useParams();
  const { palette } = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { update_to, name: statusName } = queryObject;

  const openDialog = Boolean(update_to);

  const updateStatus = async () => {
    const reqData = new FormData();
    reqData.append("_method", "PUT");
    reqData.append("status", update_to);
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/support-ticket-status-change/${id}`,
        reqData
      );
      if (status === 200) {
        onCloseDialogue();
        enqueueSnackbar(data.message);
        fetchTicket();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onCloseDialogue = () => {
    deleteParam("name", "update_to");
  };

  const { breakpoints } = useTheme();
  const u_sm = useMediaQuery(breakpoints.up("sm"));

  const { t } = useTranslation();

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={onCloseDialogue}
      aria-labelledby="delete-Subscription"
      TransitionComponent={Transition}
    >
      <DialogTitle
        id="delete-Subscription"
        sx={{ textAlign: "-webkit-center" }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">
            <Translate>help_center.view.dialog.update_status.title</Translate>
          </Typography>
          <IconButton onClick={onCloseDialogue}>
            <Iconify
              icon="ep:close-bold"
              sx={{ color: palette.warning.normal }}
            />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img src={warning} width="100px" />
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          width="100%"
        >
          <Ternary
            when={u_sm}
            then={
              <Button
                onClick={onCloseDialogue}
                sx={{ color: palette.warning.normal }}
              >
                <Translate>
                  help_center.view.dialog.update_status.cancel
                </Translate>
              </Button>
            }
          />
          <Button variant="contained" type="submit" onClick={updateStatus}>
            {t("help_center.view.dialog.update_status.submit", {
              status: statusName,
            })}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDialog;
