import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";

import axiosInstance from "src/utils/axios";

const useBlog = (isDraft) => {
  const [state, actions] = useDataHandler();
  const [blogList, setBlogList] = useState([]);
  const { count, onChange, page, seed, rowStart } = usePagination();

  const fetchBlogList = async (page = 1, filter = {}) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(`/api/admin/blogs`, {
        params: {
          page,
          ...filter,
        },
      });
      const { status, data: blogs } = data;
      if (status) {
        const { last_page, data: list, from } = blogs;
        seed(last_page, from);
        setBlogList(list);
        actions.success(list);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlogList(page, { is_draft: isDraft ? 1 : 0, scope: -1 });
  }, [page, isDraft]);

  return { state, blogList, fetchBlogList, count, onChange, page, rowStart };
};

export default useBlog;
