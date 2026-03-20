import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";
import { mixed, number, object } from "yup";

const defaultValues = {
  wallet: "",
  amount: "",
  user_id: "",
  note: "",
};

const schema = object().shape({
  wallet: mixed()
    .oneOf(
      ["ewallet", "deposit_wallet"],
      "errors.financial.fund_transfer.wallet.required"
    )
    .required("errors.financial.fund_transfer.wallet.required"),

  amount: number()
    .min(1, "errors.financial.fund_transfer.amount.min")
    .typeError("errors.financial.fund_transfer.amount.type")
    .required("errors.financial.fund_transfer.amount.required"),

  user_id: number()
    .typeError("errors.financial.fund_transfer.user_id.type")
    .required("errors.financial.fund_transfer.user_id.required"),
});

const useFundForm = (refetch) => {
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );
    try {
      const { message, status } = await (
        await fetchUser.post("fund-transfer", reqData)
      ).data;

      if (status) {
        enqueueSnackbar(message);
        methods.reset(defaultValues);
        refetch();
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      console.error(err);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useFundForm;
