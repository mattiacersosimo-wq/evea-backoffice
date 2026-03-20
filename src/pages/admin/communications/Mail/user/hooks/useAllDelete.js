import { useSnackbar } from "notistack";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";

const useAllDelete = (fetchData) => {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const handleDelete =
    (selectedId) =>
    async (cb = () => null) => {
      const data = new FormData();
      data.append("_method", "DELETE");
      selectedId.map((item) => data.append("emailIds[]", item));
      const { status, data: responseData } = await axiosInstance.post(
        `/api/user/deletemails-user?type=${params.emailLabel}`,
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

export default useAllDelete;
