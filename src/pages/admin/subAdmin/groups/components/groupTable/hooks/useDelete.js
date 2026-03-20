import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useSubAdminDelete = (gid, cb) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();

  const handleDelete = async () => {
    const URI = `api/admin/sub-admin-user-groups/${gid}`;
    const reqData = new FormData();
    reqData.append("_method", "DELETE");
    try {
      const { status, data } = await axiosInstance.post(URI, reqData);
      if (status === 200) {
        enqueueSnackbar(data.message);
        cb(true);
        return;
      }
    } catch (err) {
      cb();
      enqueueSnackbar(err.message, { variant: "error" });
      handleErrors(err);
    }
  };

  return handleDelete;
};

export default useSubAdminDelete;
