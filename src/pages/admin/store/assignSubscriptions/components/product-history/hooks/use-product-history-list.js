import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useProductHistoryList = (filter) => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const handleErrors = useErrors();
  const fetchProductHistoryList = async (page = 1, filter) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/product-subscriptions`,
        {
          params: {
            page,
            ...filter,
          },
        }
      );

      const { status, data: history } = data;
      if (status) {
        const { data: list, last_page, from } = history.product_subscription;
        seed(last_page, from);
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
    actions.loading();
    fetchProductHistoryList(page, filter);
  }, [page]);

  return {
    state,
    fetchProductHistoryList,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default useProductHistoryList;
