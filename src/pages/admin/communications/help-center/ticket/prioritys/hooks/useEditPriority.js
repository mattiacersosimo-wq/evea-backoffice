import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useGetPriorityById from "./useGetPriorityById";

const useEditPriority = (id, cb) => {
  const methods = useGetPriorityById(id);
  const handleErrors = useErrors();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );
    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/support-ticket-priorities/${id}`,
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

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useEditPriority;
