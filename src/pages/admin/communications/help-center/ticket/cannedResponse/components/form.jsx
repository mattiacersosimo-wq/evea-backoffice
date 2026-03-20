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
import useAddCannedResponse from "../hooks/useAddCannedResponse";
import useEditCannedResponse from "../hooks/useEditCannedResponse";

const Form = ({ methods, onSubmit, onClose, label, submitButtonLabel }) => {
  const { palette } = useTheme();

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle
        id="canned-response"
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
              name="title"
              label="help_center.canned_response.dialog.edit.name"
            />
            <RHFTextField
              size="small"
              name="subject"
              label="help_center.canned_response.dialog.edit.sub"
            />
            <RHFEditor
              size="small"
              name="message"
              simple
              placeholder="help_center.canned_response.dialog.edit.placeholder"
            />
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
          <Translate>help_center.canned_response.dialog.edit.cancel</Translate>
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
  const { methods, onSubmit } = useAddCannedResponse(() => {
    onClose();
    reload();
  });
  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label="help_center.canned_response.dialog.add.title"
      submitButtonLabel="help_center.canned_response.dialog.add.submit"
    />
  );
};

export const EditForm = ({ onClose, reload, selectedId }) => {
  const { methods, onSubmit } = useEditCannedResponse(selectedId, () => {
    onClose();
    reload();
  });

  return (
    <Form
      onClose={onClose}
      methods={methods}
      onSubmit={onSubmit}
      label="help_center.canned_response.dialog.edit.title"
      submitButtonLabel="help_center.canned_response.dialog.edit.submit"
    />
  );
};
