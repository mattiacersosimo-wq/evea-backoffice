import { useForm } from "react-hook-form";

export const defaultValues = {
  headline: "",
  Subheading: "",
  features_and_benefits: "",
  objection_handling: "",
  social_proof: "",
  visuals: "",
};

const useTemplateForm = () => {
  const methods = useForm({
    defaultValues: defaultValues,
  });

  return methods;
};

export default useTemplateForm;
