import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import TYPES from "../../../../../../../../../../utils/types";

const isAmericanExpress = (number) => {
  const amex = new RegExp("^3[47]");
  return amex.test(number);
};

const schema = object().shape({
  country: string().required("Select an country"),
  state: string().required("State is required"),
  city: string().required("City is required"),
  address: string().required("Address is required"),
  zip: string().required("Zip code is required"),
  card_name: string().required("Card Name is required"),
  card_number: string()
    .required("Card number is required")
    .test("isAmex", "American express card is not allowed", (v) => {
      return !isAmericanExpress(v);
    }),
  card_expiry: string()
    .required("Card expiry is required")
    .test(
      "is-valid",
      "No special characters or alphabets are allowed, please verify your input is in the format (MMYY)",
      (v) => v?.length === 4 && !isNaN(v * 1)
    ),
});

const defaultValues = {
  payment_type: TYPES.finPay,
  country: "",
  state: "",
  city: "",
  address: "",
  zip: "",
  card_name: "",
  card_number: "",
  card_expiry: "",
  is_finpay_recurring: "",
};

export const useFinPayForm = () => {
  return useForm({ defaultValues, resolver: yupResolver(schema) });
};
