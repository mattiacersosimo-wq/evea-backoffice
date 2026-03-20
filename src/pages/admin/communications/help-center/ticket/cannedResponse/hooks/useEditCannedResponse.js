import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useGetCannedResponseById from "./useGetCannedResponseById";

const useEditCannedResponse = (id, cb) => {
  const methods = useGetCannedResponseById(id);
  const handleErrors = useErrors();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );
    reqData.append("_method", "PUT");

    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/support-ticket-canned-responses/${id}`,
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

export default useEditCannedResponse;
