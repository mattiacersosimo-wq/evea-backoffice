import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";

const useDelete = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete =
    (selectedId) =>
    async (cb = () => null) => {
      const data = new FormData();
      data.append("_method", "DELETE");

      const { status, data: responseData } = await axiosInstance.post(
        `/api/user/mail/${selectedId}`,
        data
      );

      if (status === 200) {
        enqueueSnackbar(responseData.message);
        cb();

        return;
      }
      enqueueSnackbar("Failed to delete the Mail", { variant: "error" });
    };

  return handleDelete;
};

export default useDelete;
