import React, { useEffect, useState } from "react";
import fetchUser from "src/utils/fetchUser";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";

const useGetArticle = () => {
  const [article, setArticle] = useState([]);
  const [state, actions] = useDataHandler();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const fetchArticle = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await fetchUser(`user-article-categories?page=${page}`);
      const { status, data: articles } = data;
      if (status) {
        const { last_page, from, data: list } = articles;
        seed(last_page);
        setArticle(data?.data?.data);
        actions.success(data?.data?.data, true);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.log(err);
    }
  };
  useEffect((page) => {
    fetchArticle(page);
  }, []);
  return { article, state, count, onChange, page, rowStart };
};
export default useGetArticle;
