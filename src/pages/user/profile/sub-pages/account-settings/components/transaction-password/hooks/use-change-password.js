import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useChangePasswordForm from "./use-change-password-form";

const useChangePassword = () => {
  const methods = useChangePasswordForm();
  const { enqueueSnackbar } = useSnackbar();

  const { reset, setError } = methods;

  const onSubmit = async (reqData) => {
    const data = new FormData();
    Object.entries(reqData).forEach(([key, value]) => data.append(key, value));

    data.append("_method", "PUT");
    try {
      const { status, data: responseData } = await axiosInstance({
        method: "post",
        url: "/api/profile-transaction-password",
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (status === 200) {
        reset();
        enqueueSnackbar(responseData.message);
      }
    } catch (error) {
      if (error.errors) {
        Object.entries(error.errors).forEach(([k, v]) =>
          setError(k, { message: v[0] })
        );
      } else {
        if (error.message === "Invalid Transaction password") {
          setError("old_password", { message: error.message });
        } else {
          enqueueSnackbar(error.message, { variant: "error" });
        }
      }
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useChangePassword;
