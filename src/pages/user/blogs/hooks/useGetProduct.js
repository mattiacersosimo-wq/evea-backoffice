import React, { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetProduct = () => {

  const [product, setProduct] = useState([]);

  const fetchProduct = async () => {
    const { status, data } =await axiosInstance("/api/user/blogs-products-names");
    if (status == 200) {
      setProduct(data.data);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);
  return product;
};
export default useGetProduct;
