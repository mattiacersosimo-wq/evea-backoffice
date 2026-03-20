import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const useTeamPerformance = () => {
  const [state, actions] = useDataHandler();

  useEffect(() => {
    const fetchData = async () => {
      actions.loading();

      try {
        const { data } = await axiosInstance.get(
          "api/user/dashboard/team-performance"
        );
        if (data.status) {
          actions.success(data.data);
        } else {
          actions.success();
        }
      } catch (err) {
        actions.error();
      }
    };

    fetchData();
  }, []);

  return state;
};

export default useTeamPerformance;
