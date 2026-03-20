import { useSnackbar } from "notistack";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";

const useDelete = (fetchData) => {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const label = params.emailLabel;
  const handleDelete =
    (selectedId) =>
    async (cb = () => null) => {
      const data = new FormData();
      data.append("_method", "DELETE");

      const { status, data: responseData } = await axiosInstance.post(
        `/api/user/emails-user/${selectedId}?label=${label}`,
        data
      );

      if (status === 200) {
        enqueueSnackbar(responseData.message);
        fetchData();
        cb();

        return;
      }
      enqueueSnackbar("Failed to delete the Mail", { variant: "error" });
    };

  return handleDelete;
};

export default useDelete;
