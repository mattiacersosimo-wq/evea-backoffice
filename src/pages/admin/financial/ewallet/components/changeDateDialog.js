import { Dialog, DialogTitle } from "@mui/material";
import Transition from "src/utils/dialog-animation";
import { useTranslation } from "react-i18next";
import ChangeDateForm from "./changeDateForm";
import useUpdateOrderDate from "../hooks/useUpdateOrderDate";

const DialogWrapper = ({ open, onClose, children, label }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="xs"
    TransitionComponent={Transition}
  >
    <DialogTitle>{label}</DialogTitle>
    {children}
  </Dialog>
);

const ChangeDateDialog = ({ open, onClose, selectedId, reload }) => {
  const { t } = useTranslation();

  const { onSubmit } = useUpdateOrderDate(selectedId, () => {
    reload();
    onClose();
  });

  return (
    <DialogWrapper
      open={open}
      onClose={onClose}
      label={t("Change Order Date")}
    >
      <ChangeDateForm onSubmit={onSubmit} onClose={onClose} />
    </DialogWrapper>
  );
};

export default ChangeDateDialog;