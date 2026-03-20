import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/fetchUser";

const useFundTransfer = () => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const fetchData = async (page = 1) => {
    try {
      const { data, status } = await (
        await axiosInstance.get(`fund-transfer?page=${page}`)
      ).data;
      if (status) {
        const { data: eWallet, from, last_page } = data;
        seed(last_page, from);
        if (Boolean(eWallet.length)) {
          actions.success(eWallet);
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
    fetchData(page);
  }, [page]);

  return {
    state,
    count,
    onChange,
    page,
    rowStart,
    refetch: () => fetchData(page),
  };
};

export default useFundTransfer;
