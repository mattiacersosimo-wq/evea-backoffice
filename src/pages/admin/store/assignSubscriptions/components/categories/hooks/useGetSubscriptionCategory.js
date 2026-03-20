import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";
import usePagination from "src/components/pagination/usePagination";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";

const useGetSubscriptionCategory = () => {
  const { count, onChange, page, seed, rowStart } = usePagination();
  const [state, actions] = useDataHandler();

  const fetchSubCategoryList = async (page = 1) => {
    try {
      const { data } = await axiosInstance(
        `api/admin/product-subscription-categories?page=${page}`
      );
      const { status, data: categories } = data;
      if (status) {
        const { last_page, data: list, from } = categories;
        seed(last_page, from);
        if (Boolean(list.length)) {
          actions.success(list);
          return;
        }
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.log(err);
    }
  };
  useEffect(() => {
    actions.loading();
    fetchSubCategoryList(page);
  }, [page]);

  return {
    state,
    fetchSubCategoryList,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default useGetSubscriptionCategory;
