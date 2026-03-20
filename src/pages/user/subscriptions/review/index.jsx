import { LoadingButton } from "@mui/lab";
import { FormHelperText, Rating, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Controller } from "react-hook-form";
import { FormProvider, RHFTextField } from "src/components/hook-form";

import Translate from "src/components/translate";
import useGetUserReviewById from "../../onlineStore/productSubscription/details/components/moreInfo/review/hooks/useGetUserReviewById";
import EditUserReview from "./EditUserReview";
import useReview from "./hooks/useReview";

const RootStyle = styled("div")(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

const ReviewForm = ({ ...other }) => {
  const { methods, onSubmit } = useReview();
  const { review } = useGetUserReviewById();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  return (
    <RootStyle {...other} id="move_add_review">
      <Typography variant="subtitle1" gutterBottom>
        <Translate>user.subscriptions.labels.review</Translate>
      </Typography>
      {review.status ? (
        <EditUserReview reviewId={review.data.id} />
      ) : (
        <>
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
                    {"userMySubscriptions.yourReview"}
                  </Typography>

                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Rating {...field} value={Number(field.value)} />
                    )}
                  />
                </Stack>
                {!!errors.rating && (
                  <FormHelperText error>
                    {" "}
                    {errors.rating?.message}
                  </FormHelperText>
                )}
              </div>
              <RHFTextField name="title" label={"userMySubscriptions.title"} />

              <RHFTextField
                name="comment"
                label={"userMySubscriptions.comment"}
                multiline
                rows={3}
              />

              <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  {"userMySubscriptions.postComment"}
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </>
      )}
    </RootStyle>
  );
};

export default ReviewForm;
