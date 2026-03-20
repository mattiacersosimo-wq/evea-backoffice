import { last } from "lodash";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router";
import { placeOrder } from "src/api/user/purchase";
import useAuth from "src/hooks/useAuth";
import useQueryParams from "src/hooks/useQueryParams";
import { PATH_USER } from "src/routes/paths";
import TYPES, { TYPE_IDS } from "src/utils/types";
import usePurchaseForm from "./usePurchaseForm";

const usePurchase = () => {
  const methods = usePurchaseForm();
  const [scannerData, setScannerData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { resetCart, getUser } = useAuth();
  const closeScanner = () => setScannerData(null);
  const { enqueueSnackbar } = useSnackbar();
  const { addParam } = useQueryParams();
  const completeOrder = async (inputData) => {
    const { status, data, error } = await placeOrder(inputData);

    if (status) {
      resetCart();
      await getUser();
      switch (inputData.payment_code) {
        case TYPE_IDS.hundredPercentage: {
          navigate(PATH_USER.my_orders.view(data.id), { replace: true });
          break;
        }
        case TYPE_IDS.finPay: {
          navigate(PATH_USER.my_orders.view(data.data?.id), { replace: true });
          break;
        }
        case TYPE_IDS.bankPayment: {
          navigate(PATH_USER.pending_approvals.root, {
            replace: true,
          });
          break;
        }
        case TYPE_IDS.cod: {
          navigate(PATH_USER.my_orders.view(data.invoice_id), {
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
    } else {
      enqueueSnackbar(error, { variant: "error" });
      navigate("/user/checkout");
      setError(error);
    }
  };

  return {
    error,
    methods,
    scannerData,
    closeScanner,
    placeOrder: methods.handleSubmit(completeOrder),
  };
};

export default usePurchase;
