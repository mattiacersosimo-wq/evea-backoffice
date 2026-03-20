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
  const { enqueueSnackbar } = useSnackbar();
  const ReviewSchema = Yup.object().shape({
    reason: Yup.string().required("Reason is required"),
  });

  const defaultValues = {
    reason: "",
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (inputData) => {
    console.log(inputData.reason);
    const reqData = new FormData();
    reqData.append("reason", inputData.reason);
    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/kyc-status/${selectedId}/rejected`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        fetchData();
        onClose();
        methods.reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-blog"
    >
      <DialogTitle id="delete-blog">{title} KYC</DialogTitle>
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

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} marginTop={3}>
            <RHFTextField
              name="reason"
              label={"global.reason"}
              multiline
              rows={3}
            />

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
                type="submit"
                variant="contained"
                loading={isSubmitting}
                name="review"
              >
                {title}
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ReasonForm;
