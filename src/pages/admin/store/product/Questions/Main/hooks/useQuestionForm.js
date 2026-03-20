import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const Index = Yup.object().shape({
  title: Yup.string().required("errors.product_question.title.required"),
  description: Yup.string().required(
    "errors.product_question.description.required"
  ),
});

const defaultValues = {
  title: "",
  description: "",
};

const useQuestionForm = () => {
  return useForm({
    resolver: yupResolver(Index),
    defaultValues,
  });
};

export default useQuestionForm;
