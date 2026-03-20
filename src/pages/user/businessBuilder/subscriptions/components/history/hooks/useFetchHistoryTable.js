import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import fetchUser from "src/utils/fetchUser";

const useFetchHistoryTable = () => {
  const { count, onChange, page, rowStart, seed } = usePagination();
  const [history, setHistory] = useState([]);
  const [state, actions] = useDataHandler();

  const fetchHistory = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await fetchUser(`my-bb-subscriptions?page=${page}`);
      const { status, data: orderHistory } = data;
      if (status) {
        const { data: list, last_page, from } = orderHistory;
        seed(last_page, from);
        actions.success(list);
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  return { state, count, onChange, page, rowStart };
};

export default useFetchHistoryTable;
