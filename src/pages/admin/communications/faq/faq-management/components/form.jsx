import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { RHFEditor } from "src/components/hook-form";

import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import { useTranslation } from "react-i18next";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useCategoryList from "../hooks/useCategoryList";
import useFaqAdd from "../hooks/useFaqAdd";
import useFaqEdit from "../hooks/useFaqEdit";
import LabelStyle from "src/components/label-style";

const Form = ({ methods, onSubmit, cancel, isEdit = false }) => {
  const categoryList = useCategoryList();
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle id="add-faqs">
        <Ternary
          when={isEdit}
          then={<Translate>faq.faqs.form.edit_title</Translate>}
          otherwise={<Translate>faq.faqs.form.add_title</Translate>}
        />
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
            <RHFSelect name="category_id" label="faq.faqs.form.category">
              <option value="" />
              {categoryList}
            </RHFSelect>

            <RHFTextField
              multiline
              fullWidth
              rows={3}
              placeholder={t("faq.faqs.form.questions")}
              label={t("faq.faqs.form.questions")}
              name="question"
            />
            <LabelStyle>
              <Translate>faq.faqs.form.answer</Translate>
            </LabelStyle>
            <RHFEditor
              simple
              placeholder={t("faq.faqs.form.answer")}
              name="answer"
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel} autoFocus color="error" name="faq-close">
          <Translate>faq.faqs.form.cancel</Translate>
        </Button>
        <LoadingButton
          loading={methods.formState.isSubmitting}
          type="submit"
          variant="contained"
          name="faq-submit"
        >
          <Ternary
            when={isEdit}
            then={<Translate>faq.faqs.form.update</Translate>}
            otherwise={<Translate>faq.faqs.form.add</Translate>}
          />
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export const AddFaqForm = ({ cancel, fetchFaqList }) => {
  const add = useFaqAdd(() => {
    fetchFaqList();
    cancel();
  });

  return <Form {...add} cancel={cancel} />;
};

export const EditFaqForm = ({ cancel, fetchFaqList, selectedId, ...rest }) => {
  const add = useFaqEdit(selectedId, () => {
    fetchFaqList(rest.page);
    cancel();
  });

  return <Form {...add} cancel={cancel} isEdit />;
};

export default Form;
