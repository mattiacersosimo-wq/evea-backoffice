import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { number, object, string } from "yup";

const schema = object().shape({
  user_id: string().required("errors.financial.fund_credit.user_id.required"),
  amount: number()
    .typeError("errors.financial.fund_credit.amount.type")
    .required("errors.financial.fund_credit.amount.required"),
  wallet_type: string().required(
    "errors.financial.fund_credit.wallet_type.required"
  ),
});

const defaultValues = {
  user_id: "",
  amount: "",
  wallet_type: "",
  notes: "",
};

const useFormFundForm = () => {
  return useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
};

export default useFormFundForm;
