import { useSnackbar } from "notistack";
import { useParams } from "react-router";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useAddVideo = (cb) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();
  const { pid } = useParams();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    reqData.append("video", inputData.video_url);
    reqData.append("product_id", pid);

    try {
      const { status, data } = await axiosInstance.post(
        "/api/admin/product-videos",
        reqData
      );
      if (status === 200) {
        cb();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  return onSubmit;
};

export default useAddVideo;
