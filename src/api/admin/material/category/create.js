import axiosInstance from "src/utils/axios";

const createMaterialCategory = async (inputData) => {
  const reqData = new FormData();
  Object.entries(inputData).forEach(([key, value]) =>
    reqData.append(key, value)
  );

  try {
    const { data } = await axiosInstance.post(
      "/api/admin/material-categories",
      reqData
    );

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default createMaterialCategory;
