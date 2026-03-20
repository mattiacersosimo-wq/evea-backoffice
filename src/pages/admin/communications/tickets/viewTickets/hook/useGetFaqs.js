import React, { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetFaqs = () => {
  const [faqList, setFaqList] = useState([]);
  const fetchFaq = async () => {
    try {
      const { status, data } = await axiosInstance("/api/admin/faq");
      if (status) {
        setFaqList(data?.data?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchFaq();
  }, []);
  return faqList;
};

export default useGetFaqs;
