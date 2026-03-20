import { yupResolver } from "@hookform/resolvers/yup";
import { last } from "lodash";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import useQueryParams from "src/hooks/useQueryParams";
import { PATH_USER } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import TYPES, { TYPE_IDS } from "src/utils/types";
import * as Yup from "yup";

const ReviewSchema = Yup.object().shape({
  no_of_coupon: Yup.number()
    .typeError("Number of coupons is required")
    .min(1, "Number of coupon to be created cannot be zero")
    .required("Number of coupons is required")
    .nullable(),
  name: Yup.string().required("Name is required"),
});

const defaultValues = {
  no_of_coupon: "",
  total_amount: "",
  name: "",
  price: "",
  payment_type: null,
};

const useCouponPurchase = () => {
  const { id } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  useEffect(() => {
    if (id) methods.setValue("package_id", id);
  }, [id]);

  const { addParam } = useQueryParams();
  const navigate = useNavigate();
  const [scannerData, setScannerData] = useState(null);
  const closeScanner = () => setScannerData(null);
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );
    try {
      const { status, data } = await axiosInstance.post(
        `api/user/coupon-purchase`,
        reqData
      );
      if (status === 200) {
        if (status) {
          switch (inputData.payment_type) {
            case TYPE_IDS.hundredPercentage: {
              navigate(PATH_USER.my_orders.view(data.id), { replace: true });
              break;
            }
            case TYPE_IDS.finPay: {
              navigate(PATH_USER.my_orders.view(data.data?.id), {
                replace: true,
              });
              break;
            }
            case TYPE_IDS.bankPayment: {
              navigate(PATH_USER.pending_approvals.root, {
                replace: true,
              });
              break;
            }
            case TYPE_IDS.wallet: {
              navigate(PATH_USER.my_orders.view(data.invoice_id), {
                replace: true,
              });
              break;
            }
            case TYPE_IDS.paypal: {
              window.open(data.data, "_self");
              break;
            }
            case TYPE_IDS.paypalBTaf: {
              window.open(data.data, "_self");
              break;
            }
            case TYPE_IDS.bitcoin: {
              const { payment_id, data: paymentData } = data;
              const { payment_address, amount_btc, timeout } = paymentData;
              const qrCode = `https://bitaps.com/api/qrcode/png/${payment_address}`;
              setScannerData({
                payment_id,
                amount_btc,
                payment_address,
                qrCode,
                coin_type: "BTC",
                timeout,
              });
              break;
            }
            case TYPE_IDS.coin: {
              const {
                data: qrCode,
                amount_currency_two: amount_btc,
                payment_address,
                payment_id,
                currency_two: coin_type,
                timeout,
              } = data;

              setScannerData({
                timeout,
                payment_id,
                amount_btc,
                payment_address,
                qrCode,
                coin_type,
                timeout,
              });
              break;
            }

            case TYPE_IDS.stripe: {
              addParam({
                stripe: data.data.client_secret,
                user_payment: data.data.user_payment,
              });
              break;
            }
            case TYPES.token: {
              addParam("token", last(data.response_url.split("/")));
              break;
            }
          }
        }
      }
    } catch (error) {
      if (error.errors) {
        Object.entries(error.errors).forEach(([k, v]) =>
          methods.setError(k, { message: v.flat() })
        );
      }
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };
  return {
    scannerData,
    closeScanner,
    methods,
    onSubmit,
  };
};

export default useCouponPurchase;
