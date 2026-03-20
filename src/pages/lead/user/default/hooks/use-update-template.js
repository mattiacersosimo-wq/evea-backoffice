import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useGetTemplate from "./use-get-template";

const useUpdateTemplate = () => {
  const methods = useGetTemplate();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    const { visuals, ...rest } = inputData;

    const reqData = new FormData();

    Object.entries(rest).forEach(([k, v]) => reqData.append(k, v));
    reqData.append("_method", "PUT");

    if (typeof visuals === "string") {
      reqData.append("visuals", visuals);
    } else if (visuals?.length > 0) {
      reqData.append("visuals", visuals[0]);
    }

    try {
      const { data } = await axiosInstance.post(
        "api/user/lead-capture-template",
        reqData
      );

      enqueueSnackbar(data.message);
    } catch (err) {
      Object.entries(err.errors).forEach(([k, v]) => {
        methods.setError(v, { message: v[0] });
      });
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return { methods, onSubmit };
};

export default useUpdateTemplate;
