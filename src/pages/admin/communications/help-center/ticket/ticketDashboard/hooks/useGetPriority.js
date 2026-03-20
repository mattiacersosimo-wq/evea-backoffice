import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetPriority = () => {
  const [priority, setPriority] = useState([]);
  const fetchPriority = async () => {
    try {
      const { data, status } = await axiosInstance(
        "/api/admin/support-ticket-priorities"
      );
      if (status) {
        setPriority(data?.data?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPriority();
  }, []);
  return priority;
};
export default useGetPriority;
