import axiosInstance from "src/utils/axios";
import useReviewForm from "./useReviewForm";

const useGetReviewById = () => {
  const methods = useReviewForm();

  const fetchReviewById = async (id) => {
    try {
      const { status, data } = await axiosInstance.get(
        `api/admin/user-reviews/${id}`
      );

      if (status === 200) {
        const { rating, product_id, username, title, comment } = data.data;
        methods.reset({ rating, product_id, username, title, comment });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { methods, fetchReviewById };
};

export default useGetReviewById;
