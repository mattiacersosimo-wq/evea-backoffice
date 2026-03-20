import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const usePriorities = () => {
  const [priorities, setPriorities] = useState([]);
  const [state, actions] = useDataHandler();
  const handleErrors = useErrors();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const fetchPriorities = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/support-ticket-priorities?page=${page}`
      );
      const { status, data: priorities } = data;
      if (status) {
        const { data: list, last_page, from } = priorities;
        seed(last_page, from);
        setPriorities(list);
        actions.success(list);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchPriorities(page);
  }, [page]);

  return {
    state,
    priorities,
    fetchPriorities,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default usePriorities;
