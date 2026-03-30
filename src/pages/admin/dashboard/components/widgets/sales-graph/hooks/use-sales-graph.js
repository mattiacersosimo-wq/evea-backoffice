import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";
const useSalesGraph = () => {
  const [data, setData] = useState([]);

  const [dateRange, updateDate] = useState({
    start_date: serializeDate(moment().startOf("week")),
    end_date: serializeDate(moment()),
  });
  const { start_date, end_date } = dateRange;

  useEffect(() => {
    const fetchData = async (filter) => {
      try {
        const { data } = await axiosInstance.get(
          "api/admin/dashboard/sales-over-the-time",
          {
            params: { ...filter },
          }
        );

        const { package: packages, product: products } = data.data || {};
        const chartData = Object.entries(packages).map(([k, v]) => {
          return {
            name: moment(k).format("DD"),
            Package: v,
            Product: products[k],
          };
        });
        setData(chartData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData({
      start_date,
      end_date,
    });
  }, [start_date, end_date]);

  const onDateChange = (name) => (v) => {
    updateDate({
      ...dateRange,
      [name]: serializeDate(moment(dayjs(v).format("MM/DD/YYYY"))),
    });
  };

  return { data, onDateChange, dateRange };
};

export default useSalesGraph;
