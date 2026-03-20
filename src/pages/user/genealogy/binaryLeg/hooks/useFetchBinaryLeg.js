import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useFetchBinaryLeg = () => {
  const [data, setData] = useState("");

  const fetchData = async () => {
    try {
      const { data, status } = await (
        await axiosInstance.get(`/api/binary-leg-settings`)
      ).data;

      if (status) {
        setData(data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return { data, setData };
};

export default useFetchBinaryLeg;
