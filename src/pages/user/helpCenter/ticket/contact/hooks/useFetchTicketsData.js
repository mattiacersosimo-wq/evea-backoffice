import { useEffect, useState } from "react";
import axiosInstance from "src/utils/fetchUser";

const useFetchTicketsData = (url) => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get(url);
      const { status, data: departments } = data;
      if (status) {
        setData(departments);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return data;
};

export default useFetchTicketsData;
