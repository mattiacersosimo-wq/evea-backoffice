import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useEditDialog = (cb) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();

  const onSubmit = async (reqData) => {
    const formData = new FormData();
    formData.append("video_url", reqData.video_url);
    formData.append("_method", "PUT");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/products-video/${reqData.id}`,
        formData
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

export default useEditDialog;
