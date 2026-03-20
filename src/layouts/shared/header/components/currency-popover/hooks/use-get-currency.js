import { useCurrency } from "src/store/currency";
import axiosInstance from "src/utils/axios";

const useGetCurrency = () => {
  const { setCurrency } = useCurrency();

  const fetchCurrency = async (isAdminUser) => {
    const URL = isAdminUser ? "api/admin/currency" : "api/user/currency";

    try {
      const { data } = await axiosInstance(URL);
      if (data.data)
        setCurrency((state) => {
          return { ...state, list: data.data };
        });
    } catch (err) {
      console.log(err);
    }
  };

  return fetchCurrency;
};

export default useGetCurrency;
