import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import fetchUser from "src/utils/fetchUser";
import * as Yup from "yup";

const RootStyle = styled("div")(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

const ReasonForm = ({ title, open, selectedId, onClose, fetchData }) => {
  console.log(selectedId);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState();
  const handleDelete = async () => {
    setLoading(true);

    const { status, data: responseData } = await axiosInstance.get(
      `/api/admin/pending-reject-payment/${selectedId}`
    );

    if (status === 200) {
      setLoading(false);
      enqueueSnackbar(responseData.message);
      onClose();
      fetchData();
      return;
    }
    enqueueSnackbar("Failed to delete the blog", { variant: "error" });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-blog"
    >
      <DialogTitle id="delete-blog">
        {title} <Translate>global.Order</Translate>
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
              <Translate>tools.videos.areYouSure</Translate>
            </Typography>
          </Box>
        </DialogContentText>

        <Stack spacing={3} marginTop={3}>
          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button
              variant="contained"
              color="error"
              onClick={onClose}
              name="cancel"
            >
              <Translate>tools.videos.close</Translate>
            </Button>
            <LoadingButton
              onClick={handleDelete}
              variant="contained"
              loading={loading}
              name="review"
            >
              {title}
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ReasonForm;
