import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import useAddDepartmentTicket from "../hooks/useAddDepartmentTicket";
import useEditDepartmentTicket from "../hooks/useEditDepartmentTicket";

const Form = ({ onClose, methods, onSubmit, label, submitButtonLabel }) => {
  const { palette } = useTheme();
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle
        id="create-article"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="span" sx={{ color: "#444" }}>
          <Translate>{label}</Translate>
        </Typography>
        <IconButton aria-label="close" onClick={onClose}>
          <Iconify icon="ic:baseline-close" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Box
            sx={{
              display: "grid",
              rowGap: 2,
              columnGap: 2,
              marginTop: 1,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
              },
            }}
          >
            <RHFTextField
              size="small"
              name="name"
              label="help_center.department.dialog.edit.name"
            />
            <Box name="description">
              <RHFTextField
                size="small"
                rows={3}
                fullwidth
                multiline
                name="description"
                label="help_center.department.dialog.edit.desc"
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              rowGap: 2,
              columnGap: 2,
              marginTop: 2,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <RHFSelect
              size="small"
              name="active"
              label="help_center.department.dialog.edit.status"
            >
              <option value="" />
              <option value="1">{t("status.enabled")}</option>
              <option value="0">{t("status.disabled")}</option>
            </RHFSelect>

            <RHFTextField
              size="small"
              type="number"
              name="sort_order"
              label="help_center.department.dialog.edit.sort_order"
              onWheel={(e) => e.target.blur()}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          autoFocus
          sx={{ color: palette.warning.normal }}
        >
          <Translate>help_center.department.dialog.edit.cancel</Translate>
        </Button>
        <LoadingButton
          loading={methods.formState.isSubmitting}
          type="submit"
          variant="contained"
        >
          <Translate>{submitButtonLabel}</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export const AddForm = ({ onClose, reload }) => {
  const { methods, onSubmit } = useAddDepartmentTicket(() => {
    reload();
    onClose();
  });
  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label="help_center.department.dialog.add.title"
      submitButtonLabel="help_center.department.dialog.add.submit"
    />
  );
};

export const EditForm = ({ onClose, reload, editId }) => {
  const { methods, onSubmit } = useEditDepartmentTicket(editId, () => {
    reload();
    onClose();
  });

  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label="help_center.department.dialog.edit.title"
      submitButtonLabel="help_center.department.dialog.edit.submit"
    />
  );
};

export default Form;
