import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";
import { getUrl } from "../config";
import serializeDate from "src/utils/serialize-date";

const useReport = (uriKey, { title, heading }) => {
  const { setData, methods } = useOutletContext();
  const filter = methods.watch();
  const [report, setReport] = useState();
  const [state, actions] = useDataHandler();
  const [sum, setSum] = useState();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const getReport = async (page = 1, filter = {}) => {
    const URI = `api/admin/${getUrl(uriKey)}`;
    actions.loading();
    try {
      const { data, status } = await axiosInstance(URI, {
        params: { ...filter, page },
      });
      if (status === 200) {
        const { sum } = data;
        setSum(sum);
        const { last_page, from, data: list } = data.data;
        seed(last_page, from);
        setReport(list);
        onChange(null, page);
        actions.success(list);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.error(err);
    }
  };

  useMemo(() => {
    setData({ title, heading, type: uriKey });
  }, [title, heading, uriKey]);

  useEffect(() => {
    const { start_date, end_date, ...rest } = filter;
    getReport(page, {
      start_date: serializeDate(start_date),
      end_date: serializeDate(end_date),
      ...rest,
    });
  }, [page]);

  return { state, report, getReport, count, onChange, page, rowStart, sum };
};

export default useReport;
