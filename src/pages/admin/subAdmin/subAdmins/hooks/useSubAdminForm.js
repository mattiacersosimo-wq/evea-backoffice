import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const AddSubAdminSchema = Yup.object().shape({
  name: Yup.string().required("errors.sub_admin.name.required"),
  mobile: Yup.string().required("errors.sub_admin.mobile.required"),
  // .matches(/^[0-9]+$/, "errors.sub_admin.mobile.matches"),
  group_id: Yup.string().required("errors.sub_admin.group_id.required"),
  email: Yup.string()
    .email("errors.sub_admin.email.email")
    .required("errors.sub_admin.email.required"),
  is_impersonation: Yup.number().required(
    "errors.sub_admin.is_impersonation.required"
  ),
  username: Yup.string().required("errors.sub_admin.username.required"),
  password: Yup.string()
    .min(8, "errors.member.password.password.min")
    .required("errors.member.password.password.required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "errors.member.password.confirmPassword.oneOf"
  ),
  // department_ids: Yup.array().min(1, "Select at least one department"),
  // product_ids: Yup.array().min(1, "Select at least one Product"),
});

const EditSubAdminSchema = Yup.object().shape({
  name: Yup.string().required("errors.sub_admin.name.required"),
  mobile: Yup.string().required("errors.sub_admin.mobile.required"),
  // .matches(/^[0-9]+$/, "errors.sub_admin.mobile.matches"),
  group_id: Yup.string().required("errors.sub_admin.group_id.required"),
  email: Yup.string()
    .email("errors.sub_admin.email.email")
    .required("errors.sub_admin.email.required"),
  is_impersonation: Yup.number()
    .typeError("errors.sub_admin.is_impersonation.typeError")
    .required("errors.sub_admin.is_impersonation.required"),
  username: Yup.string().required("errors.sub_admin.username.required"),
  // department_ids: Yup.array().min(1, "Select at least one department"),
  // product_ids: Yup.array().min(1, "Select at least one Product"),
});

const defaultValues = {
  name: "",
  mobile: "",
  product_ids: [],
  department_ids: [],
  excluded_products: [],
  group_id: "",
  email: "",
  is_impersonation: 0,
  active: 1,
  username: "",
  password: "",
  confirmPassword: "",
};

const useSubAdminForm = (isEdit = false) => {
  return useForm({
    resolver: yupResolver(isEdit ? EditSubAdminSchema : AddSubAdminSchema),
    defaultValues,
  });
};

export default useSubAdminForm;
