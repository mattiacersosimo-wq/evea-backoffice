import axiosInstance from "src/utils/axios";

const sponsorAutoComplete = async (selectedId, term, params = {}) => {
  const reqData = new FormData();
  const { user_id, ...rest } = params;
  reqData.append("term", term);
  reqData.append("sponsor_id", selectedId);

  if (user_id) {
    reqData.append("user_id[]", user_id);
  }
  try {
    const { data } = await axiosInstance.get(
      "api/user/autocomplete_referrals",
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

export default sponsorAutoComplete;
