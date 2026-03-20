import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetPaymentTypes = (openMenu) => {
  const [recurringTypes, setRecurringTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          "api/user/recurring-product-payment-types"
        );
        setRecurringTypes(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (openMenu) fetchData();
  }, [openMenu]);

  return recurringTypes;
};

export default useGetPaymentTypes;
