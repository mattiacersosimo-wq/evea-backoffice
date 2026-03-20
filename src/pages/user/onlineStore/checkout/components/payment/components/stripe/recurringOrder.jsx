import axiosInstance from "src/utils/axios";

const enableRecurringOrder = async (userPayment) => {
  const reqData = new FormData();
  reqData.append("user_payment", userPayment);

  try {
    const { status } = await axiosInstance.post(
      "api/user/stripe-recurring-enable",
      reqData,
    );
    return status === 200;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default enableRecurringOrder;
