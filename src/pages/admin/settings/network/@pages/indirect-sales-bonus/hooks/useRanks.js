import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useRanks = () => {
  const [ranks, setRanks] = useState([]);
  const fetchRanks = async () => {
    try {
      const { data, status } = await axiosInstance.get("api/admin/ranks");
      if (status === 200) {
        setRanks(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchRanks();
  }, []);
  return ranks;
};

export default useRanks;
