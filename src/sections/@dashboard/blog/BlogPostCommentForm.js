import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import fetchUser from "src/utils/fetchUser";
import * as Yup from "yup";

const RootStyles = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

const schema = Yup.object().shape({
  comment: Yup.string().required("Comment is required"),
  title: Yup.string().required("Title is required"),
  rating: Yup.number()
    .max(5, "The maximum possible rating is 5")
    .required("Email is required"),
});

const defaultValues = {
  comment: "",
  title: "",
  blog_id: "",
  rating: 5,
};

const BlogPostCommentForm = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );
    try {
      const { status, message } = await (
        await fetchUser.post("blog-review", reqData)
      ).data;
      if (status) {
        enqueueSnackbar(message);
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setValue("blog_id", id);
  }, [id]);

  return (
    <RootStyles>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Add Comment
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="title" label="Title" />
          <RHFTextField name="comment" label="Comment *" multiline rows={3} />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            name="post-comment"
          >
            Post comment
          </LoadingButton>
        </Stack>
      </FormProvider>
    </RootStyles>
  );
};

export default BlogPostCommentForm;
