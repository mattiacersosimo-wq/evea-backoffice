import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useGetConfig from "./use-get-config";

const useUpdateConfig = (key = "") => {
  const methods = useGetConfig(key);
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const { code, value, status } = inputData;

    const reqData = new FormData();
    reqData.append("_method", "PUT");
    reqData.append("code", code);
    reqData.append("status", Number(status));
    if (value) reqData.append("value", value);

    try {
      const { data } = await axiosInstance.post(
        "api/admin/config-settings",
        reqData
      );

      enqueueSnackbar(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useUpdateConfig;
