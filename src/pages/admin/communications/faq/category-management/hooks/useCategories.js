import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useCategories = () => {
  const [state, actions] = useDataHandler();
  const { enqueueSnackbar } = useSnackbar();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const fetchCategoryList = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/faq-categories?page=${page}`
      );

      const { status, data: categories } = data;
      if (status) {
        const { last_page, from, data: list } = categories;
        seed(last_page, from);
        if (Boolean(list.length)) {
          onChange(null, page);
          actions.success(list);
          return;
        }
        actions.success();
      }
      if (status == false) {
        fetchCategoryList((page = 1));
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
    fetchCategoryList(page);
  }, [page]);

  return {
    state,

    fetchCategoryList,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default useCategories;
