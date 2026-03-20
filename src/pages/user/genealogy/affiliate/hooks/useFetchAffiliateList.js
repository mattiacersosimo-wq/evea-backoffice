import { useEffect, useState } from "react";
import axiosInstance from "src/utils/fetchUser";

const defaultValues = {
  current_rank: "",
  current_week_rank: "",
  highest_rank_acheved: "",
  last_week_rank: "",
  left_team: "",
  network_bonus: "",
  next_rank: "",
  personal_sales_bv: "",
  referal_bonus: "",
  referrals_count: "",
  right_team: "",
  team_sales_bv: "",
  weekly_binary_bonus: "",
};

const useFetchAffiliateList = () => {
  const [data, setData] = useState(defaultValues);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, status } = await await axiosInstance.get(
          `affiliate-dashboard`
        );

        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  return { ...data };
};

export default useFetchAffiliateList;
