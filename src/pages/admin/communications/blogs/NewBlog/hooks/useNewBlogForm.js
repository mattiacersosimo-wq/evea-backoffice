import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const defaultValues = {
  title: "",
  category_id: [],
  type: 0,
  document_url: null,
  image: [],
  product_id: [],
  meta_description: "",
  short_description: "",
  meta_keywords: "",
  content: "",
  is_draft: 0,
};

const schema = Yup.object().shape({
  title: Yup.string().required("errors.blogs.add.title.required"),
  content: Yup.string().required("errors.blogs.add.content.required"),
  category_id: Yup.array().min(1, "errors.blogs.add.category_id.min"),
  meta_keywords: Yup.string().required(
    "errors.blogs.add.meta_keywords.required"
  ),
  meta_description: Yup.string().required(
    "errors.blogs.add.meta_description.required"
  ),
  short_description: Yup.string().required(
    "errors.blogs.add.short_description.required"
  ),
  image: Yup.mixed().required("errors.blogs.add.image.required"),

  product_id: Yup.array().when("type", {
    is: 1,
    then: Yup.array()
      .required("errors.blogs.add.product_id.required")
      .min(1, "errors.blogs.add.product_id.min"),
  }),
});
const useNewBlogForm = () => {
  return useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
};

export default useNewBlogForm;
