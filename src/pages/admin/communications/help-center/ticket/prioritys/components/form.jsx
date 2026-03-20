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
  RHFEditor,
  RHFTextField,
} from "src/components/hook-form";

import Translate from "src/components/translate";
import useAddPriority from "../hooks/useAddPriority";
import useEditPriority from "../hooks/useEditPriority";

const Form = ({ methods, label, onSubmit, onClose, submitButtonLabel }) => {
  const { palette } = useTheme();

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle
        id="add-priority"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="span" sx={{ color: "#444" }}>
          <Translate>{label}</Translate>
        </Typography>
        <IconButton aria-label="close" onClick={onClose} name="name">
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
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <RHFTextField
              size="small"
              name="name"
              label="help_center.priorities.dialog.edit.name"
            />
            <RHFTextField
              size="small"
              type="color"
              name="color"
              label="help_center.priorities.dialog.edit.color"
              InputLabelProps={{ shrink: true }}
            />
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
            <Box name="description">
              <RHFTextField
                size="small"
                rows={3}
                multiline
                name="description"
                simple
                placeholder="help_center.priorities.dialog.edit.desc"
              />
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
          <Translate>help_center.priorities.dialog.edit.cancel</Translate>
        </Button>
        <LoadingButton type="submit" variant="contained" name="submit">
          <Translate>{submitButtonLabel}</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export const AddForm = ({ refresh, onClose }) => {
  const { methods, onSubmit } = useAddPriority(() => {
    refresh();
    onClose();
  });

  return (
    <Form
      label="help_center.priorities.dialog.add.title"
      submitButtonLabel="help_center.priorities.dialog.add.submit"
      methods={methods}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};
export const EditForm = ({ editId, refresh, onClose }) => {
  const { methods, onSubmit } = useEditPriority(editId, () => {
    refresh();
    onClose();
  });

  return (
    <Form
      label="help_center.priorities.dialog.edit.title"
      submitButtonLabel="help_center.priorities.dialog.edit.submit"
      methods={methods}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};
