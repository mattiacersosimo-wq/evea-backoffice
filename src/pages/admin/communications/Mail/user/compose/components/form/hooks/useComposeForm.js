import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { array, object, string } from "yup";

const defaultValues = {
  to_users_id: [],
  subject: "",
  ranks: [],
  products: [],
  attachments: "",
  is_broadcast: 0,
};

const schema = object().shape({
  subject: string().required("Subject is required"),
  to_users_id: array().when(
    ["ranks", "products"],
    (ranks, products, schema) => {
      if (Boolean(ranks.length + products.length)) {
        return schema;
      }
      return schema.min(1, "Select at least one user");
    }
  ),
});

const useComposeForm = () => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  return methods;
};
export default useComposeForm;
