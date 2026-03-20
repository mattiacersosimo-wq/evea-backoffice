import axiosInstance from "src/utils/axios";

const createProductCategory = async (inputData) => {
  const reqData = new FormData();
  Object.entries(inputData).forEach(([key, value]) =>
    reqData.append(key, value)
  );

  try {
    const { status, data } = await axiosInstance.post(
      "/api/admin/product-categories",
      reqData
    );
    if (status === 200) {
      return data;
    }
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default createProductCategory;
