import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

const defaultValues = {
  code: null,
  status: null,
  value: "",
};

const schema = object().shape({
  value: string()
    .nullable()
    .when("code", {
      is: (v) => v === "age_restriction",
      then: (schema) =>
        schema.when("status", {
          is: (v) => Boolean(v),
          then: (schema) => schema.required("Minimum age is required"),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const useUpdateConfigMethods = () => {
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });

  return methods;
};

export default useUpdateConfigMethods;
