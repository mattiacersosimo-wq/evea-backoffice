import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useUpdatePasswordForm from "./use-update-password-form";

const useUpdatePassword = () => {
  const methods = useUpdatePasswordForm();
  const handleErrors = useErrors();

  const { enqueueSnackbar } = useSnackbar();
  const { reset, handleSubmit } = methods;

  const onSubmit = async (inputData) => {
    let data = new FormData();
    data.append("password", inputData.password);
    data.append("_method", "PUT");
    try {
      const { status, data: responseData } = await axiosInstance({
        method: "post",
        url: "/api/profile-password",
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (status === 200) {
        reset();
        enqueueSnackbar(responseData.message);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  return { methods, onSubmit: handleSubmit(onSubmit) };
};

export default useUpdatePassword;
