import { useForm } from "react-hook-form";

const defaultValues = {
  id: "",
  min_amount: "",
  admin_fee_percent: "",
  available_coins: [],
  payment_type: [],
  withdrawal_open_days: [],
  description: "",
};

const useWithdrawalForm = () => {
  const methods = useForm({ defaultValues });
  return methods;
};

export default useWithdrawalForm;
