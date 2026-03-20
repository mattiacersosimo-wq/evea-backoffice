import React, { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetCategory = () => {
  const [categoryList, setCategoryList] = useState([]);
  const fetchCategory = async () => {
    try {
      const { data, status } = await axiosInstance(
        "/api/admin/support-ticket-categories-list"
      );
      if (status) {
        setCategoryList(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);
  return categoryList;
};

export default useGetCategory;
