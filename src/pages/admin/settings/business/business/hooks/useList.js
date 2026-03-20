import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useBusinessList = () => {
  const [state, actions] = useDataHandler();
  const { enqueueSnackbar } = useSnackbar();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const fetchBusinessList = async (page = 1) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/business-builder?page=${page}`
      );
      const { status, data: businesses } = data;
      if (status) {
        const { last_page, from, data: list } = businesses;
        seed(last_page, from);
        if (Boolean(list.length)) {
          actions.success(list);
          return;
        }
      }
      actions.success();
    } catch (err) {
      actions.error();
      Object.values(err).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  useEffect(() => {
    actions.loading();
    fetchBusinessList(page);
  }, [page]);

  return { state, fetchBusinessList, count, onChange, page, rowStart };
};

export default useBusinessList;
