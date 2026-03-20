import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const useGetTeamPerformance = (URL = "") => {
  const [state, actions] = useDataHandler();

  useEffect(() => {
    const fetchData = async () => {
      actions.loading();
      try {
        const { data } = await axiosInstance.get(URL);

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

export default useGetTeamPerformance;
