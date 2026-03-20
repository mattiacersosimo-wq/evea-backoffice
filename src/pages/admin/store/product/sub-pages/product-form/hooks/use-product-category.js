import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useProductCategory = () => {
  const [dataProductCategory, setDataProductCategory] = useState([]);

  const fetchDataProductCategory = async () => {
    const { status, data } = await axiosInstance.get(
      "/api/admin/product-categories-list"
    );
    if (status === 200 && Boolean(data.data.length)) {
      setDataProductCategory(data.data);
      return;
    }

    setDataProductCategory([]);
  };

  useEffect(() => {
    fetchDataProductCategory();
  }, []);

  return dataProductCategory;
};

export default useProductCategory;
