import React, { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetCannedResponse = () => {
  const [cannedResponse, setCannedResponse] = useState([]);
  const fetchCannedResponse = async () => {
    try {
      const { status, data } = await axiosInstance(
        "/api/admin/support-ticket-canned-responses"
      );

      if (status) {
        setCannedResponse(data?.data?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchCannedResponse();
  }, []);
  return cannedResponse;
};

export default useGetCannedResponse;
