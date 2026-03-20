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
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const Actions = ({ businessId, reload, close, openEdit }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirmDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/business-builder/${businessId}`,
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

  return (
    <>
      <MenuItem onClick={openEdit} sx={{ color: "default.main" }} name="edit">
        <Iconify icon={"akar-icons:edit"} />
        <Translate>{"settings.business_builder.edit"}</Translate>
      </MenuItem>

      <Divider />

      <MenuItem
        sx={{ color: "error.main" }}
        onClick={() => setOpenDialog(true)}
        name="delete"
      >
        <Iconify icon={"eva:trash-2-outline"} />
        <Translate> {"settings.business_builder.delete"}</Translate>
      </MenuItem>

      <Dialog
        maxWidth="sm"
        fullWidth
        open={openConfirmDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Translate>
            {" "}
            {"settings.business_builder.deleteBusinessBuilder"}
          </Translate>
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
                {" "}
                <Translate>{"settings.business_builder.areYouSure"}</Translate>
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} name="cancel">
            <Translate> {"settings.business_builder.cancel"}</Translate>
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            name="delete"
          >
            <Translate>{"settings.business_builder.delete"}</Translate>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Actions;
