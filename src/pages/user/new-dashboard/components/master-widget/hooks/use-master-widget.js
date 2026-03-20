import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

import BalanceIcon from "src/images/balance-outline.png";
import IncomeIcon from "src/images/income-outline.png";
import PayoutIcon from "src/images/payout-outline.png";

const useMasterWidget = () => {
  const [data, setData] = useState({
    income: {
      title: "user_dashboard.income",
      icon: IncomeIcon,
      amount: 0,
      percentage: 0,
    },
    expense: {
      title: "user_dashboard.payout",
      icon: PayoutIcon,
      amount: 0,
      percentage: 0,
    },
    balance: {
      title: "user_dashboard.balance",
      icon: BalanceIcon,
      amount: 0,
      percentage: 0,
    },
  });
  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get("/api/user/dashboard/income");

      const {
        balance,
        balance_percentage,
        expense,
        expense_percentage,
        income,
        income_percentage,
      } = Object.fromEntries(
        Object.entries(data.data).map(([k, v]) => [k, parseFloat(v)])
      );

      setData({
        income: {
          title: "user_dashboard.income",
          icon: IncomeIcon,
          amount: income,
          percentage: income_percentage,
        },
        expense: {
          title: "user_dashboard.payout",
          icon: PayoutIcon,
          amount: expense,
          percentage: expense_percentage,
        },
        balance: {
          title: "user_dashboard.balance",
          icon: BalanceIcon,
          amount: balance,
          percentage: balance_percentage,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data;
};

export default useMasterWidget;
