import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useRankForm from "./useRankForm";
import genFaqReqData from "./genFaqReqData";

const useRankAdd = (onSuccess, config) => {
  const methods = useRankForm(config);
  const { enqueueSnackbar } = useSnackbar();
  const { setError } = methods;
  const onSubmit = async (inputData) => {
    try {
      const { status, data } = await axiosInstance({
        method: "post",
        url: "/api/admin/settings-rank-create",
        data: genFaqReqData(inputData),
      });
      if (status === 200) {
        onSuccess();
        enqueueSnackbar(data.message);
      }
    } catch (error) {
      Object.entries(error.errors).forEach(([k, v]) =>
        setError(k, { message: v[0] })
      );
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useRankAdd;
