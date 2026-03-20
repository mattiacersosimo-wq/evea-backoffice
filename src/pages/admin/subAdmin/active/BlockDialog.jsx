import { DialogContent } from "@material-ui/core";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const BlockDialog = ({ open, selectedId, onClose, fetchData, isBlocked }) => {
  const { palette } = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleBlock = async () => {
    const { status, data: responseData } = await axiosInstance.get(
      `/api/admin/block-sub-admin/${selectedId}`
    );

    if (status === 200) {
      enqueueSnackbar(responseData.message);
      onClose();
      fetchData();
      return;
    }
    enqueueSnackbar("Failed to Block admin", { variant: "error" });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="block-sub-admin"
      TransitionComponent={Transition}
    >
      <DialogTitle id="block-sub-admin">
        <Translate>
          {isBlocked
            ? "sub_admin.block_sub_admin"
            : "sub_admin.unblock_sub_admin"}
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
              <Translate>
                {isBlocked
                  ? "sub_admin.are_you_sure_block"
                  : "sub_admin.are_you_sure_unblock"}
              </Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: palette.warning.normal }}>
          <Translate>{"sub_admin.cancel"}</Translate>
        </Button>
        <Button onClick={handleBlock} variant="contained" color="warning">
          {!isBlocked ? (
            <Translate>sub_admin.un_block</Translate>
          ) : (
            <Translate>sub_admin.block</Translate>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockDialog;
