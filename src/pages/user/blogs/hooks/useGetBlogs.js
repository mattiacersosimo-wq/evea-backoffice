import { useEffect } from "react";
import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useQueryParams from "src/hooks/useQueryParams";
import axiosInstance from "src/utils/fetchUser";

const useGetBlogs = (filter = {}) => {
  const [state, actions] = useDataHandler();

  const { count, onChange, page, seed, rowStart } = usePagination();
  const fetchData = async (page = 1, filter = {}) => {
    actions.loading();
    try {
      const { data, status } = await (
        await axiosInstance.get("user-blogs", {
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
        actions.success();
      }
    } catch (err) {
      actions.error();
      console.log(err);
    }
  };

  const { queryObject } = useQueryParams();
  const { category_id, id } = queryObject;
  useEffect(() => {
    if (id) fetchData(page, { product_id: id });
    if (category_id) fetchData(page, { category_id });
    else if (!id && !category_id) fetchData(page, filter);
  }, [page]);

  return { state, fetchData, count, onChange, page, rowStart };
};

export default useGetBlogs;
