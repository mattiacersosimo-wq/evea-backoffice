import React, { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetPriority = () => {
  const [priorities, setPriorities] = useState([]);
  const fetchPriorities = async () => {
    try {
      const { status, data } = await axiosInstance(
        "/api/admin/support-ticket-priorities"
      );
      if (status) {
        setPriorities(data?.data?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPriorities();
  }, []);
  return priorities;
};

export default useGetPriority;
