import { useForm } from "react-hook-form";
import objectToQueryString from "src/utils/object-to-query-string";

const defaultValues = {
  user_id: "",
  active: "",
  rank_id: "",
  email: "",
  is_smartship_customer:""
};

const useFilter = (fetchData) => {
  const methods = useForm({
    defaultValues,
  });

  const onSubmit = async (inputData) => {
    fetchData(objectToQueryString(inputData));
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useFilter;
