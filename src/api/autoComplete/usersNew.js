import axiosInstance from "src/utils/axios";

const usersAutoComplete = async (term, params = {}) => {
  const reqData = new FormData();
  const { user_id, ...rest } = params;
  reqData.append("term", term);
  // user_id?.forEach((id) => reqData.append("user_id[]", id));
  if (user_id) {
    reqData.append("user_id[]", user_id);
  }
  try {
    const { data } = await axiosInstance.post(
      "/api/username/autocomplete",
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
