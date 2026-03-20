import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useAvailableUserPayouts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("api/user/available-payouts");
        setData(data?.data?.map(({ id, name }) => ({ id, name })));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return data;
};

export default useAvailableUserPayouts;
