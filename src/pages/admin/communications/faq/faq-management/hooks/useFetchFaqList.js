import { useEffect, useState } from "react";
import usePagination from "src/components/pagination/usePagination";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const useFetchFaqList = () => {
  const [faqList, setFaqList] = useState([]);
  const [state, actions] = useDataHandler();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const fetchFaqList = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(`/api/admin/faq?page=${page}`);
      const { status, data: faqs } = data;
      if (status) {
        const { data: list, from, last_page } = faqs;
        seed(last_page, from);
        if (Boolean(list.length)) {
          onChange(null, page);
          actions.success(list);
          return;
        }
        actions.success();
      }
      if (status == false) {
        fetchFaqList((page = 1));
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFaqList(page);
  }, [page]);

  return { state, faqList, fetchFaqList, count, onChange, page, rowStart };
};

export default useFetchFaqList;
