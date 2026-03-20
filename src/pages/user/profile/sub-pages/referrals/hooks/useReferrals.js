import { useSnackbar } from "notistack";
import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useReferrals = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const [state, actions] = useDataHandler();

  const fetchData = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance("/api/referrals", {
        params: { page },
      });
      const { status, referrals } = data;
      if (status) {
        const { last_page, from, data: list } = referrals;
        actions.success(list);
        seed(last_page, from);
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
    fetchData(page);
  }, [page]);

  return { state, count, onChange, page, rowStart };
};

export default useReferrals;
