import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetRankSummary = () => {
  const [rankSummary, setRankSummary] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          `api/user/affiliate-dashboard/rank-summery`
        );
        if (status === 200) {
          setRankSummary(data.data);
        } else {
          setRankSummary([]);
        }
      } catch (err) {
        setRankSummary([]);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return rankSummary;
};

export default useGetRankSummary;
