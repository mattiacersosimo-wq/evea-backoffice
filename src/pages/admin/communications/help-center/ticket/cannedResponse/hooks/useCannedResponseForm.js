import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const Index = Yup.object().shape({
  title: Yup.string().required(
    "errors.help_center.canned_response.name.required"
  ),
  subject: Yup.string().required(
    "errors.help_center.canned_response.subject.required"
  ),
  message: Yup.string().required(
    "errors.help_center.canned_response.message.required"
  ),
});

const defaultValues = {
  title: "",
  subject: "",
  message: "",
  active: 1,
};

const useCannedResponseForm = () =>
  useForm({
    resolver: yupResolver(Index),
    defaultValues,
  });

export default useCannedResponseForm;
