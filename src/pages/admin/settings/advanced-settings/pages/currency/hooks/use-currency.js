import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useWithdrawal = () => {
  const [state, actions] = useDataHandler();

  const fetchData = async () => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get("api/admin/currency");
      actions.success(data.data);
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };
  const handleErrors = useErrors();
  useEffect(() => {
    fetchData();
  }, []);

  return { fetchData, state };
};

const handleOpened = (temp, value) => {
  const { withdrawal_open_days } = temp;

  const itemIndex = withdrawal_open_days.findIndex((v) => value === v);
  if (itemIndex > -1) {
    temp.withdrawal_open_days.splice(itemIndex, 1);
    return temp;
  }

  temp.withdrawal_open_days.push(value);
  return temp;
};

const handleCoin = (temp, value) => {
  const { available_coins } = temp;

  const iValue = parseInt(value);
  const coins = available_coins;
  const itemIndex = coins.findIndex((v) => iValue === v);

  if (itemIndex > -1) {
    coins.splice(itemIndex, 1);
    temp.available_coins = coins;
    return temp;
  }
  coins.push(iValue);
  temp.available_coins = coins;
  return temp;
};

export default useWithdrawal;
