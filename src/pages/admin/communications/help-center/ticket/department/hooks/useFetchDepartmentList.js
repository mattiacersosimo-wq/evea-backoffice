import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import usePagination from "src/components/pagination/usePagination";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const useFetchDepartmentList = () => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const { enqueueSnackbar } = useSnackbar();
  const fetchDepartmentList = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/support-ticket-department?page=${page}`
      );

      const { status, data: departments } = data;

      if (status) {
        const { data: list, last_page, from } = departments;
        seed(last_page, from);
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
    fetchDepartmentList(page);
  }, [page]);

  return {
    state,
    fetchDepartmentList,
    page,
    count,
    onChange,
    rowStart,
  };
};

export default useFetchDepartmentList;
