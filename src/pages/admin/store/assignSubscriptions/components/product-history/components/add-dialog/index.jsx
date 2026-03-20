import { useTheme } from "@mui/material/styles";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";

import { FormProvider } from "src/components/hook-form";

import FormContent from "./components/form-content";
import useAddProduct from "./components/hooks/use-add-product";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const AddProductDialog = ({ open, onClose, fetchData, isCombo = false }) => {
  const theme = useTheme();
  const { methods, onSubmit } = useAddProduct(() => {
    fetchData();
    onClose();
  });

  if (!open) return null;
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="add-product"
      TransitionComponent={Transition}
    >
      <DialogTitle id="add-product">
        {" "}
        <Translate>{"assign_subscriptions.addProduct"}</Translate>
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        {open && <FormContent isCombo={isCombo} onClose={onClose} />}
      </FormProvider>
    </Dialog>
  );
};

export default AddProductDialog;
