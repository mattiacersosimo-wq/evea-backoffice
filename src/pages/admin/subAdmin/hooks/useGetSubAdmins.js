import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useSubAdmins = (type) => {
  const [state, actions] = useDataHandler();
  const handleErrors = useErrors();
  const { count, onChange, page, rowStart, seed } = usePagination();

  const fetchData = async (page = 1) => {
    actions.loading();
    try {
      const { status, data } = await (
        await axiosInstance.get(`/api/admin/sub-admins?page=${page}`, {
          params: { type: type },
        })
      ).data;

      if (status) {
        const { last_page, from, data: subAdmins } = data;
        seed(last_page, from);
        actions.success(subAdmins);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.error(err);
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return { state, count, onChange, page, rowStart, fetchData };
};

export default useSubAdmins;
