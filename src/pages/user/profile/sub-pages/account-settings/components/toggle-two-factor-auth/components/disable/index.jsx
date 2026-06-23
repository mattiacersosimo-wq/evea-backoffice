import { Dialog } from "@material-ui/core";
import { FormProvider } from "src/components/hook-form";
import TwoFactorVerificationDialog from "../two-factor-verification-dialog";
import useDisable from "./hooks/useDisable";
import Transition from "src/utils/dialog-animation";

const Disable = ({ open, onClose }) => {
  const { methods, onSubmit } = useDisable(() => {
    onClose();
  });
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <TwoFactorVerificationDialog />
      </FormProvider>
    </Dialog>
  );
};

export default Disable;
