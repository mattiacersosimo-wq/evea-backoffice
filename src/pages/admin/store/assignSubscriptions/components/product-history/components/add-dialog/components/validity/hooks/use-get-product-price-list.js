import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useGetProductPriceList = () => {
  const { watch } = useFormContext();
  const productId = watch("product_id");
  const handleErrors = useErrors();
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          `api/admin/product-price-list/${productId}`
        );
        if (status === 200) {
          setPrices(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    if (productId) fetchData();
  }, [productId]);

  return prices;
};

export default useGetProductPriceList;
