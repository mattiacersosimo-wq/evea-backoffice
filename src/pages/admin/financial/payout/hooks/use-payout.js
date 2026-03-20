import { useSnackbar } from "notistack";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const defaultState = { payoutData: [], payoutHistory: [] };

const usePayout = () => {
  const [state, actions] = useDataHandler(defaultState);
  const { enqueueSnackbar } = useSnackbar();
  const fetchPayoutData = async (page = 1, query = []) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(`/api/admin/payout-requests`, {
        params: {
          page,
          ...query,
        },
      });
      const { status, data: payout } = data;
      if (status) {
        const { payout_history: payoutHistory, pending_payout: payoutData } =
          payout;
        actions.success({ payoutHistory, payoutData }, true);
        return;
      }
      actions.success(defaultState, true);
    } catch (err) {
      actions.error();
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return { state, fetchPayoutData };
};

export default usePayout;
