import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";

const useHandler = (reload) => {
  const { enqueueSnackbar } = useSnackbar();

  const handler = (url) => (id) => async () => {
    try {
      const { status, data } = await axiosInstance.post(`${url}/${id}`);

      if (status === 200) {
        enqueueSnackbar(data.message);
        reload();
      }
    } catch (err) {
      enqueueSnackbar(
        url.includes("approve") ? "Failed to approve" : "Failed to reject",
        { variant: "error" }
      );
    }
  };
  const approve = handler("/api/admin/approve-payout");
  const reject = handler("/api/admin/reject-payout");
  return { approve, reject };
};

export default useHandler;
