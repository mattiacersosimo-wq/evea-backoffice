import { DialogContent, DialogTitle } from "@mui/material";

import AddUpdateCard from "./add-update-card";

const UpdateForm = ({ purchaseId, closeDialog, fetchData }) => {
  return (
    <>
      <DialogTitle id="update-form">FIN PAY CARD Update </DialogTitle>

      <DialogContent>
        <AddUpdateCard
          onClose={closeDialog}
          purchaseId={purchaseId}
          fetchData={fetchData}
        />
      </DialogContent>
    </>
  );
};

export default UpdateForm;
