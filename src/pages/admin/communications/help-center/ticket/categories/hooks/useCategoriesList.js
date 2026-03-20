import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";

const useCategoriesList = () => {
  const [state, actions] = useDataHandler();
  const [categoriesList, setCategoriesList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const fetchCategoriesList = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/support-ticket-categories?page=${page}`
      );
      const { status, data: categories } = data;

      if (status) {
        const { last_page, data: list, from } = categories;
        seed(last_page, from);
        setCategoriesList(list);
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
    fetchCategoriesList(page);
  }, [page]);

  return {
    state,
    categoriesList,
    fetchCategoriesList,
    page,
    count,
    onChange,
    rowStart,
  };
};

export default useCategoriesList;
