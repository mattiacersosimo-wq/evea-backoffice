import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import moment from "moment";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";
import { getUrl } from "../config";

// month (1..12) + year -> start_date / end_date YYYY/MM/DD
// Backend FormRequests validano date_format:Y/m/d (slash, non dash).
const monthYearToRange = (month, year) => {
  if (!month || !year) return {};
  const m = moment().year(year).month(month - 1);
  return {
    start_date: m.startOf("month").format("YYYY/MM/DD"),
    end_date: m.endOf("month").format("YYYY/MM/DD"),
  };
};

const BASE_FIELDS = ["start_date", "end_date", "user_id", "page"];

const useReport = (uriKey, { title, heading }, extraFields = []) => {
  const { setData, methods } = useOutletContext();
  const filter = methods.watch();
  const [report, setReport] = useState();
  const [state, actions] = useDataHandler();
  const [sum, setSum] = useState();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const allowed = new Set([...BASE_FIELDS, ...extraFields]);

  const getReport = async (page = 1, filterArg = {}) => {
    const URI = `api/admin/${getUrl(uriKey)}`;
    actions.loading();
    const { month, year, ...rest } = filterArg;
    const params = { ...rest, ...monthYearToRange(month, year), page };
    // Whitelist by allowed fields + drop empty
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(
        ([k, v]) => allowed.has(k) && v !== "" && v !== null && v !== undefined
      )
    );
    try {
      const { data, status } = await axiosInstance(URI, { params: cleaned });
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
    }
  };

  useMemo(() => {
    setData({ title, heading, type: uriKey });
  }, [title, heading, uriKey]);

  useEffect(() => {
    getReport(page, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return { state, report, getReport, count, onChange, page, rowStart, sum };
};

export default useReport;
