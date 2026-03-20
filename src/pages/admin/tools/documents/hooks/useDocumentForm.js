import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const ValidationSchema = yup.object().shape({
  title: yup.string().required("errors.tools.title.required"),
  sort_order: yup
    .number()
    .required("errors.tools.sort_order.required")
    .integer("errors.tools.sort_order.integer")
    .typeError("errors.tools.sort_order.typeError"),
  document_url: yup
    .mixed()
    .test("isFile", "errors.tools.document_url.test", (value) =>
      Boolean(value.length)
    ),
});

export const documentFormDefaultValues = {
  title: "",
  sort_order: "",
  document_url: "",
};

const useDocumentForm = () => {
  return useForm({
    documentFormDefaultValues,
    resolver: yupResolver(ValidationSchema),
  });
};

export default useDocumentForm;
