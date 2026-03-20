import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useCategoryList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const [state, actions] = useDataHandler();
  const fetchCategoryList = async (page = 1) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/material-categories?type=product&page=${page}`
      );
      const { status, data: categories } = data;
      if (status) {
        const { data: list, last_page, from } = categories;
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
    fetchCategoryList(page);
  }, [page]);

  return {
    state,
    categoryList,
    fetchCategoryList,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default useCategoryList;
