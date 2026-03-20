import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

export const NewUserSchema = object().shape({
  username: string().required("errors.profile.edit.username.required"),
  email: string()
    .required("errors.profile.edit.email.required")
    .email("errors.profile.edit.email.email"),
  // last_name: string()
  //   .required("errors.profile.edit.last_name.required")
  //   .matches(/^[a-z\s]+$/i, "errors.profile.edit.last_name.matches")
  //   .nullable(),
  // mobile: number()
  //   .typeError("errors.profile.edit.mobile.type")
  //   .required("errors.profile.edit.mobile.required")
  //   .nullable(),
  // gender: string().required("errors.profile.edit.gender.required").nullable(),
  // zipcode: string().required("errors.profile.edit.zipcode.required").nullable(),
  // address: string().required("errors.profile.edit.address.required").nullable(),
  // country: string().required("errors.profile.edit.country.required").nullable(),
  // state: string()
  //   .required("errors.profile.edit.state.required")
  //   .matches(/^[a-z\s]+$/i, "errors.profile.edit.state.matches")
  //   .nullable(),
  // city: string()
  //   .required("errors.profile.edit.city.required")
  //   .matches(/^[a-z\s]+$/i, "errors.profile.edit.city.matches")
  //   .nullable(),
  // medium: string().url("errors.profile.edit.medium.url").nullable(),
  // facebook: string().url("errors.profile.edit.fb.url").nullable(),
  // twitter: string().url("errors.profile.edit.x.url").nullable(),
  // instagram: string().url("errors.profile.edit.insta.url").nullable(),
  // profile_image: mixed().test(
  //   "required",
  //   "errors.profile.edit.profile_image.required",
  //   (value) => value !== ""
  // ),
});

export const defaultValues = {
  username: "",
  first_name: "",
  last_name: "",
  mobile: "",
  gender: "",
  zipcode: "",
  address: "",
  address: "",
  country: "",
  state: "",
  city: "",
  facebook: "",
  twitter: "",
  instagram: "",
  telegram: "",
  whatsapp: "",
  profile_image: "",
  vat_number: "",
  tax_code: "",
  regime_fiscale: "incaricato_occasionale",
  codice_sdi: "",
  pec: "",
  social: {
    scope_phone: 0,
    scope_email: 0,
    scope_facebook: 0,
    scope_twitter: 0,
    scope_whatsapp: 0,
    scope_instagram: 0,
    scope_telegram: 0,
    scope_medium: 0,
  },
};

const useUserForm = () => {
  return useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
};

export default useUserForm;
