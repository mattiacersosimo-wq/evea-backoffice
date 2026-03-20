import fetchUser from "src/utils/fetchUser";

const genReqData = (inputData) => {
  const {
    payment_code,
    coin_type,
    amount,
    month,
    is_finpay_recurring,
    ...rest
  } = inputData;
  const reqData = new FormData();
  reqData.append("payment_code", payment_code);
  reqData.append("amount", amount);
  reqData.append("month", month);
  reqData.append("is_finpay_recurring", is_finpay_recurring);

  if (payment_code === "finpay")
    Object.entries(rest).forEach(([k, v]) => {
      reqData.append(k, v);
    });
  else reqData.append("coin_type", coin_type);

  return reqData;
};

export default async (inputData) => {
  try {
    const { status, data } = await fetchUser.post(
      "bb-subscriptions",
      genReqData(inputData)
    );
    if (status === 200) {
      return data;
    }
  } catch (err) {
    if (err) {
      return { status: false, error: err };
    } else {
      return { status: false };
    }
  }
};
