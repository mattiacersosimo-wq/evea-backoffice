import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useGetTemplate from "./use-get-template";

const useUpdateTemplate = ({ open, onClose }) => {
  const methods = useGetTemplate(open);
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
        "api/admin/lead-capture-template",
        reqData
      );
      enqueueSnackbar(data.message);
      onClose();
    } catch (err) {
      Object.entries(err.errors).forEach(([k, v]) => {
        methods.setError(k, { message: v[0] });
      });
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return { methods, onSubmit };
};

export default useUpdateTemplate;
