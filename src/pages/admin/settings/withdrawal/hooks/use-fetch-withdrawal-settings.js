import { useEffect } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useWithdrawalForm from "./use-withdrawal-form";

const useFetchWithdrawalSettings = () => {
  const methods = useWithdrawalForm();
  const { reset } = methods;
  const handleErrors = useErrors();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          "api/admin/withdrawal-settings"
        );
        if (status === 200) {
          const {
            id,
            min_amount,
            admin_fee_percent,
            available_coins,
            withdrawal_open_days,
            payment_type,
            description,
          } = data.data;

          reset({
            id,
            min_amount,
            admin_fee_percent,
            available_coins: [...new Set(available_coins)].map((id) =>
              parseInt(id)
            ),
            payment_type: [...new Set(payment_type)].map((id) => parseInt(id)),
            withdrawal_open_days,
            description,
          });
        }
      } catch (err) {
        handleErrors(err);
      }
    };

    fetchData();
  }, []);

  return methods;
};

export default useFetchWithdrawalSettings;
