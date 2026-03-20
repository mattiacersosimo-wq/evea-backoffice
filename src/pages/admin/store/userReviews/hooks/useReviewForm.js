import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const ReviewAddSchema = Yup.object().shape({
  rating: Yup.mixed().required("errors.user_review.rating.required"),
  product_id: Yup.string().required("errors.user_review.product_id.required"),
  username: Yup.string().required("errors.user_review.username.required"),
  title: Yup.string().required("errors.user_review.title.required"),
  comment: Yup.string().required("errors.user_review.comment.required"),
});

const defaultValues = {
  rating: null,
  product_id: "",
  username: "",
  title: "",
  comment: "",
};
const useReviewForm = () => {
  return useForm({
    resolver: yupResolver(ReviewAddSchema),
    defaultValues,
  });
};

export default useReviewForm;
