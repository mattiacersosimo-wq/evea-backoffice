import { useTheme } from "@emotion/react";
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
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const Actions = ({ categoryId, reload, close, openEdit }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirmDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/material-categories/${categoryId}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        reload();
        close();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const { t } = useTranslation();
  return (
    <>
      <MenuItem onClick={openEdit} sx={{ color: "default.main" }} name="edit">
        <Iconify icon={"akar-icons:edit"} />
        {t("assign_subscriptions.edit")}
      </MenuItem>

      <Divider />

      <MenuItem
        sx={{ color: "error.main" }}
        onClick={() => setOpenDialog(true)}
        name="delete"
      >
        <Iconify icon={"eva:trash-2-outline"} />
        {t("assign_subscriptions.delete")}
      </MenuItem>

      <Dialog
        maxWidth="sm"
        fullWidth
        open={openConfirmDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          {"adminStore.material.deleteMaterialCategory"}{" "}
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
              <Typography>{"adminStore.material.areYouSure"} </Typography>
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
            {"adminStore.material.delete"}
          </Button>
          <Button onClick={() => setOpenDialog(false)} name="cancel">
            {"adminStore.material.cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Actions;
