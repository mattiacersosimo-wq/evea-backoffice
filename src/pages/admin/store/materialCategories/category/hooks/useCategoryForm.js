import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const Index = Yup.object().shape({
  name: Yup.string().required("errors.material_categories.name.required"),
  sort_order: Yup.string().required(
    "errors.material_categories.sort_order.required"
  ),
});

const defaultValues = {
  name: "",
  sort_order: "",
  active: 1,
  type: "product",
};

const useCategoriesForm = () => {
  return useForm({
    resolver: yupResolver(Index),
    defaultValues,
  });
};

export default useCategoriesForm;
