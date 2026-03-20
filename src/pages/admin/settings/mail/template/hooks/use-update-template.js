import { useSnackbar } from "notistack";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import buildPath from "src/utils/build-path";
import useGetTemplate from "./use-get-template";

const useUpdateTemplate = () => {
  const { methods } = useGetTemplate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([k, v]) => {
      reqData.append(k, v);
    });
    reqData.append("_method", "PUT");
    try {
      const { data } = await axiosInstance.post(
        buildPath("api/admin/email-template", id),
        reqData
      );
      enqueueSnackbar(data.message);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useUpdateTemplate;
