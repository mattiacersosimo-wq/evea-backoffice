import fetchUser from "src/utils/fetchUser";

export const getSubscriptions = async (params) => {
  try {
    const { data, status } = await (
      await fetchUser.get("my-subscriptions", {
        params: {
          ...params,
        },
      })
    ).data;
    if (status) {
      return data;
    }
  } catch (err) {
    console.error(err);
    return "error";
  }
};

export const enablePayPalRecurring = async (inputData) => {
  const reqData = new FormData();
  Object.entries({ ...inputData }).forEach(([k, v]) => reqData.append(k, v));

  const { data } = await fetchUser.post("paypal-recurring-enable", reqData);
  return data;
};
