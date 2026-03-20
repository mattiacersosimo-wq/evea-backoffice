import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useDeleteProduct = () => {
  const { enqueueSnackbar } = useSnackbar();
  const deleteProduct = async (id) => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/products/${id}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        return true;
      }
      console.error("Failed to delete");
      return true;
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      return false;
    }
  };

  return deleteProduct;
};

export default useDeleteProduct;
