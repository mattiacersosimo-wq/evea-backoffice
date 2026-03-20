import { LoadingButton } from "@mui/lab";
import { Rating, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormProvider, RHFTextField } from "src/components/hook-form";

import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useNewCommentForm from "./hooks/useNewCommentForm";

const RootStyles = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

const CommentForm = ({ reload }) => {
  const { methods, onSubmit } = useNewCommentForm(reload);
  const {
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const rating = watch("rating");

  return (
    <RootStyles>
      <Typography variant="subtitle2" sx={{ mb: 3 }}>
        <Translate>blogs.view.add_comment.title</Translate>
      </Typography>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} alignItems="flex-end">
          <Rating
            value={rating}
            onChange={(_, newValue) => setValue("rating", newValue)}
          />

          <Ternary
            when={Boolean(errors?.rating)}
            then={
              <Typography variant="caption" color="error">
                <Translate>{errors?.rating?.message}</Translate>
              </Typography>
            }
          />

          <RHFTextField
            name="title"
            label="blogs.view.add_comment.comment_title"
          />
          <RHFTextField
            name="comment"
            label="global.comment"
            multiline
            rows={3}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={methods.formState.isSubmitting}
          >
            <Translate>blogs.view.add_comment.post</Translate>
          </LoadingButton>
        </Stack>
      </FormProvider>
    </RootStyles>
  );
};

export default CommentForm;
