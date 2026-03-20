import { useSnackbar } from "notistack";
import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const useReferrals = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, actions] = useDataHandler();

  const fetchData = async () => {
    actions.loading();
    try {
      const { data } = await axiosInstance("/api/user/referrals", {
        params: { paginate: 0 },
      });
      const { status, referrals } = data;

      if (status) {
        actions.success(referrals.data);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      Object.values(err).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { state };
};

export default useReferrals;
