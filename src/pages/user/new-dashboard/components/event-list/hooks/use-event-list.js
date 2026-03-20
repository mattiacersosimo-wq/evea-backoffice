import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const useEventList = (date) => {
  const [state, actions] = useDataHandler();

  useEffect(() => {
    const fetchData = async (date) => {
      actions.loading();
      try {
        const { data } = await axiosInstance.get("api/user/events-list", {
          params: { start_date: date, end_date: date },
        });
        actions.success(data.data);
      } catch (err) {
        actions.error();
        console.error(err);
      }
    };

    fetchData(date);
  }, [date]);

  return state;
};

export default useEventList;
