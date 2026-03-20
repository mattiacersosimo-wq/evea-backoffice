import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import {
  FormProvider,
  RHFEditor,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import Translate from "src/components/translate";
import useArticleAdd from "../hooks/useArticleAdd";
import useCategoryNames from "../hooks/useArticleCategoryNames";
import useEditArticle from "../hooks/useEditArticle";

const Form = ({ methods, onSubmit, onClose, submitButtonLabel }) => {
  const categoryNames = useCategoryNames();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
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
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <RHFTextField name="title" label="articles.articles.form.name" />
            <RHFSelect
              name="category_id"
              label="articles.articles.form.category"
            >
              <option value="" />
              {categoryNames?.map((item) => (
                <option value={item.id}>{item?.name}</option>
              ))}
            </RHFSelect>
          </Box>
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
            <RHFEditor
              simple
              name="description"
              placeholder="articles.articles.form.description"
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus color="error" name="article-close">
          <Translate>articles.articles.form.cancel</Translate>
        </Button>
        <LoadingButton type="submit" variant="contained" name="article-submit">
          <Translate>{submitButtonLabel}</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export const AddForm = ({ reload, onClose }) => {
  const add = useArticleAdd(() => {
    reload();
    onClose();
  });
  return (
    <Form
      {...add}
      onClose={onClose}
      submitButtonLabel="articles.articles.form.submit_add"
    />
  );
};

export const EditForm = ({ reload, onClose, selectedId }) => {
  const edit = useEditArticle(selectedId, () => {
    reload();
    onClose();
  });
  return (
    <Form
      {...edit}
      onClose={onClose}
      submitButtonLabel="articles.articles.form.submit_edit"
    />
  );
};
