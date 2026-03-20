import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const usePackages = () => {
  const [packages, setPackages] = useState([]);
  const fetchPackages = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        "api/admin/package-names",
      );
      if (status === 200) {
        setPackages(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchPackages();
  }, []);
  return packages;
};

export default usePackages;
