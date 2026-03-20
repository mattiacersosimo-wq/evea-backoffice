import { Dialog, DialogTitle, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";

import Form from "../form";
import useEdit from "./hooks/use-edit";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const EditDialog = ({ open, onClose, fetchData, editId }) => {
  const theme = useTheme();
  const { fetchSubscriptionCategoryById, methods, onSubmit } = useEdit(() => {
    fetchData();
    onClose();
  });

  useEffect(() => {
    if (open) fetchSubscriptionCategoryById(editId);
  }, [editId, open]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="add-Category"
      TransitionComponent={Transition}
    >
      <DialogTitle id="add-Category">
        <Translate>{"assign_subscriptions.edit_category"}</Translate>
      </DialogTitle>
      <Form
        methods={methods}
        onSubmit={methods.handleSubmit(onSubmit(editId))}
        onClose={onClose}
      />
    </Dialog>
  );
};

export default EditDialog;
