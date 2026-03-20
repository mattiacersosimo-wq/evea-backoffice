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

import useAdd from "../hooks/useAdd";
import useEdit from "../hooks/useEdit";
import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";

const Form = ({ methods, onSubmit, onClose, label }) => {
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle id="add-category">{t(label)}</DialogTitle>
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
            <RHFTextField name="name" label={"material.category"} />
            <RHFTextField
              onWheel={(e) => e.target.blur()}
              name="sort_order"
              label={"tools.documents.sortOrders"}
              type="number"
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <LoadingButton type="submit" variant="contained" name="submit">
          <Translate>{"tools.documents.submit"}</Translate>
        </LoadingButton>
        <Button onClick={onClose} autoFocus color="error" name="close">
          <Translate> {"tools.documents.close"}</Translate>
        </Button>
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
  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label={"material.add_material.material_category"}
    />
  );
};

export const EditForm = ({ onClose, reload, selectedId }) => {
  const { methods, onSubmit } = useEdit(selectedId, () => {
    onClose();
    reload();
  });

  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label={"assign_subscriptions.edit_category"}
    />
  );
};
