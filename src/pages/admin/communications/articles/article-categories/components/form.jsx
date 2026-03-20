import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import useAddArticleCategory from "../hooks/useAddArticleCategory";

import {
  FormProvider,
  RHFEditor,
  RHFTextField,
} from "src/components/hook-form";

import Translate from "src/components/translate";
import useEditArticleCategory from "../hooks/useEditArticleCategory";

const Form = ({ methods, onSubmit, onClose, label, submitButtonLabel }) => {
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle id="add-article-category">
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
            <RHFTextField name="name" label="articles.categories.form.name" />
            <RHFTextField
              name="description"
              type="text"
              label="articles.categories.form.description"
              multiline
              fullWidth
              rows={4}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus color="error" name="article-close">
          <Translate>articles.categories.form.cancel</Translate>
        </Button>
        <LoadingButton type="submit" variant="contained" name="article-submit">
          <Translate>{submitButtonLabel}</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export const AddForm = ({ onClose, fetchData }) => {
  const { methods, onSubmit } = useAddArticleCategory(() => {
    fetchData();
    onClose();
  });

  return (
    <Form
      label="articles.categories.form.add_title"
      submitButtonLabel="articles.categories.form.submit_add"
      methods={methods}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export const EditForm = ({ onClose, fetchData, selectedId }) => {
  const { methods, onSubmit } = useEditArticleCategory(selectedId, () => {
    fetchData();
    onClose();
  });

  return (
    <Form
      label="articles.categories.form.edit_title"
      methods={methods}
      onClose={onClose}
      onSubmit={onSubmit}
      submitButtonLabel="articles.categories.form.submit_edit"
    />
  );
};
