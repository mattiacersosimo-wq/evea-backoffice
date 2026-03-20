import axiosInstance from "src/utils/axios";

const checkSuccess = async (pid, uid) => {
  const URI = `/api/store-payment/${pid}/${uid}`;
  try {
    const { status, data } = await axiosInstance(URI);

    const httpOkay = status === 200;

    if (httpOkay) {
      return { status: data.payment_status, invoiceId: data.invoice_id };
    }

    return httpOkay;
  } catch (err) {
    console.error(err);
    return false;
  }
};
export default checkSuccess;
