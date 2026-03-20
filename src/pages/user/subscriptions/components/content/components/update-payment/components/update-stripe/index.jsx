import { Dialog } from "@mui/material";
import UpdateStripeCard from "./stripe";
import Transition from "src/utils/dialog-animation";

const UpdateStripe = ({ open, onClose, reload }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="recurring-payment"
      TransitionComponent={Transition}
    >
      <UpdateStripeCard closeDialog={onClose} reload={reload} />
    </Dialog>
  );
};

export default UpdateStripe;
