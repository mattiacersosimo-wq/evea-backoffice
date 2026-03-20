import axiosInstance from "src/utils/axios";

const getCategoryByProduct = async (URL, pid) => {
  try {
    const { status, data } = await axiosInstance.get(URL, {
      params: {
        product_id: pid,
      },
    });
    if (status === 200) return data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const updateSortOrder = async (URL, data) => {
  const reqData = new FormData();
  const newData = JSON.stringify(
    data?.map(({ id, sort_order }) => ({
      category: id,
      sort_order,
    })) || []
  );

  reqData.append("sort_order", newData);
  reqData.append("_method", "PUT");

  try {
    const { status, data } = await axiosInstance.post(URL, reqData);
    if (status === 200) return data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default getCategoryByProduct;
