import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useArticleCategoryForm from "./useArticleCategoryForm";

const useAddArticleCategory = (cb) => {
  const methods = useArticleCategoryForm();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).map(([key, value]) => reqData.append(key, value));

    try {
      const { status, data } = await axiosInstance.post(
        "api/admin/article-categories",
        reqData
      );
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

export default useAddArticleCategory;
