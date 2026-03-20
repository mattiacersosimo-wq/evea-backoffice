import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axiosInstance from "src/utils/axios";
import { setSession } from "src/utils/jwt";
import * as Yup from "yup";
import useSetPlan from "../../../hooks/use-set-plan";

const schema = Yup.object().shape({
  code: Yup.string().required("OTP is required"),
});

const defaultValues = {
  email: "",
  password: "",
  key: "",
  code: "",
  verify: 1,
  secret: "",
};

const useTwoFactorAuthentication = (loginData) => {
  const setPlan = useSetPlan();
  const { password, secret, email, plan } = loginData;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });
  const { setValue } = methods;

  useEffect(() => {
    if (secret) {
      setValue("key", secret);
      setValue("secret", secret);
      setValue("email", email);
      setValue("password", password);
      setValue("plan", plan);
    }
  }, [secret, password, email]);
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));

    try {
      const { data, status } = await axiosInstance.post(
        "api/twofaverify",
        reqData
      );
      if (status === 200) {
        localStorage.setItem("menu", JSON.stringify(data?.menu_lists));
        localStorage.setItem("isAdmin", Boolean(data?.user?.is_super_admin));
        localStorage.setItem("isSubAdmin", Boolean(data?.user?.is_sub_admin));
        setPlan(plan);
        setSession(data.access_token);
        navigate(0);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useTwoFactorAuthentication;
