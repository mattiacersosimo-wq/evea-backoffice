import axiosInstance from "src/utils/axios";

const productAutoComplete = async (params) => {
  try {
    const { data } = await axiosInstance.get(`/api/admin/product-list`, {
      params,
    });
    return data;
  } catch (err) {
    return err;
  }
};

export default productAutoComplete;
