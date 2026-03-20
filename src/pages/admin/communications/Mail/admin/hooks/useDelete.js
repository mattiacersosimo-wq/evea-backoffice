import { useSnackbar } from "notistack";
import { useOutletContext, useParams } from "react-router";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";

const useDelete = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { fetchData } = useOutletContext();
  const params = useParams();
  const { isAdmin, isSubAdmin } = useAuth();
  const label = params.systemLabel;
  const handleDelete =
    (selectedId) =>
    async (cb = () => null) => {
      const data = new FormData();
      data.append("_method", "DELETE");
      const { status, data: responseData } = await axiosInstance.post(
        isAdmin || isSubAdmin
          ? `/api/admin/mail/${selectedId}?label=${label}`
          : `/api/user/mail/${selectedId}?label=${label}`,
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
