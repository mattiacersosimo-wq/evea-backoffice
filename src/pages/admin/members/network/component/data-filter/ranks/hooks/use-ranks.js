import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useRanks = () => {
  const [ranks, setRanks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("api/admin/settings-rank-all");

        setRanks(data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return ranks;
};

export default useRanks;
