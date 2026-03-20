import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useUsersList = (type = null, isKyc) => {
  const [usersList, setUsersList] = useState([]);
  const fetchData = async () => {
    try {
      const { status, data } = await axiosInstance.post(
        isKyc
          ? `api/admin-usernames/autocomplete`
          : `/api/username/autocomplete`,
        {},
        {
          params: {
            type,
          },
        }
      );
      if (status === 200) {
        setUsersList(data.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  return usersList;
};

export default useUsersList;
