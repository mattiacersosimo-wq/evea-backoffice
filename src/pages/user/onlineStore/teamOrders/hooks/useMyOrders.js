import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/fetchUser";
import serializeDate from "src/utils/serialize-date";

const useMyOrders = () => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const [currentFilter, setCurrentFilter] = useState({});
  const fetchData = async (p = 1, filter = {}) => {
    setCurrentFilter(filter);
    actions.loading();
    try {
      const { data } = await axiosInstance.get(`my-team-orders`, {
        params: {
          page: p,
          ...filter,
          start_date: filter.start_date ? serializeDate(filter.start_date) : undefined,
          end_date: filter.end_date ? serializeDate(filter.end_date) : undefined,
        },
      });
      const { status, data: report } = data;
      if (status) {
        const { last_page, data: list, from } = report;
        seed(last_page, from);
        if (Boolean(list.length)) {
          actions.success(list);
          return;
        }
      }
      actions.success();
    } catch (err) {
      actions.error();
    }
  };
  useEffect(() => {
    fetchData(page, currentFilter);
  }, [page]);

  return { state, fetchData, count, onChange, page, rowStart };
};

export default useMyOrders;
