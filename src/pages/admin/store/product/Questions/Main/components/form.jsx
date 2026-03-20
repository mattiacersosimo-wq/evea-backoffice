import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { capitalCase } from "change-case";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import useAdd from "../hooks/useAdd";
import useEdit from "../hooks/useEdit";
import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";

const Form = ({ methods, onSubmit, onClose, label }) => {
  const {
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle id="add-question">{label}</DialogTitle>
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
            <RHFTextField name="title" label={"products.question.question"} />
            <RHFTextField
              name="description"
              label={"products.question.answer"}
              rows={3}
              multiline
              fullwidth
            />
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
          <Translate> {"products.question.close"}</Translate>
        </Button>
        <LoadingButton
          loading={isSubmitting}
          type="submit"
          variant="contained"
          name="submit"
        >
          <Translate>{"products.question.submit"}</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export default Form;

export const AddForm = ({ onClose, reload }) => {
  const { methods, onSubmit } = useAdd(() => {
    onClose();
    reload();
  });
  const { t } = useTranslation();
  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label={t("products.question.add_product_question")}
    />
  );
};

export const EditForm = ({ onClose, reload, selectedId }) => {
  const { methods, onSubmit } = useEdit(selectedId, () => {
    onClose();
    reload();
  });
  const { t } = useTranslation();
  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label={t("products.question.edit_product_questions")}
    />
  );
};
