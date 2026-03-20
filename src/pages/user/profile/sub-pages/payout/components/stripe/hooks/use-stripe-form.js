import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useForm } from "react-hook-form";
import serializeDate from "src/utils/serialize-date";
import { number, object, string } from "yup";

const defaultValues = {
  first_name: "",
  last_name: "",
  currency: "usd",
  account_holder_name: "",
  account_holder_type: "individual",
  routing_number: "",
  account_number: "",
  country: "US",
  id_number: "",
  phone: "",
  gender: "",
  date_of_birth: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
};

const schema = object().shape({
  date_of_birth: string()
    .typeError("Date of birth is Required")
    .test("is-valid", "errors.date.valid_date.test", (v) =>
      moment(v, "DD/MM/YYYY").isValid()
    )
    .transform((v) => serializeDate(v)),
  routing_number: string().required("Routing Number is Required"),
  first_name: string().required("First Name is Required"),
  last_name: string().required("Last Name is Required"),
  account_holder_name: string().required("Account Holder Name  is Required"),
  account_holder_type: string().required("Account Holder Type  is Required"),
  gender: string().required("Gender is Required"),
  line1: string().required("Line1 is Required"),
  line2: string().required("Line2 is Required"),
  city: string().required("City is Required"),
  state: string().required("State is Required"),
  postal_code: number()
    .required("Postal Code is Required")
    .typeError("Postal Code must be a number"),
  account_number: string().required("Account Number is Required"),
  id_number: string().required("ID Number is Required"),
  country: string().required("Country is Required"),
  currency: string().required("Country is Required"),
  phone: string().required("Phone Number is Required"),
});

const useStripeForm = () => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  return methods;
};

export default useStripeForm;
