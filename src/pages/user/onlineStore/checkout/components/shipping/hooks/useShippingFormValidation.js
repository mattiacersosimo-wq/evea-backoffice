import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const Schema = Yup.object().shape({
  billing_first_name: Yup.string().required("First name is required"),
  billing_last_name: Yup.string().required("Last name is required"),
  billing_country: Yup.string().nullable().required("Country is required"),
  billing_street_address: Yup.string().required("Street address is required"),
  billing_postcode: Yup.string().required("Zip code is required"),
  billing_city: Yup.string().required("City is required"),
  billing_province: Yup.string().required("Province is required"),
  billing_email: Yup.string()
    .email("Enter valid email")
    .required("Email is required"),
  billing_phone: Yup.string().required("Phone number is required"),

  shipping_first_name: Yup.string().when("shippingAddress", {
    is: true,
    then: (schema) => schema.required("First name is required"),
  }),
  shipping_last_name: Yup.string().when("shippingAddress", {
    is: true,
    then: (schema) => schema.required("Last name is required"),
  }),
  shipping_country: Yup.string()
    .nullable()
    .when("shippingAddress", {
      is: true,
      then: (schema) => schema.required("Country is required"),
    }),
  shipping_street_address: Yup.string().when("shippingAddress", {
    is: true,
    then: (schema) => schema.required("Street address is required"),
  }),
  shipping_postcode: Yup.string().when("shippingAddress", {
    is: true,
    then: (schema) => schema.required("Zip code is required"),
  }),
  shipping_city: Yup.string().when("shippingAddress", {
    is: true,
    then: (schema) => schema.required("City is required"),
  }),
  shipping_province: Yup.string().when("shippingAddress", {
    is: true,
    then: (schema) => schema.required("Province is required"),
  }),
  shipping_email: Yup.string().when("shippingAddress", {
    is: true,
    then: (schema) =>
      schema.email("Enter valid email").required("Email is required"),
  }),
  shipping_phone: Yup.string().when("shippingAddress", {
    is: true,
    then: (schema) => schema.required("Phone number is required"),
  }),
});

const defaultValues = {
  shippingAddress: false,

  billing_first_name: "",
  billing_last_name: "",
  billing_country: "",
  billing_country_code: "",
  billing_street_address: "",
  billing_postcode: "",
  billing_city: "",
  billing_province: "",
  billing_email: "",
  billing_phone: "",

  shipping_first_name: "",
  shipping_last_name: "",
  shipping_country: "",
  shpping_country_code: "",
  shipping_street_address: "",
  shipping_postcode: "",
  shipping_city: "",
  shipping_province: "",
  shipping_email: "",
  shipping_phone: "",
};

const useShippingFormValidation = () => {
  return useForm({
    resolver: yupResolver(Schema),
    defaultValues,
    shouldUnregister: true,
  });
};

export default useShippingFormValidation;
