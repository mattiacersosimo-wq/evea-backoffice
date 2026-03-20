import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object().shape({
  old_password: Yup.string()
    .required("Old Password is required")
    .min(8, "Old Password must be at least 8 characters"),
  new_password: Yup.string()
    .required("New Password is required")
    .min(8, "New Password must be at least 8 characters"),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref("new_password"), null],
    "Passwords must match"
  ),
});

const defaultValues = {
  old_password: "",
  new_password: "",
  confirmNewPassword: "",
};
const useChangePasswordForm = () => {
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });

  return methods;
};

export default useChangePasswordForm;
