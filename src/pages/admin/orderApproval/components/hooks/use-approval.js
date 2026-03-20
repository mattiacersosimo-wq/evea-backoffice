import { useSnackbar } from "notistack";
import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";

import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";

const useApproval = (filter) => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const fetchData = async (page = 1, filter) => {
    try {
      const { status, data } = await axiosInstance.get(
        `api/admin/pending-payment`,
        {
          params: {
            page,
            ...filter,
          },
        }
      );

      if (status) {
        const { last_page, data: list, from } = data?.data;
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
    const { start_date, end_date } = filter;
    fetchData(page, {
      ...filter,
      start_date: serializeDate(start_date),
      end_date: serializeDate(end_date),
    });
  }, [page]);

  return { state, fetchData, rowStart, count, onChange, page };
};

export default useApproval;
