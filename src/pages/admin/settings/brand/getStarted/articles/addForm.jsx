import { LoadingButton } from "@mui/lab";
import { Button, DialogActions } from "@mui/material";
import { useSnackbar } from "notistack";

import { FormProvider } from "src/components/hook-form";

import axiosInstance from "src/utils/axios";
import FormFields from "./formFields";
import useArticleForm from "./hooks/useArticleForm";
import { genReqData, handleErrors } from "./utils";
import Translate from "src/components/translate";

const AddForm = ({ onClose, fetchArticles }) => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useArticleForm();

  const onSubmit = async (inputData) => {
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/brand-get-started-articles/`,
        genReqData(inputData)
      );
      if (status === 200) {
        fetchArticles();
        enqueueSnackbar(data.message);
        onClose();
      }
    } catch (error) {
      handleErrors(enqueueSnackbar)(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <FormFields />
      <DialogActions>
        <Button onClick={onClose} autoFocus color="error" name="close">
          <Translate>{"settings.brand.close"}</Translate>
        </Button>
        <LoadingButton type="submit" variant="contained" name="submit">
          <Translate> {"settings.brand.submit"}</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export default AddForm;
