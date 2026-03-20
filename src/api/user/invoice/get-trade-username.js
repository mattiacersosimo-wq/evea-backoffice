import axiosInstance from "src/utils/axios";

const getTradeUsername = async (inputData) => {
  const reqData = new FormData();
  Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));
  reqData.append("_method", "PUT");
  try {
    const { data } = await axiosInstance.post(
      "api/user/trading-view-username",
      reqData
    );

    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default getTradeUsername;
