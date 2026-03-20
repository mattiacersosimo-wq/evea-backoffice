import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";

const useHistory = (filter) => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const fetchData = async (page = 1, filter) => {
    actions.loading();
    try {
      const { status, data } = await axiosInstance(
        "api/admin/fund-transaction-history",
        {
          params: {
            page,
            ...filter,
          },
        }
      );
      if (status === 200) {
        const { last_page, from, data: list } = data.data;
        seed(last_page, from);
        if (Boolean(list.length)) {
          onChange(null, page);
          actions.success(list);
          return;
        }
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.error(err);
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

  return { state, fetchData, onChange, page, rowStart, count };
};

export default useHistory;
