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
import useAddCategory from "../hooks/useAddCategory";
import useEditCategory from "../hooks/useEditCategory";

const Form = ({ methods, onSubmit, onClose, label, submitButtonLabel }) => {
  const { palette } = useTheme();
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle
        id="add-categories"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="span" sx={{ color: "#444" }}>
          <Translate>{label}</Translate>
        </Typography>
        <IconButton aria-label="close" onClick={onClose} name="close">
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
              marginTop: 2,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
              },
            }}
          >
            <RHFTextField
              size="small"
              name="name"
              label="help_center.categories.dialog.edit.name"
            />
            <Box name="description">
              <RHFTextField
                size="small"
                rows={3}
                fullwidth
                multiline
                name="description"
                label="help_center.categories.dialog.edit.desc"
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                rowGap: 2,
                columnGap: 2,
                marginTop: 0,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                },
              }}
            >
              <RHFSelect
                size="small"
                name="active"
                label="help_center.categories.dialog.edit.status"
              >
                <option value="" />
                <option value="1">{t("status.enabled")}</option>
                <option value="0">{t("status.disabled")}</option>
              </RHFSelect>
            </Box>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          autoFocus
          sx={{ color: palette.warning.normal }}
          name="close"
        >
          <Translate>help_center.categories.dialog.edit.cancel</Translate>
        </Button>

        <LoadingButton type="submit" variant="contained" name="submit">
          <Translate>{submitButtonLabel}</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export default Form;

export const AddForm = ({ onClose, reload }) => {
  const { methods, onSubmit } = useAddCategory(() => {
    onClose();
    reload();
  });
  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label="help_center.categories.dialog.add.title"
      submitButtonLabel="help_center.categories.dialog.add.submit"
    />
  );
};

export const EditForm = ({ onClose, reload, selectedId }) => {
  const { methods, onSubmit } = useEditCategory(selectedId, () => {
    onClose();
    reload();
  });

  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label="help_center.categories.dialog.edit.title"
      submitButtonLabel="help_center.categories.dialog.edit.submit"
    />
  );
};
