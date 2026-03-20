import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import useReviewForm from "./useReviewForm";

const useAddReview = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useReviewForm();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();

    [...Object.entries(inputData)].forEach(([key, value]) =>
      reqData.append(key, value)
    );

    try {
      const { status, data } = await axiosInstance.post(
        "/api/admin/user-reviews",
        reqData
      );

      if (status === 200) {
        enqueueSnackbar(data.message);
        navigate(PATH_DASHBOARD.store.user_reviews);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddReview;
