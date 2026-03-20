import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";

const useFetchEWallet = (filter) => {
  const [state, actions] = useDataHandler();
  const handleErrors = useErrors();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const fetchData = async (page = 1, filter) => {
    actions.loading();
    try {
      const { status, data } = await axiosInstance.get("/api/admin/ewallet", {
        params: {
          page,
          ...filter,
        },
      });
      const { data: eWallet } = data;
      const { data: list } = eWallet;
      if (status) {
        seed(eWallet.last_page, eWallet.from);
        if (Boolean(list.length)) {
          onChange(null, page);
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
    actions.loading();
    const { start_date, end_date } = filter;
    fetchData(page, {
      ...filter,
      start_date: serializeDate(start_date),
      end_date: serializeDate(end_date),
    });
  }, [page]);

  return { state, fetchData, count, onChange, page, rowStart };
};

export default useFetchEWallet;
