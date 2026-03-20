import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { number, object, string } from "yup";

const schema = object().shape({
  amount: number()
    .min(1)
    .typeError("Should be a number")
    .required("Enter a amount"),
  period_month: string().required("Choose a period"),
  business_builder_id: string().required("Select a business builder"),
});

const defaultValues = {
  amount: "",
  period_month: "",
  coin_id: "",
  business_builder_id: "",
};

const usePayNowForm = () => {
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });

  const reset = () => methods.reset(defaultValues);

  return { methods, reset };
};

export default usePayNowForm;
