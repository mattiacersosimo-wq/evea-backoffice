import useAddProductCategory from "../hooks/useAddProductCategory";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import useEditProductCategories from "../hooks/useEditProductCategories";
import { useTranslation } from "react-i18next";

const Form = ({ methods, onSubmit, onClose, label }) => {
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle id="category">{t(label)}</DialogTitle>
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
            <RHFTextField
              name="name"
              type="text"
              label="products.category.category_name"
            />
            <RHFSelect name="active" label="products.category.status">
              <option value={1}>{t("products.category.enabled")}</option>
              <option value={0}>{t("products.category.disabled")}</option>
            </RHFSelect>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          autoFocus
          color="error"
          variant="outlined"
          name="close"
        >
          {t("products.category.close")}
        </Button>
        <LoadingButton
          loading={methods.formState.isSubmitting}
          type="submit"
          variant="contained"
          name="submit"
        >
          {t("products.category.submit")}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export const AddForm = ({ onClose, refresh }) => {
  const { methods, onSubmit } = useAddProductCategory(() => {
    refresh();
    onClose();
  });
  return (
    <Form
      methods={methods}
      onSubmit={onSubmit}
      onClose={onClose}
      label="products.category.add_category"
    />
  );
};

export const EditForm = ({ id, onClose, refresh }) => {
  const { methods, onSubmit } = useEditProductCategories(id, () => {
    refresh();
    onClose();
  });
  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label="products.category.edit_cat"
    />
  );
};
