import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/fetchUser";

const useFetchSubscription = () => {
  const [state, actions] = useDataHandler();
  const handleErrors = useErrors();
  const { count, onChange, page, rowStart, seed } = usePagination();
  const fetchData = async (page = 1, filter = {}) => {
    actions.loading();
    try {
      const { data, status } = await (
        await axiosInstance.get(`my-subscriptions`, {
          params: { page, ...filter },
        })
      ).data;
      if (status) {
        const { last_page, from, data: subscriptions } = data;
        seed(last_page, from);
        actions.success(subscriptions);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };
  useEffect(() => {
    fetchData(page);
  }, [page]);

  return { state, count, onChange, page, rowStart, fetchData };
};

export default useFetchSubscription;
