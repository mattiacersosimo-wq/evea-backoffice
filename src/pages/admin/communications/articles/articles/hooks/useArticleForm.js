import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const Schema = Yup.object().shape({
  title: Yup.string().required("errors.articles.add.title.required"),
  description: Yup.string().required(
    "errors.articles.add.description.required"
  ),
  category_id: Yup.string().required(
    "errors.articles.add.category_id.required"
  ),
});

const defaultValues = {
  title: "",
  description: "",
  category_id: "",
  active: 1,
};

const useArticleForm = () => {
  return useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });
};

export default useArticleForm;
