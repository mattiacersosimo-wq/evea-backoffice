import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useWidgetData = () => {
  const [data, setData] = useState({
    balance: "",
    credits: "",
    expense: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          "api/admin/deposit-wallet-data"
        );
        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return data;
};

export default useWidgetData;
