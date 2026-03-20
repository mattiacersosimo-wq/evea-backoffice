const { useState, useEffect } = require("react");
const { useParams } = require("react-router");
const { default: axiosInstance } = require("src/utils/axios");

const useGetProductsReviews = () => {
  const [productReviews, setProductReviews] = useState([]);
  const { rid } = useParams();
  const fetchReviewsOfSingleProduct = async () => {
    try {
      const { status, data } = await axiosInstance(
        `api/admin/product-reviews/${rid}`
      );
      if (status === 200) {
        setProductReviews(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => fetchReviewsOfSingleProduct(), []);

  return { productReviews, fetchReviewsOfSingleProduct };
};

export default useGetProductsReviews;
