import axiosInstance from "src/utils/axios";

const getMaterialCategoryList = async (params = {}) => {
  try {
    const { status, data } = await axiosInstance.get(
      "/api/admin/material-category",
      {
        params,
      }
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

export default getMaterialCategoryList;
