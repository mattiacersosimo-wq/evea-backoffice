import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const Index = Yup.object().shape({
  descriptions: Yup.string().required("Description Name is required"),
  priority_id: Yup.string().required("Priority is required"),
  department_id: Yup.string().required("Department is required"),
  category_id: Yup.string().required("Category is required"),
  subject: Yup.string().required("Subject is required"),
  user_id: Yup.string()
    .required("User is required")
    .typeError("User is required"),
  status: Yup.string().required("Status is required"),
});

const defaultValues = {
  user_id: "",
  subject: "",
  description: "",
  priority_id: "",
  department_id: "",
  category_id: "",
  status: "",
  attachments_url: "",
  active: 1,
};

const useTicketForm = () =>
  useForm({
    resolver: yupResolver(Index),
    defaultValues,
  });

export default useTicketForm;
