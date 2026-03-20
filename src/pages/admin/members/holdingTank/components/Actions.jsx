import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  MenuItem,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import useImpersonate from "src/hooks/useImpersonate";

import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const Actions = ({
  tankId,
  fetchHoldingTankList,
  close,
  impersonationId,
  isMailTurnedOn,
  openToggleMail,
  openBlock,
  isBlocked,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirmDialog, setOpenDialog] = useState(false);
  const onImpersonate = useImpersonate(impersonationId);
  const handleDelete = async () => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/holding-tank/${tankId}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        fetchHoldingTankList();
        close();
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <MenuItem
        onClick={onImpersonate}
        sx={{ color: "default.main" }}
        name="impersonation"
      >
        <Iconify icon={"ant-design:user-switch-outlined"} />
        <Translate>{"holding_tank.impersonation"}</Translate>
      </MenuItem>
      <MenuItem
        component={Link}
        to={`${PATH_DASHBOARD.members.member_profile}/${impersonationId}`}
        sx={{ color: "default.main" }}
        name="profile"
      >
        <Iconify icon={"ant-design:user-outlined"} />
        <Translate>{"holding_tank.profile"}</Translate>
      </MenuItem>

      <MenuItem
        sx={{ color: "default.main" }}
        onClick={openToggleMail}
        name="notification"
      >
        <Iconify icon={"carbon:notification-off"} />
        {isMailTurnedOn
          ? t("holding_tank.turn_off_email")
          : t("holding_tank.turn_on_email")}
      </MenuItem>
      <MenuItem sx={{ color: "warning.main" }} onClick={openBlock}>
        <Iconify icon={"ic:outline-block"} />
        <Translate>holding_tank.permissions</Translate>
      </MenuItem>

      <Divider />
      <MenuItem
        sx={{ color: "error.main" }}
        onClick={() => setOpenDialog(true)}
        name="delete"
      >
        <Iconify icon={"eva:trash-2-outline"} />
        <Translate>{"holding_tank.delete"}</Translate>
      </MenuItem>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Translate> {"holding_tank.delete_holding_tank"}</Translate>
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
                <Translate> {"holding_tank.are_you_sure"}</Translate>
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} name="cancel">
            <Translate>{"holding_tank.cancel"}</Translate>
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            name="delete"
          >
            <Translate> {"holding_tank.delete"}</Translate>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Actions;
