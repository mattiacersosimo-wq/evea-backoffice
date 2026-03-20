import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";

const useEnable = (open, cb) => {
  const { getUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    defaultValues: { key: "", code: "", verify: 1 },
  });
  const [qrCode, setQrCode] = useState("");
  const { handleSubmit, setError, setValue } = methods;

  useEffect(() => {
    const init = async () => {
      const { status, data } = await axiosInstance("api/user/twofa");
      if (status === 200) {
        setValue("key", data.key);
        setQrCode(data.qr);
      }
    };

    if (open) {
      init();
    }
  }, [open]);

  const enable = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));
    try {
      const { status, data } = await axiosInstance.post(
        "api/user/enable-twofa",
        reqData
      );

      if (status === 200) {
        getUser();
        cb();
        methods.reset();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      setError("code", { message: err.message });
      Object.values(err.errors).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  return { methods, qrCode, onSubmit: handleSubmit(enable) };
};

export default useEnable;
