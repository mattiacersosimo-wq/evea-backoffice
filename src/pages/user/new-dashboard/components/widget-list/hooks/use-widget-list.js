import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useWidgetList = () => {
  const [data, setData] = useState({
    total_referrals: 0,
    downline_team_count: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("api/user/dashboard/widget");
        setData(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default useWidgetList;
