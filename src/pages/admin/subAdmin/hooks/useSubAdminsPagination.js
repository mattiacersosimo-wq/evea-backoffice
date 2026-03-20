import { useEffect } from "react";
import { useOutletContext } from "react-router";
import usePagination from "src/components/pagination/usePagination";
import useTimeOut from "src/components/timeout/hooks/useTimeOut";

const useSubAdminsPagination = (type) => {
  const { data, fetchData } = useOutletContext();
  const { last_page, from, data: list } = data[type];
  const [timeout, setTimeOut] = useTimeOut();

  const handleFetch = async (page) => {
    setTimeOut(false);
    fetchData(page);
  };

  const { count, onChange, page, rowStart, seed } = usePagination();

  useEffect(() => {
    seed(last_page, from);
  }, [last_page, from]);

  useEffect(() => {
    handleFetch(page);
  }, [page]);

  return {
    timeout,
    data: list,
    fetchData,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default useSubAdminsPagination;
