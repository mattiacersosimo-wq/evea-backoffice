import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useWidgetData = () => {
  const [data, setData] = useState({
    total_sales: "",
    total_sales_last_month: "",
    total_expense: "",
    total_expense_last_month: "",
    total_profit: "",
    total_profit_last_month: "",
    network_bonus: "",
    balance: "",
    total_customers: "",
    active_customers: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          "api/admin/dashboard/monthly-overall"
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

  return data;
};

export default useWidgetData;
