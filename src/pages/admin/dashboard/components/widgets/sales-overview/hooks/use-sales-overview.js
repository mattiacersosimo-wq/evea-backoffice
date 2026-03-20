import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const defaultState = {
  today: "",
  this_week: "",
  past_week: "",
  this_month: "",
  past_month: "",
  this_year: "",
};

const useSalesOverView = () => {
  const [data, setData] = useState(defaultState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          "api/admin/dashboard/sales-over-view"
        );

        setData(data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default useSalesOverView;
