import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const Index = Yup.object().shape({
  name: Yup.string().required("errors.help_center.department.name.required"),
  description: Yup.string().required(
    "errors.help_center.department.description.required"
  ),
  active: Yup.string().required(
    "errors.help_center.department.active.required"
  ),
  sort_order: Yup.string().required(
    "errors.help_center.department.sort_order.required"
  ),
});

const defaultValues = {
  name: "",
  description: "",
  active: "",
  sort_order: "",
};

const useDepartmentTicketForm = () => {
  return useForm({
    resolver: yupResolver(Index),
    defaultValues,
  });
};

export default useDepartmentTicketForm;
