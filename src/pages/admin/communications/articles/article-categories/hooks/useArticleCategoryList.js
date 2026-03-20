import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useArticleCategoryList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [state, actions] = useDataHandler();
  const { enqueueSnackbar } = useSnackbar();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const fetchCategoryList = async (page) => {
    actions.loading();
    try {
      const { data } = await axiosInstance(`api/admin/article-categories`, {
        params: { page },
      });
      const { status, data: categories } = data;

      if (status) {
        const { last_page, from, data: list } = categories;
        seed(last_page, from);
        setCategoryList(list);
        actions.success(list);
        return;
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
    categoryList,
    fetchCategoryList,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default useArticleCategoryList;
