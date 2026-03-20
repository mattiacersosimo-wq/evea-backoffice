import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { TYPE_IDS } from "src/utils/types";
import { object, string } from "yup";

const defaultValues = {
    payment_code: "",
    coupon_code: "",
    coin_type: "",
    country: "",
    state: "",
    city: "",
    address: "",
    zip: "",
    card_name: "",
    card_number: "",
    card_expiry: "",
    is_finpay_recurring: 0,
    stripe_recurring: 0,
    paypal_recurring: 0,
    first_name: "",
    last_name: "",
    telegram: "",
    profile_update: 0,
    transaction_reference_no: "",
};

export const isAmericanExpress = (number) => {
    const amex = new RegExp("^3[47]");
    return amex.test(number);
};

const schema = object().shape({
    coupon_code: string().nullable(),
    transaction_reference_no: string().when("payment_code", {
        is: (v) => v === TYPE_IDS.bankPayment,
        then: (schema) =>
            schema.required("Transaction Reference Number is required"),
    }),

    first_name: string().when("profile_update", {
        is: (v) => Boolean(v),
        then: (schema) => schema.required("First Name is required"),
    }),
    last_name: string().when("profile_update", {
        is: (v) => Boolean(v),
        then: (schema) => schema.required("Last Name is required"),
    }),
    telegram: string().when("profile_update", {
        is: (v) => Boolean(v),
        then: (schema) => schema.required("Telegram is required"),
    }),
    country: string().when("payment_code", {
        is: (v) => v === TYPE_IDS.finPay,
        then: (schema) => schema.required("Select an country"),
    }),
    state: string().when("payment_code", {
        is: (v) => v === TYPE_IDS.finPay,
        then: (schema) => schema.required("State is required"),
    }),
    city: string().when("payment_code", {
        is: (v) => v === TYPE_IDS.finPay,
        then: (schema) => schema.required("City is required"),
    }),
    address1: string().when("payment_code", {
        is: (v) => v === TYPE_IDS.finPay,
        then: (schema) => schema.required("Address is required"),
    }),
    zip: string().when("payment_code", {
        is: (v) => v === TYPE_IDS.finPay,
        then: (schema) => schema.required("Zip code is required"),
    }),
    payment_cardname: string().when("payment_code", {
        is: (v) => v === TYPE_IDS.finPay,
        then: (schema) => schema.required("Card Name is required"),
    }),
    payment_cardnumber: string().when("payment_code", {
        is: (v) => v === TYPE_IDS.finPay,
        then: (schema) =>
            schema
                .required("Card number is required")
                .test("isAmex", "American express card is not allowed", (v) => {
                    return !isAmericanExpress(v);
                }),
    }),
    payment_cardexpiry: string().when("payment_code", {
        is: (v) => v === TYPE_IDS.finPay,
        then: (schema) =>
            schema
                .required("Card expiry is required")
                .test(
                    "is-valid",
                    "No special characters or alphabets are allowed, please verify your input is in the format (MMYY)",
                    (v) => v?.length === 4 && !isNaN(v * 1)
                ),
    }),

    paymentcard_csc: string().when("payment_code", {
        is: (v) => v === TYPE_IDS.finPay,
        then: (schema) =>
            schema
                .required("Card CSC is required")
                .test(
                    "is-valid",
                    "No special characters or alphabets are allowed",
                    (v) => v?.length === 3 && !isNaN(v * 1)
                ),
    }),
});

const usePurchaseForm = () => {
    return useForm({ defaultValues, resolver: yupResolver(schema) });
};

export default usePurchaseForm;
