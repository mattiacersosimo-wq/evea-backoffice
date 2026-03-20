import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useQuestionList = () => {
  const [state, actions] = useDataHandler();
  const [questionList, setQuestionList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { pid } = useParams();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const fetchQuestionList = async (page = 1) => {
    actions.loading();
    try {
      const { status, data } = await axiosInstance.get(
        `/api/admin/product-question/${pid}?page=${page}`
      );

      if (status === 200) {
        const { last_page, from, data: list } = data?.data;
        seed(last_page, from);
        setQuestionList(list);
        actions.success(list);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      Object.values(err).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  useEffect(() => {
    fetchQuestionList(page);
  }, [page]);

  return {
    questionList,
    fetchQuestionList,
    count,
    onChange,
    rowStart,
    page,
    state,
  };
};

export default useQuestionList;
