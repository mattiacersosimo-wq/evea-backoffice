import { Dialog, DialogTitle } from "@mui/material";
import Transition from "src/utils/dialog-animation";
import { useTranslation } from "react-i18next";
import UserDatesForm from "./userDatesForm";
import useUpdateUserDates from "./hooks/useUpdateUserDates";

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

const UserDatesDialog = ({ open, onClose, selectedId, reload }) => {
  const { t } = useTranslation();

  const { onSubmit } = useUpdateUserDates(selectedId, () => {
    reload();
    onClose();
  });

  return (
    <DialogWrapper open={open} onClose={onClose} label={t("Update User Dates")}>
      <UserDatesForm onSubmit={onSubmit} onClose={onClose} />
    </DialogWrapper>
  );
};

export default UserDatesDialog;
