import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";

const useReferrals = (filter) => {
  const { enqueueSnackbar } = useSnackbar();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const [state, actions] = useDataHandler();
  const [globalStats, setGlobalStats] = useState({ total: 0, count: 0 });

  const fetchData = async (page = 1, filter) => {
    actions.loading();
    try {
      const { data } = await axiosInstance("api/user/pending_ewallet", {
        params: { page, ...filter },
      });

      const { status, data: result, global_total, global_count } = data;

      if (status) {
        const { last_page, from, data: list } = result;
        onChange(null, page);
        actions.success(list);
        seed(last_page, from);
        setGlobalStats({ total: global_total || 0, count: global_count || 0 });
        return;
      }

      actions.success([]);
    } catch (err) {
      actions.error();
      enqueueSnackbar("Errore nel caricamento dei dati", { variant: "error" });
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
  }, [page, filter]);

  return { state, fetchData, count, onChange, page, rowStart, globalStats };
};

export default useReferrals;
