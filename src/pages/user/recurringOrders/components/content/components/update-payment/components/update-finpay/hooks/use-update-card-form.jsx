import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import fetchUser from "src/utils/fetchUser";
import { number, object, string } from "yup";

const schema = object().shape({
  payment_cardname: string().required("Card name is required"),
  payment_cardnumber: number().required("Card number is required"),
  payment_cardexpiry: string().required("Expiry date is required"),
});

const useUpdateCardForm = (purchaseId, cb) => {
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const {
    setError,
    formState: { errors },
  } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));
    reqData.append("id", purchaseId);
    try {
      const { status, data } = await fetchUser.post(
        "/finpay-card-update",
        reqData
      );
      if (status === 200) {
        cb();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      console.log(err.response.data.code);
      if (err.response?.data?.code === 14) {
        enqueueSnackbar(err?.response?.data?.message, { variant: "error" });
        return;
      }
      Object.entries(err.response?.data?.errors).forEach(([k, v]) =>
        setError(k, { message: v[0] })
      );
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useUpdateCardForm;
