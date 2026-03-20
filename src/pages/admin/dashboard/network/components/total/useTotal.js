import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useTotal = () => {
  const handleErrors = useErrors();
  const [data, setData] = useState({
    total_payout: 0,
    total_network_bonus: 0,
    payout_mom: 0,
    network_bonus_mom: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const URI = "/api/admin/dashboard/overall-status";
        const { status, data } = await axiosInstance(URI);

        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default useTotal;
