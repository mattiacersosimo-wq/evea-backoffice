import fetchUser from "src/utils/fetchUser";

const getBtafPayment = async (token) => {
  try {
    const URI = `btaf-payment-page/${token}`;
    const { status, data } = await fetchUser(URI);
    if (status === 200) {
      return data;
    }
  } catch (err) {
    return;
  }
};

export default getBtafPayment;
