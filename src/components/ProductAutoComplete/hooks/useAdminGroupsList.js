import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useAdminGroupsList = () => {
  const [adminGroupList, setAdminGroupList] = useState([]);
  const handleErrors = useErrors();
  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/sub-admin-user-groups-list`
      );
      const { status, data: groups } = data;
      if (status) {
        setAdminGroupList(groups);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return adminGroupList;
};

export default useAdminGroupsList;
