import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import fetchUser from "src/utils/fetchUser";
import { PAYOUT_TYPE_IDS } from "src/utils/types";
import { number, object, string } from "yup";

const defaultValues = {
  amount: "",
  coin_id: "",
  payment_type: "",
};

const schema = (minimumWithdrawal) =>
  object().shape({
    amount: number()
      .typeError("errors.financial.payout.amount.type")
      .min(minimumWithdrawal, "errors.financial.payout.amount.min")
      .required("errors.financial.payout.amount.required"),

    coin_id: string().when("payment_type", {
      is: (v) => parseInt(v) === PAYOUT_TYPE_IDS.crypto,
      then: (schema) =>
        schema
          .required("errors.financial.payout.coin_id")
          .typeError("errors.financial.payout.coin_id"),
      otherwise: (schema) => schema.nullable(),
    }),
    payment_type: string()
      .typeError("errors.financial.payout.payment_type.required")
      .required("errors.financial.payout.payment_type.required"),
  });

const useRequestForm = (fetchData, minimumWithdrawal) => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema(minimumWithdrawal)),
  });

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    const { coin_id, ...rest } = inputData;
    Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));
    if (coin_id) reqData.append("coin_id", coin_id);
    try {
      const { status, message } = await (
        await fetchUser.post("payout-request", reqData)
      ).data;
      if (status) {
        enqueueSnackbar(message);
        methods.reset();
        fetchData();
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useRequestForm;
