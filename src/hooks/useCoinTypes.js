import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import fetchUser from "src/utils/fetchUser";
import useAuth from "./useAuth";

const useCoinTypes = () => {
  const [coinTypes, setCoinTypes] = useState([]);
  const { isAdmin } = useAuth();
  const handleErrors = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await (
          await axiosInstance(
            isAdmin ? "api/admin/available-coins" : "api/user/available-coins"
          )
        ).data;

        if (status) {
          setCoinTypes(data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };

    fetchData();
  }, []);

  return coinTypes;
};

export default useCoinTypes;
