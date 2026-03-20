import { LoadingButton } from "@mui/lab";
import {
  Button,
  FormHelperText,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import ProductAutoComplete from "src/components/ProductAutoComplete";
import Translate from "src/components/translate";

const EditForm = ({ methods, onSubmit, onClose }) => {
  const { errors, isSubmitting } = methods.formState;
  const { control } = methods;
  const navigate = useNavigate();

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <div>
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="center"
            spacing={1.5}
          >
            <Typography variant="body2">
              <Translate>user_review.your_review_about</Translate>
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
            <FormHelperText error>{errors.rating?.message}</FormHelperText>
          )}
        </div>

        <ProductAutoComplete
          onChange={(_, item) => methods.setValue("product_id", item.id)}
        />

        <RHFTextField name="username" label={"user_review.user_name"} />
        <RHFTextField name="title" label={"user_review.title"} />

        <RHFTextField
          name="comment"
          label={"user_review.review"}
          multiline
          rows={3}
        />

        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button onClick={onClose} color="inherit" variant="outlined">
            <Translate>user_review.back</Translate>
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            <Translate>user_review.post_review</Translate>
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default EditForm;
