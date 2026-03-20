import React, { useEffect, useState } from 'react'
import axiosInstance from 'src/utils/axios';
import useErrors from "src/hooks/useErrors";
const useProductList = () => {
  const handleErrors = useErrors();
    const [product, setProduct] = useState([]);
    const fetchProduct = async () => {
      try {
      const { status, data } =await axiosInstance("/api/admin/product-list",
        {
          params: { is_combo: 0 },
        });
      if (status == 200) {
        setProduct(data.data);
      }
    } catch (err) {
      handleErrors(handleErrors);
    }
    };
    useEffect(() => {
      fetchProduct();
    }, []);
    return product;
  };

export default useProductList