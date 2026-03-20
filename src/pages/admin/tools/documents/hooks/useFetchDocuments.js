import { useEffect, useState } from "react";
import usePagination from "src/components/pagination/usePagination";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const useFetchDocuments = () => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const fetchDocuments = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance(
        `/api/admin/tool-documents?page=${page}`
      );

      const { status, data: documents } = data;
      if (status) {
        const { last_page, from, data: list } = documents;
        seed(last_page, from);
        actions.success(list);
        return;
      }
      actions.success();
    } catch (error) {
      actions.error();
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDocuments(page);
  }, [page]);

  return { state, fetchDocuments, count, onChange, page, rowStart };
};

export default useFetchDocuments;
