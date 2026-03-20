import { useSnackbar } from "notistack";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import useEditForm from "./useEditForm";

const useEdit = (editId, onClose) => {
  const { pid } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useEditForm();

  const { reset, handleSubmit } = methods;

  const onSubmit = async (data) => {
    const reqData = new FormData();
    reqData.append("_method", "PUT");
    reqData.append("product_id", pid);
    reqData.append("sample_doc", data.sample_doc[0]);

    const URL = `/api/admin/product-sample-docs/${editId}`;

    try {
      const { status, data } = await axiosInstance.post(URL, reqData);
      if (status === 200) {
        enqueueSnackbar(data.message);
        onClose();
        reset();
        return;
      }
      enqueueSnackbar(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return { methods, onSubmit: handleSubmit(onSubmit) };
};

export default useEdit;
