import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const useLatestSales = () => {
  const [state, actions] = useDataHandler();

  useEffect(() => {
    const fetchData = async () => {
      actions.loading();
      try {
        const { data, status } = await axiosInstance(
          "api/admin/dashboard/latest-sales"
        );
        if (status === 200) {
          actions.success(data.data);
        }
      } catch (err) {
        actions.error();
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return state;
};

export default useLatestSales;
