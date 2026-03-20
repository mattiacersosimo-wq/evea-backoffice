import { LoadingButton } from "@mui/lab";
import { FormHelperText, Rating, Stack, Typography } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { FormProvider, RHFTextField } from "src/components/hook-form";

import Translate from "src/components/translate";
import useUpdateReview from "./hooks/useUpdateReview";

const EditUserReview = ({ reviewId }) => {
  const { methods, onSubmit } = useUpdateReview(reviewId);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;
  return (
    <div>
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
                <Translate>user.subscriptions.your_review</Translate>
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
              <FormHelperText error> {errors.rating?.message}</FormHelperText>
            )}
          </div>
          <RHFTextField name="title" label="global.title" />

          <RHFTextField
            name="comment"
            label="global.comment"
            multiline
            rows={3}
          />

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              <Translate>user.subscriptions.submit_review</Translate>
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </div>
  );
};

export default EditUserReview;
