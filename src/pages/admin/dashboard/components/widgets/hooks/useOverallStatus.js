import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useOverallStatus = () => {
  const [series, setSeries] = useState([0, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          "api/admin/dashboard/overall-status"
        );
        if (status === 200) {
          const { payout, sales } = data.data;
          setSeries([
            parseInt(parseInt(payout || 0)),
            parseInt(parseInt(sales || 0)),
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return series;
};

export default useOverallStatus;
