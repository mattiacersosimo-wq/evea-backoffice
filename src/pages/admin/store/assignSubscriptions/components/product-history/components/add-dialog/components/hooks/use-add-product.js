import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useAddProductForm from "./use-product-form";

const useAddProduct = (cb) => {
  const methods = useAddProductForm();
  const handleErrors = useErrors();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = methods;
  const onSubmit = async (inputData) => {
    const { is_with_commissions, is_with_materials, date, ...rest } = inputData;
    const reqData = new FormData();
    Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));
    reqData.append("is_with_commissions", is_with_commissions ? 1 : 0);
    reqData.append("is_with_materials", is_with_materials ? 1 : 0);
    if (date) reqData.append("date", date);
    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/product-subscriptions`,
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

  return { methods, onSubmit: handleSubmit(onSubmit) };
};

export default useAddProduct;
