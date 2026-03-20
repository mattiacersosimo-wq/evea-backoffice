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
import Translate from "src/components/translate";
import { useTranslation } from "react-i18next";

const Form = ({ methods, onSubmit, onClose, label }) => {
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle id="add-business">{t(label)}</DialogTitle>
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
              label={"settings.business_builder.name"}
            />
            <RHFTextField
              onWheel={(e) => e.target.blur()}
              name="amount"
              label={"settings.business_builder.amount"}
              type="number"
            />
            <RHFTextField name="bv" label={"settings.business_builder.bv"} />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus color="error" name="close">
          <Translate>{"settings.business_builder.close"}</Translate>
        </Button>
        <LoadingButton type="submit" variant="contained" name="submit">
          <Translate> {"settings.business_builder.submit"}</Translate>
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
  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label={"settings.business_builder.addBusinessBuilder"}
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
      label={"settings.business_builder.editBusinessBuilder"}
    />
  );
};
