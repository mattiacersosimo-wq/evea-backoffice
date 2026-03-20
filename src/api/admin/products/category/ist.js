import axiosInstance from "src/utils/axios";

const getCategoryList = async () => {
  try {
    const { status, data } = await axiosInstance.get(
      "/api/admin/categories-list"
    );

    if (status === 200 && Boolean(data.data.length)) {
      return data.data;
    }

    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default getCategoryList;
