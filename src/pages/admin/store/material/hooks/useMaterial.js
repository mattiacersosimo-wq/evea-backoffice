import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";

import axiosInstance from "src/utils/axios";

const useMaterial = () => {
  const { count, onChange, page, rowStart, seed } = usePagination();
  const { id } = useParams();
  const [state, actions] = useDataHandler();

  const fetchDocuments = async (page = 1) => {
    actions.loading();

    try {
      const { data } = await axiosInstance.get(
        `/api/admin/materials/${id}?page=${page}`
      );
      const { status, data: documents } = data;
      if (status) {
        const { data: list, last_page, from } = documents;
        actions.success(list.find(Boolean)?.material_docs);
        seed(from, last_page);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocuments(page);
  }, [page]);

  return {
    count,
    onChange,
    page,
    rowStart,
    state,
    fetchDocuments: () => fetchDocuments(page),
  };
};

export default useMaterial;
