import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useTrashed = () => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const handleErrors = useErrors();
  const fetchProductHistoryList = async (query, page = 1) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/product-subscriptions`,
        {
          params: {
            query,
            page,
          },
        }
      );

      const { status, data: history } = data;

      if (status) {
        const {
          data: list,
          last_page,
          from,
        } = history.trashed_product_subscription;
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
    fetchProductHistoryList("", page);
  }, [page]);

  return {
    state,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default useTrashed;
