import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { PATH_USER } from "src/routes/paths";
import { object, string } from "yup";
import purchase from "../../../utils/purchase";

const schema = object().shape({
  country: string().required("Select an country"),
  state: string().required("State is required"),
  city: string().required("City is required"),
  address1: string().required("Address is required"),
  zip: string().required("Zip code is required"),
  payment_cardname: string().required("Card Name is required"),
  payment_cardnumber: string().required("Card number is required"),
  payment_cardexpiry: string().required("Card expiry is required"),
  paymentcard_csc: string().required("CSC is required"),
});

const defaultValues = {
  payment_type: "FIN PAY",
  country: "",
  state: "",
  city: "",
  address1: "",
  zip: "",
  payment_cardname: "",
  payment_cardnumber: "",
  payment_cardexpiry: "",
  paymentcard_csc: "",
  finpay_recurring: "",
};

const useFinPay = (cb) => {
  const navigate = useNavigate();
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });
  const onSubmit = async (data) => {
    const { status, id, message } = await purchase(data.payment_type, data);
    if (status) {
      navigate(PATH_USER.my_orders.view(id));
    } else {
      cb(message);
    }
  };

  return { onSubmit: methods.handleSubmit(onSubmit), methods };
};

export default useFinPay;
