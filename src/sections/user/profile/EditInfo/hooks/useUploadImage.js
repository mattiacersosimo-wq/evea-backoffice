import { useSnackbar } from "notistack";
import { useCallback } from "react";
import useAuth from "src/hooks/useAuth";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import { defaultValues } from "src/sections/user/profile/EditInfo/hooks/useUserForm.js";

const useUploadImage = (methods) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();
  const { setProfileImage, getUser } = useAuth();

  const uploadImage = async (file) => {
    try {
      const { status, data } = await axiosInstance.post(
        "/api/profile-image",
        genReqData(file)
      );

      if (status === 200) {
        enqueueSnackbar(data.message);
        setProfileImage(data.url);
        methods.reset(defaultValues);
        getUser();
      }
    } catch (error) {
      handleErrors(error);
    }
  };
  return useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      uploadImage(file);
    }
  }, []);
};

const genReqData = (file) => {
  const reqData = new FormData();
  reqData.append("profile_image", file);
  reqData.append("_method", "PUT");
  return reqData;
};

export default useUploadImage;
