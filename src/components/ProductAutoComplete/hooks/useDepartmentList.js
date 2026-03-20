import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useDepartmentList = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const fetchData = async () => {
    try {
      const { status, data } = await axiosInstance.get(
        `/api/admin/department-list`
      );
      if (status === 200) {
        if (data.status) {
          setDepartmentList(data.departments);
        } else {
          // enqueueSnackbar(data.message);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  return departmentList;
};

export default useDepartmentList;
