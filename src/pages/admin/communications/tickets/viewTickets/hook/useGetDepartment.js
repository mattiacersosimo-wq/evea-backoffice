import React, { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const fetchDepartments = async () => {
    try {
      const { status, data } = await axiosInstance(
        "/api/admin/department-list"
      );
      if (status) {
        setDepartments(data.departments);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, []);
  return departments;
};

export default useGetDepartment;
