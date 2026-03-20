import { Dialog, DialogTitle, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Form from "../form";
import useAdd from "./hooks/use-add";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const AddDialog = ({ open, onClose, fetchData }) => {
  const theme = useTheme();
  const { methods, onSubmit } = useAdd(() => {
    fetchData();
    onClose();
  });

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
        <Translate>{"assign_subscriptions.add_category"}</Translate>
      </DialogTitle>
      <Form methods={methods} onSubmit={onSubmit} onClose={onClose} />
    </Dialog>
  );
};

export default AddDialog;
