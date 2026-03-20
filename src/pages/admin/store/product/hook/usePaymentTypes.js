import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const usePaymentTypes = () => {
  const [types, setTypes] = useState([]);
  const handleErrors = useErrors();

  const fetchData = async () => {
    try {
      const { status, data } = await (
        await axiosInstance.get("api/admin/payment-types")
      ).data;
      if (status) {
        setTypes(data);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return types;
};

export default usePaymentTypes;
