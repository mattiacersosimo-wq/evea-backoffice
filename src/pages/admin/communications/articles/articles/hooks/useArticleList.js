import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import usePagination from "src/components/pagination/usePagination";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const useArticleList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [articleList, setArticleList] = useState([]);
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const fetchArticleList = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance(`api/admin/articles?page=${page}`);
      const { status, data: articles } = data;
      if (status) {
        const { last_page, data: list, from } = articles;
        seed(last_page, from);
        setArticleList(list);
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

  useEffect(() => fetchArticleList(page), [page]);

  return { state, articleList, fetchArticleList, count, onChange, rowStart };
};

export default useArticleList;
