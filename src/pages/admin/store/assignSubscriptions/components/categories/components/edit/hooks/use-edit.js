import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useGetById from "./use-get-by-id";

const useEdit = (cb = () => null) => {
  const { enqueueSnackbar } = useSnackbar();
  const { fetchSubscriptionCategoryById, methods } = useGetById();

  const onSubmit = (editId) => async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );

    reqData.append("_method", "PUT");

    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/product-subscription-categories/${editId}`,
        reqData
      );
      if (status === 200) {
        cb();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    methods,
    fetchSubscriptionCategoryById,
    onSubmit,
  };
};

export default useEdit;
