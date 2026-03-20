import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";

import axiosInstance from "src/utils/axios";

const useReviewList = () => {
  const { count, onChange, page, rowStart, seed } = usePagination();
  const [state, actions] = useDataHandler();

  useEffect(() => {
    actions.loading();
    const fetchReviewList = async (page = 1) => {
      try {
        const { data } = await axiosInstance.get(
          `/api/admin/user-reviews?page=${page}`
        );

        const { status, data: reviews } = data;

        if (status) {
          const { last_page, from, data: list } = reviews;
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

    fetchReviewList(page);
  }, [page]);

  return { state, count, onChange, page, rowStart };
};

export default useReviewList;
