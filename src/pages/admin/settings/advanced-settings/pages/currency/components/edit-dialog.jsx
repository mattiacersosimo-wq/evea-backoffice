import { Dialog, DialogTitle } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";
import useGetCurrencyById from "../hooks/use-get-currency-by-id";
import Form from "./form";

const EditDialog = ({ open, handleClose, selectedId, fetchData }) => {
  const { methods, fetchCurrency } = useGetCurrencyById();

  useEffect(() => {
    if (open) {
      fetchCurrency(selectedId);
    }
  }, [open, selectedId]);

  const { handleSubmit } = methods;
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = handleSubmit(async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));

    reqData.append("_method", "PUT");
    try {
      const { data } = await axiosInstance.post(
        `api/admin/currency/${selectedId}`,
        reqData
      );
      const { status, message } = data;
      if (status) {
        enqueueSnackbar(message);
        handleClose();
        fetchData();
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <Translate>settings.currency.edit_dialog</Translate>
      </DialogTitle>

      <Form
        handleClose={handleClose}
        methods={methods}
        onSubmit={onSubmit}
        buttonLabel="Update"
      />
    </Dialog>
  );
};

export default EditDialog;
