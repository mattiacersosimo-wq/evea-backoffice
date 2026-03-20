import React, { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetProductCategory = () => {
  const [product, setProduct] = useState([]);

  const fetchProduct = async () => {
    const { status, data } = await axiosInstance(
      "/api/user/product-categories"
    );

    if (status == 200) {
      setProduct(data.data);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);
  return product;
};
export default useGetProductCategory;
