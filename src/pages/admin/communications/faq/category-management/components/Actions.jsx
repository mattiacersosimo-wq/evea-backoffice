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
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const Actions = ({
  categoryId,
  fetchCategoryList,
  close,
  openEdit,
  status,
  ...rest
}) => {
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const [openConfirmDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/faq-categories/${categoryId}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        fetchCategoryList(rest.page);
        close();
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
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
            name="category-delete"
          >
            <Iconify icon={"eva:trash-2-outline"} />
            <Translate>actions.delete</Translate>
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
          <Translate>faq.categories.delete.title</Translate>
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
                <Translate>faq.categories.delete.message</Translate>
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            name="category-cancel"
            sx={{ color: palette.error.main }}
          >
            <Translate>faq.categories.delete.cancel</Translate>
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            name="category-delete"
          >
            <Translate>faq.categories.delete.submit</Translate>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Actions;
