import axiosInstance from "src/utils/axios";

const usersAutoComplete = async (isFundTransfer, term, params = {}) => {
  const reqData = new FormData();
  const { user_id, ...rest } = params;
  reqData.append("term", term);
  // user_id?.forEach((id) => reqData.append("user_id[]", id));
  if (user_id) {
    reqData.append("user_id[]", user_id);
  }
  try {
    const { data } = await axiosInstance.post(
      isFundTransfer
        ? "/api/user/username/fund-transfer-autocomplete"
        : "/api/username/autocomplete",
      reqData,
      {
        params: { ...rest },
      }
    );

    return data;
  } catch (err) {
    return err;
  }
};

export default usersAutoComplete;
