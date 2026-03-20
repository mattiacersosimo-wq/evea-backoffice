import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useAvailableCoins = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          "api/admin/available-coins"
        );

        if (status === 200) {
          const coinList = data.data.map(({ id, name }) => ({ id, name }));
          setCoins(coinList);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return coins;
};

// Withdrawal Settings
export default useAvailableCoins;
