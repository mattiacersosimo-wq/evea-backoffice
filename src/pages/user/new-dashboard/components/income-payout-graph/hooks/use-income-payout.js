import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useIncomePayout = () => {
  const [state, setState] = useState({
    income: "",
    income_percentage: "",
    payout: "",
    payout_percentage: "",
  });

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/api/user/dashboard/income-payout"
      );

      setState({ ...data.data });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return state;
};

export default useIncomePayout;
