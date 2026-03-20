import { useForm } from "react-hook-form";
import axiosInstance from "src/utils/axios";

export const useCurrencyForm = () => {
  return useForm({
    defaultValues: {
      name: "",
      code: "",
      symbol: "",
      exchange_rate: "",
      // is_default: 0,
      is_enable: 1,
    },
  });
};

const useGetCurrencyById = () => {
  const methods = useCurrencyForm();
  const { reset } = methods;
  const fetchCurrency = async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/currency/${id}`);

      const currency = data.data?.find(Boolean);
      if (currency) {
        reset({
          name: currency.name,
          code: currency.code,
          symbol: currency.symbol,
          is_default: currency.is_default,
          is_enable: currency.is_enable,
          exchange_rate: currency.exchange_rate,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { methods, fetchCurrency };
};

export default useGetCurrencyById;
