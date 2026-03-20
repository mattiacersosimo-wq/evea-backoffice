import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";

const useFetchDepositWallet = (filter) => {
  const [state, actions] = useDataHandler();
  const handleErrors = useErrors();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const fetchData = async (page = 1, filter) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get("/api/admin/deposit-wallet", {
        params: { page, ...filter },
      });

      const { status, data: depositWallet } = data;
      const { data: list } = depositWallet;
      if (status) {
        seed(depositWallet.last_page, depositWallet.from);
        if (Boolean(list.length)) {
          actions.success(list);
          return;
        }
      }
      actions.success();
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };
  useEffect(() => {
    const { start_date, end_date } = filter;
    fetchData(page, {
      ...filter,
      start_date: serializeDate(start_date),
      end_date: serializeDate(end_date),
    });
  }, [page]);

  return { state, fetchData, count, onChange, page, rowStart };
};

export default useFetchDepositWallet;
