import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New Password is required"),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const defaultValues = {
  password: "",
  confirmNewPassword: "",
};

const useUpdatePasswordForm = () => {
  return useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
};

export default useUpdatePasswordForm;
