import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { UrlSchema } from "src/pages/admin/store/material/material-add/hooks/useMaterialForm";
import { object, string } from "yup";

const Validator = object().shape({
  title: string().required("errors.brand.title.required"),
  description: string().required("errors.brand.description.required"),
  url: string().required("errors.brand.url.required"),
});
export const guidanceDefaultValues = {
  url: "",
  title: "",
  description: "",
  active: 1,
};
const useGuidanceForm = () => {
  return useForm({
    defaultValues: guidanceDefaultValues,
    resolver: yupResolver(Validator),
  });
};

export default useGuidanceForm;
