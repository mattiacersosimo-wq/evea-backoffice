import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/fetchUser";

const useFetchDepositWallet = () => {
  const [state, actions] = useDataHandler();
  const handleErrors = useErrors();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const fetchData = async (query = "", page = "") => {
    try {
      const { data, status } = (
        await axiosInstance.get(`/deposit-wallet?query=${query}&page=${page}`)
      ).data;
      if (status) {
        const { last_page, from, data: list } = data;
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
    fetchData("", page);
  }, [page]);

  return { state, count, onChange, page, rowStart };
};

export default useFetchDepositWallet;
