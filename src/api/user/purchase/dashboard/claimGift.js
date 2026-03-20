import axiosInstance from "src/utils/axios";

export default async (mail, params) => {
  try {
    const { status, data } = await axiosInstance(`api/gift-accept/${mail}`, {
      params,
    });

    if (status === 200) {
      return data;
    }
    return { status: false, error: "Failed to fetch" };
  } catch (err) {
    return { status: false, error: err.error };
  }
};
