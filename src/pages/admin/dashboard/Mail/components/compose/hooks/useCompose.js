import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useComposeForm from "./useComposeForm";

const genReqData = (data) => {
  const reqData = new FormData();
  const { to_users_id, attachments, ...rest } = data;
  Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));
  if (to_users_id)
    to_users_id.map((item) => reqData.append("to_users_id[]", item));
  if (attachments) reqData.append("attachments[]", attachments[0]);

  return reqData;
};

const useCompose = () => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useComposeForm();

  const handleErrors = useErrors();
  const onSubmit = async (inputData) => {
    const URL = true ? "api/admin/mail" : "api/user/emails-user";
    const reqData = genReqData(inputData);
    try {
      const { data, status } = await axiosInstance.post(URL, reqData);
      if (status === 200) {
        enqueueSnackbar(data.message);
        // handleClose();
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  return { onSubmit: methods.handleSubmit(onSubmit), methods };
};
export default useCompose;
