import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const Index = Yup.object().shape({
  name: Yup.string().required("errors.help_center.categories.name.required"),
  description: Yup.string().required(
    "errors.help_center.categories.description.required"
  ),
  active: Yup.string().required(
    "errors.help_center.categories.active.required"
  ),
  // sort_order: Yup.number()
  //   .typeError("Sort Order is required")
  //   .required("Sort Order is required"),
});

const defaultValues = {
  name: "",
  description: "",
  active: "",
  // sort_order: "",
};

const useCategoriesForm = () => {
  return useForm({
    resolver: yupResolver(Index),
    defaultValues,
  });
};

export default useCategoriesForm;
