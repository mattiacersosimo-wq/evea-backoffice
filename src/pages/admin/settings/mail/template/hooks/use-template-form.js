import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

const defaultValues = {
  content: "",
  subject: "",
  email_template_id: "",
};

const schema = object().shape({
  content: string().required("content is required"),
  subject: string().required("subject is required"),
});
const useTemplateForm = () => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  return methods;
};

export default useTemplateForm;
