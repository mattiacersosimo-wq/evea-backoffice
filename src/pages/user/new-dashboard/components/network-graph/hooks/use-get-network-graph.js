import moment from "moment";
import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";

const useGetNetworkGraph = () => {
  const [distribution, setDistribution] = useState([]);
  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get(
        "api/user/dashboard/network-joining",
        {
          params: {
            start_date: serializeDate(moment().startOf("year")),
            end_date: serializeDate(moment().endOf("month")),
          },
        }
      );
      setDistribution(
        Object.entries(data.data).map(([k, v]) => ({
          name: moment(k).format("MMM YYYY"),
          "User Count": v,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return distribution;
};

export default useGetNetworkGraph;
