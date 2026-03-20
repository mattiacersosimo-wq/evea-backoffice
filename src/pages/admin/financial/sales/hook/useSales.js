import { useEffect, useState } from "react";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const LatestSales = () => {
  const [list, setSalesList] = useState([]);
  const { count, onChange, page, rowStart, seed } = usePagination();
  const handleErrors = useErrors();
  const fetchProductHistoryList = async (query, page = 1) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/salespage`,
        {
          params: {
            query,
            page,
          },
        }
      );

      const { status, data: events } = data;

      if (status) {
        const {
          data: list,
          last_page,
          from,
        } = events;
        seed(last_page, from);
        setSalesList(list);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchProductHistoryList("", page);
  }, [page]);

  return {
    list,
    count,
    onChange,
    page,
    rowStart,
  };




};

export default LatestSales;
