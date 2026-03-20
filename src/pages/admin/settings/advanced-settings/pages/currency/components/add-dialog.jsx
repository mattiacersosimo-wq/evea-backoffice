import { Dialog, DialogTitle } from "@mui/material";
import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import { useCurrencyForm } from "../hooks/use-get-currency-by-id";
import Form from "./form";
import Translate from "src/components/translate";

const AddDialog = ({ open, handleClose, fetchData }) => {
  const methods = useCurrencyForm();
  const { handleSubmit, setError } = methods;
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = handleSubmit(async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));

    try {
      const { data } = await axiosInstance.post(`api/admin/currency`, reqData);
      const { status, message } = data;
      if (status) {
        enqueueSnackbar(message);
        handleClose();
        fetchData();
      }
    } catch (err) {
      Object.entries(err.errors).forEach(([k, v]) =>
        setError(k, { message: v[0] })
      );
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle>
        <Translate>settings.currency.add_dialog</Translate>
      </DialogTitle>

      <Form
        handleClose={handleClose}
        methods={methods}
        onSubmit={onSubmit}
        buttonLabel="Add"
      />
    </Dialog>
  );
};

export default AddDialog;
