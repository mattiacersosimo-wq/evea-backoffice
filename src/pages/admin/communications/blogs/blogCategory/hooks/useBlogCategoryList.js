import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";

import axiosInstance from "src/utils/axios";

const useBlogCategoryList = () => {
  const [state, actions] = useDataHandler();

  const { count, onChange, page, seed, rowStart } = usePagination();
  const fetchCategoryList = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/blog-categories?page=${page}`
      );

      const { status, data: categories } = data;
      if (status) {
        const { last_page, from, data: list } = categories;
        seed(last_page, from);

        actions.success(list);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.log(err);
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

export default useBlogCategoryList;
