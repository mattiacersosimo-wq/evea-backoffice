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
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const Actions = ({ openEdit, faqId, fetchFaqList, close, status, ...rest }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirmDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/faq/${faqId}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        fetchFaqList(rest.page);
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
          <>
            <MenuItem
              onClick={openEdit}
              sx={{ color: "default.main" }}
              name="category-edit"
            >
              <Iconify icon={"akar-icons:edit"} />
              <Translate>actions.edit</Translate>
            </MenuItem>
            <Divider />
          </>
        }
      />

      <Ternary
        when={status.delete}
        then={
          <MenuItem
            sx={{ color: "error.main" }}
            onClick={() => setOpenDialog(true)}
            name="faq-delete"
          >
            <Iconify icon={"eva:trash-2-outline"} />
            <Translate>actions.delete</Translate>
          </MenuItem>
        }
      />

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Translate> {"global.deleteFaq"}</Translate>
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
                <Translate>{"tools.videos.areYouSure"}</Translate>
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            name="faq-cancel"
            sx={{ color: palette.error.main }}
          >
            <Translate>{"tools.videos.cancel"}</Translate>
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            name="add-faq"
          >
            <Translate>{"tools.videos.delete"}</Translate>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Actions;
