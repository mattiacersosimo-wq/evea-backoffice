import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";

const useDelete = (deleteId, cb) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    const data = new FormData();
    data.append("_method", "DELETE");

    const { status, data: responseData } = await axiosInstance.post(
      `/api/admin/product-subscriptions/${deleteId}`,
      data
    );

    if (status === 200) {
      enqueueSnackbar(responseData.message);
      cb();
      return;
    }
    enqueueSnackbar("Failed to delete subscription", { variant: "error" });
  };

  return handleDelete;
};

export default useDelete;
