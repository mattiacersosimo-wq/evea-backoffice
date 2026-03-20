import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

export const defaultValues = {
  name: "",
  description: "",
};
const schema = object().shape({
  name: string().required("errors.blogs.categories.name.required"),
  description: string().required("errors.blogs.categories.desc.required"),
});
const useAddCategory = () => {
  return useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
};

export default useAddCategory;
