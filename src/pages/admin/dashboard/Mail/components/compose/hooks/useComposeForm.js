import { useForm } from "react-hook-form";
const defaultValues = {
  to_users_id: [],
  subject: "",
  message: "",
  attachments: "",
};
const useComposeForm = () => {
  const methods = useForm({
    defaultValues,
  });

  return methods;
};
export default useComposeForm;
