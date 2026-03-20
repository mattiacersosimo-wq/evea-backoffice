import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object().shape({
  description: Yup.string().required(
    "errors.help_center.add_ticket.description.required"
  ),
  priority_id: Yup.string().required(
    "errors.help_center.add_ticket.priority_id.required"
  ),
  department_id: Yup.string().required(
    "errors.help_center.add_ticket.department_id.required"
  ),
  category_id: Yup.string().required(
    "errors.help_center.add_ticket.category_id.required"
  ),
  subject: Yup.string().required(
    "errors.help_center.add_ticket.subject.required"
  ),
  user_id: Yup.string()
    .required("errors.help_center.add_ticket.user_id.required")
    .typeError("errors.help_center.add_ticket.user_id.required"),
  status: Yup.string().required(
    "errors.help_center.add_ticket.status.required"
  ),
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
const useTicketForm = () => {
  return useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
};

export default useTicketForm;
