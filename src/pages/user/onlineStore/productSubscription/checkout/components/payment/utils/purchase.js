import { lowerCase } from "lodash";
import fetchUser from "src/utils/fetchUser";

export const TYPES = {
  bitcoin: "bitcoin",
  coin: "coinpayments",
  wallet: "depositwallet",
  finPay: "finpay",
  paypal: "paypal",
};

const genBitCoin = (data) => ({
  status: true,
  ...data.data,
  qrCode: `https://bitaps.com/api/qrcode/png/${data.data?.payment_address}`,
  payment_id: data.payment_id,
  message: "",
});

const genCoinPayment = (data) => ({
  status: true,
  amount_btc: data.btc_amount,
  qrCode: data.data,
  payment_address: data.payment_address,
  payment_id: data.payment_id,
  message: "",
});

const genDepositWallet = (data) => ({
  status: true,
  invoiceId: data.invoice_id,
  message: data.message,
  qrCode: "",
  amount_btc: "",
  payment_address: "",
  payment_id: "",
});

const genError = (message) => ({
  status: false,
  message: message,
  qrCode: "",
  amount_btc: "",
  payment_address: "",
  payment_id: "",
});

const genFinPay = ({ created_at, invoice_id, total_amount, id }) => ({
  status: true,
  created_at,
  invoice_id,
  total_amount,
  id,
});

const purchase = async (paymentType, data) => {
  // const type = lowerCase(paymentType).replace(" ", "");
  const reqData = new FormData();
  reqData.append("payment_type", paymentType);
  if (data) {
    Object.entries(data).forEach(([k, v]) => reqData.set(k, v));
  }
  try {
    const { status, data } = await fetchUser.post("product-purchase", reqData);
    const isSuccess = status === 200 && data.status;
    if (isSuccess && paymentType === "1") {
      window.open(data.data, "_self");
    }

    if (isSuccess) {
      switch (paymentType) {
        case TYPES.bitcoin: {
          return genBitCoin(data);
        }
        case TYPES.coin: {
          return genCoinPayment(data);
        }
        case TYPES.wallet: {
          return genDepositWallet(data);
        }
        case TYPES.finPay: {
          return genFinPay(data.data);
        }
        case TYPES.paypal: {
          window.open(data.data, "_self");
        }

        default:
          break;
      }
    }
  } catch (err) {
    return genError(err.message);
  }
};

export default purchase;
