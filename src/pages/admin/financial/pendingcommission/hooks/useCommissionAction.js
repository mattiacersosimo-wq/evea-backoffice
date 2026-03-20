import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useCommissionAction = (cb) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();

  const approveCommission = async (id) => {
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/approve_commission/${id}`
      );

      if (status === 200) {
        cb?.();
        enqueueSnackbar(data?.message);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  const cancelCommission = async (id) => {
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/cancel_commission/${id}`
      );

      if (status === 200) {
        cb?.();
        enqueueSnackbar(data?.message);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  return {
    approveCommission,
    cancelCommission,
  };
};

export default useCommissionAction;
