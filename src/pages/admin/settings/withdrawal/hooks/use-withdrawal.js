import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useFetchWithdrawalSettings from "./use-fetch-withdrawal-settings";

const useWithdrawal = () => {
  const methods = useFetchWithdrawalSettings();
  const { setError } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    const { withdrawal_open_days, available_coins, payment_type, ...rest } =
      inputData;
    const reqData = new FormData();
    Object.entries(rest).forEach(([k, v]) => reqData.append(k, v));
    reqData.append(
      "withdrawal_open_days",
      `[${withdrawal_open_days.map((day) => `"${day}"`)}]`
    );

    available_coins.forEach((item) =>
      reqData.append("available_coins[]", item)
    );
    payment_type.forEach((item) => reqData.append("payment_type[]", item));
    try {
      const { status, data } = await axiosInstance.post(
        "/api/admin/withdrawal-settings",
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      if (err.errors) {
        Object.entries(err.errors).forEach(([k, v]) => {
          setError(k, { message: v });
        });
      }
    }
  };

  return {
    methods,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};

export default useWithdrawal;
