import { Dialog, DialogTitle, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useDocumentAdd from "../hooks/useAddDocument";
import useEditDocument from "../hooks/useEditDocument";

import Form from "./form";
import { useTranslation } from "react-i18next";
import Transition from "src/utils/dialog-animation";

const DialogWrapper = ({ open, onClose, children, label }) => {
  const theme = useTheme();

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="tool-doc"
      TransitionComponent={Transition}
    >
      <DialogTitle id="tool-doc">{label}</DialogTitle>
      {children}
    </Dialog>
  );
};

export const AddDialog = ({ open, onClose, reload }) => {
  const { methods, onSubmit } = useDocumentAdd(() => {
    reload();
    onClose();
  });
  const { t } = useTranslation();
  return (
    <DialogWrapper
      open={open}
      onClose={onClose}
      label={t("tools.documents.addDocument")}
    >
      <Form methods={methods} onSubmit={onSubmit} onClose={onClose} />
    </DialogWrapper>
  );
};

export const EditDialog = ({ open, onClose, reload, selectedId }) => {
  const { methods, onSubmit } = useEditDocument(selectedId, () => {
    reload();
    onClose();
  });
  const { t } = useTranslation();
  return (
    <DialogWrapper
      open={open}
      onClose={onClose}
      label={t("tools.documents.updateDocument")}
    >
      <Form methods={methods} onSubmit={onSubmit} onClose={onClose} />
    </DialogWrapper>
  );
};
