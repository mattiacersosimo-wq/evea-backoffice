import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useGetStartedList = () => {
  const [getStartedList, setGetStartedList] = useState([]);
  const { count, onChange, page, seed, rowStart } = usePagination();
  const { enqueueSnackbar } = useSnackbar();
  const fetchGetStartedList = async (page = 1) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/brand-user-guidances?page=${page}`
      );
      const { status, data: userGuidance } = data;
      if (status) {
        const { last_page, data: list, from } = userGuidance;
        seed(last_page, from);
        setGetStartedList(list);
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchGetStartedList(page);
  }, [page]);

  return {
    getStartedList,
    fetchGetStartedList,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default useGetStartedList;
