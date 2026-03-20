import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import genFaqReqData from "../../utils/genFaqReqData";
import useCategoryForm from "./useCategoryForm";

const useAddCategory = (cb) => {
  const methods = useCategoryForm();

  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    try {
      const { status, data } = await axiosInstance({
        method: "post",
        url: "/api/admin/faq-categories",
        data: genFaqReqData(inputData),
      });
      if (status === 200) {
        cb();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      Object.entries(err.errors).forEach(([k, v]) =>
        methods.setError(k, { message: v[0] })
      );
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddCategory;
