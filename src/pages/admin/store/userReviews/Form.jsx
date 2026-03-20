import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  FormHelperText,
  Rating,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import useProductList from "src/components/ProductAutoComplete/hooks/useProductList";
import Translate from "src/components/translate";

const Form = ({ methods, onSubmit }) => {
  const { errors, isSubmitting } = methods.formState;
  const { control } = methods;
  const navigate = useNavigate();
  const productList = useProductList();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <div>
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="center"
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
            <FormHelperText error>{t(errors.rating?.message)}</FormHelperText>
          )}
        </div>

        <Autocomplete
          options={productList}
          getOptionLabel={(option) => option.name}
          onChange={(_, item) => methods.setValue("product_id", item.id)}
          renderInput={(params) => (
            <TextField
              error={Boolean(errors.product_id)}
              helperText={t(errors.product_id?.message)}
              label={t("user_review.products")}
              {...params}
            />
          )}
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
          <Button
            {...buttonProps}
            onClick={() => navigate(-1)}
            color="inherit"
            variant="outlined"
            name="back"
          >
            <Translate>user_review.back</Translate>
          </Button>
          <LoadingButton
            {...buttonProps}
            type="submit"
            variant="contained"
            loading={isSubmitting}
            name="submit"
          >
            <Translate>user_review.post_review</Translate>
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default Form;
