import { useEffect, useState } from "react";
import axiosInstance from "src/utils/fetchUser";
const UseFetchCategory = () => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get("support-tickets-categories");
      const { status, data: categories } = data;
      if (status) {
        setData(categories);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return data;
};

export default UseFetchCategory;
