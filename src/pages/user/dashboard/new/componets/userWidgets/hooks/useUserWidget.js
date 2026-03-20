import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";

const useUserWidget = () => {
  const [data, setData] = useState({
    downline_count: 0,
    income: 0,
    balance: 0,
    total_payout: 0,
    pending_payout: 0,
    total_referals: 0,
    total_fund_credited: 0,
    my_subscriptions: 0,
    my_orders: 0,
  });
  const handleErrors = useErrors();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await fetchUser("dashboard/widgets");
        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default useUserWidget;
