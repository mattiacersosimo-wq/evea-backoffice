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

import { useTranslation } from "react-i18next";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useAddCategory from "../hooks/useAddCategory";
import useEditCategory from "../hooks/useEditCategory";

const Form = ({ onClose, methods, onSubmit, label, isEdit = false }) => {
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle id="faqs-category">
        <Translate>{label}</Translate>
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
            <RHFTextField name="name" label="faq.categories.form.name" />
            <RHFTextField
              fullwidth
              rows={3}
              multiline
              name="description"
              label="faq.categories.form.desc"
            />
            <RHFSelect name="active" label="faq.categories.form.status">
              <option value={1}>{t("status.enabled")}</option>
              <option value={0}>{t("status.disabled")}</option>
            </RHFSelect>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus color="error" name="faq-close">
          <Translate>faq.categories.form.cancel</Translate>
        </Button>
        <LoadingButton type="submit" variant="contained" name="faq-submit">
          <Ternary
            when={isEdit}
            then={<Translate>faq.categories.form.edit</Translate>}
            otherwise={<Translate>faq.categories.form.add</Translate>}
          />
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export const AddForm = ({ onClose, reload }) => {
  const { methods, onSubmit } = useAddCategory(() => {
    onClose();
    reload();
  });
  return (
    <Form
      label="faq.categories.dialog.add"
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
    />
  );
};

export const EditForm = ({ onClose, reload, editId, ...rest }) => {
  const { methods, onSubmit } = useEditCategory(editId, () => {
    onClose();
    reload(rest.page);
  });
  return (
    <Form
      label="faq.categories.dialog.edit"
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      isEdit
    />
  );
};
