import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";

const useMyOrders = (filter) => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const fetchData = async (page = 1, filter) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/my-orders?page=${page}`,
        {
          params: { ...filter },
        }
      );
      const { status, data: report } = data;
      if (status) {
        const { last_page, data: list, from } = report;
        seed(last_page, from);
        if (Boolean(list.length)) {
          onChange(null, page);
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
    const { start_date, end_date } = filter;
    fetchData(page, {
      ...filter,
      start_date: serializeDate(start_date),
      end_date: serializeDate(end_date),
    });
  }, [page]);

  return { state, fetchData, count, onChange, page, rowStart };
};

export default useMyOrders;
