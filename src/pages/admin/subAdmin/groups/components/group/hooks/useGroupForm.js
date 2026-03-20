import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

export const groupDefaultValues = {
  name: "",
  description: "",
  menu: [],
};

const schema = object().shape({
  name: string().required("errors.sub_admin.name.required"),
  description: string().required("errors.sub_admin.description.required"),
});

const useGroupForm = () => {
  return useForm({
    defaultValues: groupDefaultValues,
    resolver: yupResolver(schema),
  });
};

export default useGroupForm;
