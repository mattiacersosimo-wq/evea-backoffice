import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const useTopSellingProducts = () => {
  const [state, actions] = useDataHandler();

  useEffect(() => {
    actions.loading();
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          "api/admin/dashboard/top-selling-product"
        );
        actions.success(data.data);
      } catch (err) {
        actions.error();
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return state;
};

export default useTopSellingProducts;
