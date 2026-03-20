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
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const Actions = ({ openEdit, faqId, fetchFaqList, close, status }) => {
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
        fetchFaqList();
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
        <DialogTitle>{"adminCommunication.faqs.deleteFaq"}</DialogTitle>
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
              <Typography>{"adminCommunication.faqs.areYouSure"}</Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            name="add-faq"
          >
            {"adminCommunication.faqs.delete"}
          </Button>
          <Button onClick={() => setOpenDialog(false)} name="faq-cancel">
            {"adminCommunication.faqs.cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Actions;
