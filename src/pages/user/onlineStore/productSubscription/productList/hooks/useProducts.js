import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/fetchUser";

const useGetBlogs = () => {
  const [state, actions] = useDataHandler();
  const [filterIds, setFilterIds] = useState([]);
  const { product_type } = useParams();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const fetchData = async (page = 1, filter = {}) => {
    actions.loading();
    try {
      const { data, status } = await (
        await axiosInstance.get("online-store", {
          params: {
            page,
            ...filter,
          },
        })
      ).data;
      if (status) {
        const { last_page, from, data: blogs } = data;
        if (Boolean(blogs.length)) {
          seed(last_page, from);
          actions.success(blogs);
          return;
        }
        actions.success([]);
      }
      actions.success([]);
    } catch (err) {
      actions.error();
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData(page, {
      product_type,
    });
  }, [page, product_type]);

  return {
    state,
    fetchData,
    count,
    onChange,
    page,
    rowStart,
    filterIds,
    setFilterIds,
  };
};

export default useGetBlogs;
