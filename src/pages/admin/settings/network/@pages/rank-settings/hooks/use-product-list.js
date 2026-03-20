import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useProductList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("api/admin/product-lists", {
          params: {
            type: "package",
          },
        });

        setData(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  return data;
};

export default useProductList;
