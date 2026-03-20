import { DialogContent } from "@material-ui/core";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useParams } from "react-router";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const DeleteDialog = ({
  isSampleDocs,
  docId,
  onClose,
  fetchData = () => null,
}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { pid } = useParams();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    const type = isSampleDocs ? "product-sample-docs" : "product-docs";
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/${type}/${docId}`,
        reqData
      );

      if (status === 200) {
        setLoading(false);
        enqueueSnackbar(data.message);
        fetchData(pid);
        onClose();
        return;
      }
    } catch (err) {
      console.log(err);
      // enqueueSnackbar("Failed to delete the document", { variant: "error" });
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={Boolean(docId)}
      onClose={onClose}
      aria-labelledby="delete-video"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-video">
        <Translate> {"products.document.delete_document"}</Translate>
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
              <Translate> {"products.document.areYouSure"}</Translate>
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} name="cancel">
          <Translate> {"products.document.cancel"}</Translate>
        </Button>
        <LoadingButton
          loading={loading}
          onClick={handleDelete}
          variant="contained"
          color="error"
          name="delete"
        >
          <Translate> {"products.document.delete"}</Translate>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
