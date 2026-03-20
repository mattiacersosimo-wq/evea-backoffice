import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuth from "src/hooks/useAuth";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useUserCoinAddress = () => {
  const [coinAddress, setCoinAddress] = useState([]);
  const handleErrors = useErrors();
  const { isAdmin } = useAuth();
  const { mid } = useParams();
  const URL = isAdmin
    ? `api/user-coin-address/${mid}`
    : "api/user/user-coin-address";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, status } = await axiosInstance(URL);
        if (status === 200) {
          setCoinAddress(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };

    fetchData();
  }, []);

  return coinAddress;
};

export default useUserCoinAddress;
