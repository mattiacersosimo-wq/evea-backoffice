import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetCurrentPackagePeriod = () => {
  const [currentPackagePeriod, setCurrentPackagePeriod] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          `api/user/affiliate-dashboard/dsb-current-package-period`,
        );
        if (status === 200) {
          setCurrentPackagePeriod(data.data);
        } else {
          setCurrentPackagePeriod([]);
        }
      } catch (err) {
        setCurrentPackagePeriod([]);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return currentPackagePeriod;
};

export default useGetCurrentPackagePeriod;
