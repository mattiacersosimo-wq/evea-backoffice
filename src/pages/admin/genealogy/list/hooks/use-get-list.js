import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";

const useGetList = (filter) => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const fetchData = async (page = 1, filter) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get("api/admin/genealogy-list", {
        params: {
          page,
          ...filter,
        },
      });
      const { status, data: list } = data;

      if (status) {
        const { last_page, from, data: treeList } = list;
        seed(last_page, from);
        onChange(null, page);
        actions.success(treeList);
      } else {
        actions.success([]);
      }
    } catch (err) {
      console.log(err);
      actions.error();
    }
  };
  useEffect(() => {
    const { start_date, end_date } = filter;
    fetchData(page, {
      ...filter,
      start_date: serializeDate(start_date),
      end_date: serializeDate(end_date),
    });
  }, [page]);

  return { state, fetchData, count, onChange, page, rowStart };
};

export default useGetList;
