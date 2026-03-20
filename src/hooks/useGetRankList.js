import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";
import useAuth from "./useAuth";

const useGetRankList = () => {
  const [ranks, setRanks] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const URL = isAdmin ? "admin" : "user";
      try {
        const { status, data } = await axiosInstance.get(
          `api/${URL}/settings-rank-all`
        );
        if (status === 200) {
          setRanks(data.data);
        } else {
          setRanks([]);
        }
      } catch (err) {
        setRanks([]);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return ranks;
};

export default useGetRankList;
