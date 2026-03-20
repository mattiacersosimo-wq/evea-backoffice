import { Dialog } from "@mui/material";
import React from "react";
import UpdateForm from "./components/update-form";
import Transition from "src/utils/dialog-animation";

const UpdateFinPay = ({ open, onClose, purchaseId, reload }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="recurring-payment"
      TransitionComponent={Transition}
    >
      <UpdateForm
        closeDialog={onClose}
        purchaseId={purchaseId}
        fetchData={reload}
      />
    </Dialog>
  );
};

export default UpdateFinPay;
