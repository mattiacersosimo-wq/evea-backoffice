import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import serializeDate from "src/utils/serialize-date";
import * as Yup from "yup";

const defaultValues = {
  email: "",
  username: "",
  password: "",
  repassword: "",
  referral: "",
  plan: null,
  date_of_birth: null,
};

const usernameRegex = /^[\w-]*$/;

const schema = Yup.object().shape({
  email: Yup.string()
    .email("errors.register.email.email")
    .required("errors.register.email.required"),
  username: Yup.string()
    .required("errors.register.username.required")
    .matches(usernameRegex, "errors.register.username.matches"),
  password: Yup.string()
    .min(8, "errors.register.password.min")
    .required("errors.register.password.required"),
  repassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "errors.register.repassword.oneOf"
  ),
  referral: Yup.string().matches(
    usernameRegex,
    "errors.register.username.matches"
  ),
  date_of_birth: Yup.string()
    .nullable()
    .test("required", "Date of birth is required", (v) => {
      if (v === null) return true;
      if (v !== "") return true;
    })
    .transform((v) => {
      if (v) serializeDate(v);
      return null;
    }),
});

const useRegisterForm = () => {
  const methods = useForm({
    // resolver: yupResolver(schema),
    defaultValues,
  });

  return methods;
};

export default useRegisterForm;
