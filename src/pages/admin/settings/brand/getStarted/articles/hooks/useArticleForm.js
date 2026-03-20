import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export const articleDefaultValues = {
  section_id: "",
  menu_name: "",
  content: "",
  sort_order: "",
  active: 1,
};

const ArticleSchema = Yup.object().shape({
  section_id: Yup.string().required("errors.brand.section_id.required"),
  menu_name: Yup.string().required("errors.brand.menu_name.required"),
  content: Yup.string().required("errors.brand.description.required"),
  sort_order: Yup.number()
    .typeError("errors.brand.sort_order.type")
    .min(1)
    .required("errors.brand.sort_order.required"),
});

const useArticleForm = () => {
  return useForm({
    resolver: yupResolver(ArticleSchema),
    articleDefaultValues,
  });
};

export default useArticleForm;
