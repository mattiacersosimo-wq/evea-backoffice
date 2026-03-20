import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useProductList = (isCombo) => {
  const handleErrors = useErrors();
  const { product_type } = useParams();
  const [productList, setProductList] = useState([]);
  const fetchData = async () => {
    try {
      const { status, data } = await axiosInstance.get(`/api/product-list`, {
        params: {
          is_combo: isCombo ? 1 : 0,
          product_type: product_type ? product_type : "products",
        },
      });
      if (status === 200) {
        setProductList(data.data);
      }
    } catch (err) {
      handleErrors(handleErrors);
    }
  };

  useEffect(() => {
    fetchData();
  }, [product_type]);

  return productList;
};

export default useProductList;
