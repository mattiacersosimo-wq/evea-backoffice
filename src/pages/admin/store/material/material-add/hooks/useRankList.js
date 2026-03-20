import React, { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useRankList = () => {
  const [rank, setRank] = useState([]);
  const fetchRank = async () => {
    const { status, data } = await axiosInstance("/api/admin/settings-rank");
    if (status == 200) {
      setRank(data.data);
    }
  };
  useEffect(() => {
    fetchRank();
  }, []);
  return rank;
};

export default useRankList;
