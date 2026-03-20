import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { array, object, string } from "yup";

const schema = object().shape({
  subject: string().required("errors.email.subject.required"),
  message: string().required("errors.email.message.required"),
  to_users_id: array().when(
    ["ranks", "products", "userId"], // Include userId in the check
    (ranks, products, userId, schema) => {
      if (Boolean(ranks.length + products.length) || userId) {
        // Check if either ranks/products have length or userId is present
        return schema;
      }
      return schema.min(1, "errors.email.to_users_id.min");
    }
  ),
});

const useComposeForm = (userId) => {
  const defaultValues = {
    to_users_id: [],
    subject: "",
    message: "",
    ranks: [],
    products: [],
    attachments: [],
    is_broadcast: 0,
    userId: userId,
  };
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  return methods;
};

export default useComposeForm;
