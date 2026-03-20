import fetchUser from "src/utils/fetchUser";

const genReqData = (inputData) => {
  const reqData = new FormData();
  const { payment_code, ...rest } = inputData;
  reqData.append("payment_type", payment_code);
  Object.entries(rest).forEach(([k, v]) => {
    if (Boolean(v)) reqData.append(k, v);
  });
  return reqData;
};

export default async (inputData) => {
  const reqData = genReqData(inputData);

  try {
    const { status, data } = await fetchUser.post("product-purchase", reqData);

    return { status: status === 200 && data.status, data: data };
  } catch (err) {
    return { status: false, error: err.message };
  }
};
