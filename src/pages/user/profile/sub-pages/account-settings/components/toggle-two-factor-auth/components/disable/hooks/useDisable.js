import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";

const useDisable = (cb) => {
  const { user, getUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({ defaultValues: { id: "", code: "" } });
  const { setValue, setError, handleSubmit } = methods;
  useEffect(() => {
    if (user.id) setValue("id", user.id);
  }, [user]);

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));
    try {
      const { data, status } = await axiosInstance.post(
        "api/user/disable-twofa",
        reqData
      );
      if (status === 200) {
        cb();
        methods.reset();
        enqueueSnackbar(data.message);
        getUser();
      }
    } catch (err) {
      setError("code", { message: err.message });
      Object.values(err.errors).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  return { methods, onSubmit: handleSubmit(onSubmit) };
};

export default useDisable;
