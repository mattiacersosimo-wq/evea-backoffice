import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useMaterials = () => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const fetchData = async (pageNumber = 1) => {
    try {
      const { data } = await axiosInstance(
        `/api/admin/materials?page=${pageNumber}`
      );
      const { status, data: materials } = data;
      if (status) {
        const { last_page, data: list, from } = materials;
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
    fetchData(page);
  }, [page]);

  return { state, count, onChange, page, rowStart };
};

export default useMaterials;
