import axiosInstance from "src/utils/axios";

const getNotifications = async () => {
  try {
    const { status, data } = await axiosInstance.get(
      "api/user/dashboard/latest-notifications"
    );
    if (status === 200) {
      return data;
    }
  } catch (err) {
    return err;
  }
};

export default getNotifications;
