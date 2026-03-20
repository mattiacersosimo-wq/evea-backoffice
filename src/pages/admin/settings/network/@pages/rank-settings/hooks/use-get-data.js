import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useGetData = () => {
  const [state, actions] = useDataHandler();
  const handleError = useErrors();

  const fetchData = async () => {
    try {
      const { status, data } = await axiosInstance("/api/admin/settings-rank");
      if (status === 200) {
        const { data: list } = data;
        if (Boolean(list.length)) {
          actions.success(
            list?.map(({ rank_package, ...data }) => ({
              ...data,
            }))
          );
          return;
        }
        actions.success();
      }
    } catch (err) {
      actions.error();
      handleError(err);
    }
  };
  useEffect(() => {
    actions.loading();
    fetchData();
  }, []);

  return [state, actions, fetchData];
};

export default useGetData;
