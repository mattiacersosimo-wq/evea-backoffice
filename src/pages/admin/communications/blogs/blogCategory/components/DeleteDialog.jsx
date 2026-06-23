import { DialogContent } from "@material-ui/core";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useState } from "react";
import Translate from "src/components/translate";
import useQueryParams from "src/hooks/useQueryParams";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const DeleteDialog = ({ fetchData, onClose }) => {
  const theme = useTheme();
  const { queryObject } = useQueryParams();

  const { selected_id: selectedId, open } = queryObject;

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const data = new FormData();
    data.append("_method", "DELETE");

    try {
      const { status, data: responseData } = await axiosInstance.post(
        `/api/admin/blog-categories/${selectedId}`,
        data
      );

      if (status === 200) {
        fetchData();
        enqueueSnackbar(responseData.message);
        onClose();
      }
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    }
  };
  const { palette } = useTheme();

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open === "delete"}
      onClose={onClose}
      aria-labelledby="delete-blog-category"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-blog-category">
        <Translate>blogs.categories.delete.title</Translate>
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
              <Translate>blogs.categories.delete.message</Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ color: palette.error.main }}
          name="close"
        >
          <Translate>blogs.categories.delete.close</Translate>
        </Button>

        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          name="delete"
        >
          <Translate>blogs.categories.delete.submit</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
