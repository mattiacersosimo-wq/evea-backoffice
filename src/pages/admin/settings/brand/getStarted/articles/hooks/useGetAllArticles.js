import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useGetAllArticles = () => {
  const [state, actions] = useDataHandler();
  const [articlesList, setArticlesList] = useState([]);
  const { count, onChange, page, seed, rowStart } = usePagination();

  const { enqueueSnackbar } = useSnackbar();
  const fetchArticles = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/brand-get-started-articles?page=${page}`
      );

      const { status, data: articles } = data;
      if (status) {
        const { last_page, data: list, from } = articles;
        seed(last_page, from);
        setArticlesList(list);
        actions.success(list);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      enqueueSnackbar(err.message);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  return {
    articlesList,
    state,
    fetchArticles,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default useGetAllArticles;
