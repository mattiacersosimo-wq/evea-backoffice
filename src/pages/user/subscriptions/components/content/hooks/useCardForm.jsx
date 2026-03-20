import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import fetchUser from "src/utils/fetchUser";
import { number, object, string } from "yup";

const schema = object().shape({
  country: string().required(),
  city: string().required(),
  state: string().required(),
  zip: number()
    .typeError("Pincode should be a number")
    .required("Pincode is required"),
  address1: string().required(),
  payment_cardname: string().required("Card name is required"),
  payment_cardnumber: number().required("Card number is required"),
  payment_cardexpiry: string().required("Expiry date is required"),
  paymentcard_csc: string().required("CVV is required"),
});

const useCardForm = (productId, purchaseId, onClose, reload) => {
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));
    reqData.append("product_id", productId);
    reqData.append("purchase_id", purchaseId);
    try {
      const { status, data } = await fetchUser.post(
        "finpay-recurring-enable",
        reqData
      );
      if (status === 200) {
        onClose();
        enqueueSnackbar(data.message);
        reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useCardForm;
