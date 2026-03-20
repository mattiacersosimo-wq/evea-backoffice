import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useProductCategoryForm from "./useProductCategoryForm";

const useAddProductCategory = (cb) => {
  const methods = useProductCategoryForm();
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );

    try {
      const { status, data } = await axiosInstance.post(
        "/api/admin/product-categories",
        reqData
      );
      if (status === 200) {
        cb();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};
export default useAddProductCategory;
