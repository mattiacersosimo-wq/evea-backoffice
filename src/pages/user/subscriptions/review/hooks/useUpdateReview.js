import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import useErrors from "src/hooks/useErrors";
import useGetUserReviewById from "src/pages/user/onlineStore/productSubscription/details/components/moreInfo/review/hooks/useGetUserReviewById";
import { PATH_USER } from "src/routes/paths";
import fetchUser from "src/utils/fetchUser";
import * as Yup from "yup";

const schema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Rating is required")
    .required("Rating is required"),
  comment: Yup.string().required("Review is required"),
  title: Yup.string().required("Title is required"),
});

const useUpdateReview = (reviewId) => {
  const navigate = useNavigate();
  const { methods } = useGetUserReviewById();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );
    reqData.append("_method", "PUT");
    try {
      const { status, data } = await fetchUser.post(
        `user-reviews/${reviewId}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        navigate(PATH_USER.subscriptions.root());
      }
    } catch (err) {
      Object.values(err).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};
export default useUpdateReview;
