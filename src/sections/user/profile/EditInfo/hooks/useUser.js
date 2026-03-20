import { useSnackbar } from "notistack";
import { useEffect } from "react";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";
import useUserForm from "./useUserForm";

const useUser = () => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useUserForm();
  const { user, getUser } = useAuth();

  const onSubmit = async (inputData) => {
    try {
      const { status, data } = await axiosInstance.post(
        "/api/profile",
        genReqData(inputData)
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        getUser();
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  useEffect(() => {
    methods.reset({
      username: user.username,
      ...user?.user_profile,
      email: user.email,
      social: {
        scope_email: user?.user_profile?.scope_email,
        scope_facebook: user?.user_profile?.scope_facebook,
        scope_instagram: user?.user_profile?.scope_instagram,
        scope_medium: user?.user_profile?.scope_medium,
        scope_phone: user?.user_profile?.scope_phone,
        scope_telegram: user?.user_profile?.scope_telegram,
        scope_twitter: user?.user_profile?.scope_twitter,
        scope_whatsapp: user?.user_profile?.scope_whatsapp,
      },
    });
  }, [user]);

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

const genReqData = (inputData) => {
  const { social, ...rest } = inputData;
  const reqData = new FormData();
  Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));
  Object.entries(social).forEach(([key, value]) =>
    reqData.append(key, value ? 1 : 0)
  );
  reqData.append("_method", "PUT");

  return reqData;
};

export default useUser;
