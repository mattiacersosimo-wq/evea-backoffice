import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useGetReviewById from "./useGetReviewById";

const useEditReviews = (id, handleClose, fetchReviewsOfSingleProduct,) => {
  const { fetchReviewById, methods } = useGetReviewById();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    [...Object.entries(inputData)].forEach(([key, value]) =>
      reqData.append(key, value)
    );

    reqData.append("_method", "PUT");

    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/user-reviews/${id}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        handleClose();
        fetchReviewsOfSingleProduct();
      }
    } catch (err) {
      enqueueSnackbar("Failed to update", { variant: "error" });
    }
  };

  return { methods, fetchReviewById, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useEditReviews;
