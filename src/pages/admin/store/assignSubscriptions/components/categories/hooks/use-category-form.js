import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

const defaultValues = {
  name: "",
  description: "",
};

const schema = object().shape({
  name: string().required("Name is required"),
  description: string().required("Description is required"),
});
const useSubscriptionForm = () => {
  return useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
};

export default useSubscriptionForm;
