import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useSubscriptionForm from "../../../hooks/use-category-form";

const useAdd = (onSuccess) => {
  const methods = useSubscriptionForm();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );

    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/product-subscription-categories`,
        reqData
      );
      if (status === 200) {
        onSuccess();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      enqueueSnackbar("Failed to Add", { variant: "error" });
      console.error(err);
    }
  };

  return { methods, onSubmit: onSubmit };
};

export default useAdd;
