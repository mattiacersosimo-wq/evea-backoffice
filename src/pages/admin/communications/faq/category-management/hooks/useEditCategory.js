import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import genFaqReqData from "../../utils/genFaqReqData";
import useGetCategoryById from "./useGetCategoryById";

const useEditCategory = (id, cb) => {
  const methods = useGetCategoryById(id);
  const { setError } = methods;
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = genFaqReqData(inputData);
    reqData.append("_method", "PUT");
    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/faq-categories/${id}`,
        reqData
      );
      if (status === 200) {
        cb();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      Object.entries(err.errors).forEach(([k, v]) =>
        setError(k, { message: v[0] })
      );
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useEditCategory;
