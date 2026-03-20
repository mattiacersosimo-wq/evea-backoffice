import { LoadingButton } from "@mui/lab";
import { Button, DialogActions } from "@mui/material";
import { useSnackbar } from "notistack";

import { FormProvider } from "src/components/hook-form";

import axiosInstance from "src/utils/axios";
import FormFields from "./formFields";
import useGetArticleById from "./hooks/useGetArticleById";
import { genReqData, handleErrors } from "./utils";
import Translate from "src/components/translate";

const EditForm = ({ onClose, fetchArticles, articleId }) => {
  const methods = useGetArticleById(articleId);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    const reqData = genReqData(inputData);
    reqData.append("_method", "PUT");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/brand-get-started-articles/${articleId}`,
        reqData
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
      <FormFields isEdit />
      <DialogActions>
        <Button onClick={onClose} autoFocus color="error" name="close">
          <Translate>{"settings.brand.close"}</Translate>
        </Button>
        <LoadingButton type="submit" variant="contained" name="submit">
          <Translate>{"settings.brand.update"}</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export default EditForm;
