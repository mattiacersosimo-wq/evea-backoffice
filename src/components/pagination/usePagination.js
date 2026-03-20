import { useState } from "react";
import useQueryParams from "src/hooks/useQueryParams";

const usePagination = () => {
  const { queryObject, addParam } = useQueryParams();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(() => {
    const { page } = queryObject;

    if (page) return parseInt(page);
    return 1;
  });
  const [rowStart, setRowStart] = useState(1);
  const seed = (totalPages, rowStart = 1) => {
    setCount(totalPages);
    setRowStart(rowStart);
  };

  const onChange = (_, page) => {
    setPage(page);
    addParam("page", page);
    sessionStorage.setItem("page", page);
  };

  return { count, page, seed, onChange, rowStart };
};

export default usePagination;
