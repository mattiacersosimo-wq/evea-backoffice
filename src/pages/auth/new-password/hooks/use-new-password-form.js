import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useQueryParams from "src/hooks/useQueryParams";
import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("errors.register.email.email")
    .required("errors.register.email.required")
    .nullable("errors.register.email.required"),
  password: Yup.string()
    .min(8, "errors.register.password.min")
    .required("errors.register.password.required"),
  repassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "errors.register.repassword.oneOf"
  ),
});

const defaultValues = {
  email: "",
  token: "",
  password: "",
  repassword: "",
};

const useNewPasswordForm = () => {
  const { queryObject } = useQueryParams();
  const { email, token } = queryObject;

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { setValue } = methods;

  useEffect(() => {
    if (token) setValue("token", token);
  }, [token]);

  useEffect(() => {
    if (email) setValue("email", Buffer.from(email, "base64").toString());
  }, [email]);

  return methods;
};

export default useNewPasswordForm;
