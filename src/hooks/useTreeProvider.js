import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";
import transformData from "src/utils/transformData";

const useTreeProvider = () => {
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const fetchUserData = async (username) => {
    const reqData = new FormData();
    reqData.append("username", username);
    try {
      const { status, data } = await (
        await axiosInstance.post(`api/user-info`, reqData)
      ).data;

      if (status) {
        const serializedData = transformData(data);
        setUserInfo(serializedData);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleUsernameChange = (v) => {
    setUsername(v);
  };

  useEffect(() => {
    if (username) fetchUserData(username);
  }, [username]);

  return { userInfo, username, handleUsernameChange };
};

export default useTreeProvider;
