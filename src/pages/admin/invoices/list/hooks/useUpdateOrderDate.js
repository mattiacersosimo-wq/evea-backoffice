import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useUpdateOrderDate = (id, cb) => {
  const handleErrors = useErrors();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    const formData = new FormData();
    formData.append("created_at", inputData.date);

    try {
      const { data, status } = await axiosInstance.post(
        `api/admin/update_createdat/${id}`,
        formData
      );

      if (status === 200 || status === 201) {
        enqueueSnackbar(data.message);
        cb();
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  return { onSubmit };
};

export default useUpdateOrderDate;