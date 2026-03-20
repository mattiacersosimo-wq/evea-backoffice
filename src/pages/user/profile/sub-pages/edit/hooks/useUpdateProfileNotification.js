import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useProfileNotificationSettingsForm from "./useProfileNotificationSettingsForm";

const genReqData = (inputData) => {
  const { twofa, ...rest } = inputData;
  const reqData = new FormData();

  const testData = Object.entries(rest)
    .map(([key, value]) => value && key)
    .filter((v) => v);

  reqData.append("2fa", twofa ? 1 : 0);
  reqData.append("email_notification_settings", JSON.stringify(testData));
  reqData.append("_method", "PUT");

  return reqData;
};

const useUpdateProfileNotification = () => {
  const methods = useProfileNotificationSettingsForm();
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();

  const onSubmit = async (inputData) => {
    try {
      const { status, data } = await axiosInstance.post(
        "/api/profile-fa-emailsettings",
        genReqData(inputData)
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useUpdateProfileNotification;
