import { useEffect } from "react";

import axiosInstance from "src/utils/axios";
import useArticleForm from "./useArticleForm";

const useGetArticleById = (articleId) => {
  const methods = useArticleForm();

  useEffect(() => {
    const fetchData = async () => {
      const { status, data } = await axiosInstance.get(
        `/api/admin/brand-get-started-articles/${articleId}`
      );
      if (status === 200) {
        const { content, active, section_id, menu_name, sort_order } =
          data.data;
        methods.reset({ content, active, section_id, menu_name, sort_order });
      }
    };
    if (articleId) fetchData();
  }, articleId);
  return methods;
};

export default useGetArticleById;
