import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
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
import fetchUser from "src/utils/fetchUser";
import * as Yup from "yup";

const RootStyle = styled("div")(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

const Form = ({ onClose, id, product_id, reload, ...other }) => {
  const { enqueueSnackbar } = useSnackbar();
  const ReviewSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    comment: Yup.string().required("Comment is required"),
    rating: Yup.number()
      .typeError("Please choose a rating")
      .required("Rating is required"),
  });

  const defaultValues = {
    product_id: "",
    title: "",
    comment: "",
    rating: "",
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
    const reqData = new FormData();
    Object.entries({ ...inputData, product_id }).forEach(([k, v]) =>
      reqData.append(k, v)
    );
    try {
      const { status, data } = await fetchUser.post("user-reviews", reqData);
      if (status === 200) {
        reload(product_id);
        enqueueSnackbar(data.message);
        reset();
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    onClose();
    reset();
  };

  return (
    <RootStyle {...other} id={id}>
      <Typography variant="subtitle1" gutterBottom>
        Add Review
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <div>
            <Stack
              direction="row"
              flexWrap="wrap"
              alignItems="center"
              spacing={1.5}
            >
              <Typography variant="body2">
                Your review about this product:
              </Typography>

              <Controller
                name="rating"
                control={control}
                render={({ field }) => {
                  return <Rating {...field} value={Number(field.value)} />;
                }}
              />
            </Stack>
            <Ternary
              when={!!errors.rating}
              then={
                <FormHelperText error>{errors.rating?.message}</FormHelperText>
              }
            />
          </div>

          <RHFTextField name="title" label="Title *" />
          <RHFTextField name="comment" label="Review *" multiline rows={3} />

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button
              color="inherit"
              variant="outlined"
              onClick={onCancel}
              name="cancel"
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              name="review"
            >
              Post review
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </RootStyle>
  );
};

Form.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.string,
};

export default Form;
