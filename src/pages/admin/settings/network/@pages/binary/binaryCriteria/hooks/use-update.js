import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useUpdate = (fetchData) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleError = useErrors();

  const onSubmit = async (inputData) => {
    const { period } = inputData;

    const reqData = new FormData();
    reqData.append("_method", "PUT");
    reqData.append("period", period);

    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/binary-period`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        fetchData();
      }
    } catch (err) {
      handleError(err);
    }
  };

  return onSubmit;
};

export default useUpdate;
