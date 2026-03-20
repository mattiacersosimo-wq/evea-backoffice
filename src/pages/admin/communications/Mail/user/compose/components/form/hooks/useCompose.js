import { useSnackbar } from "notistack";
import { useNavigate, useOutletContext } from "react-router";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useComposeForm from "./useComposeForm";

const genReqData = (data) => {
  const reqData = new FormData();
  const { to_users_id, ranks, products, attachments, ...rest } = data;
  Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));
  if (to_users_id.length)
    to_users_id.map((item) => reqData.append("to_users_id[]", item));
  if (products.length)
    products.map((item) => reqData.append("products[]", item));
  if (ranks.length) ranks.map((item) => reqData.append("ranks[]", item));

  // if (attachments) reqData.append("attachments[]", attachments[0]);

  return reqData;
};

const useCompose = (emailEditorRef) => {
  const { fetchData } = useOutletContext();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useComposeForm();
  const handleErrors = useErrors();
  const navigate = useNavigate();
  const onSubmit = async (inputData) => {
    const URL = "api/user/emails-user";
    emailEditorRef.current.editor.exportHtml(async (data) => {
      const reqData = genReqData(inputData);
      const { html } = data;
      reqData.append("message", html);
      try {
        const { data, status } = await axiosInstance.post(URL, reqData);
        if (status === 200) {
          enqueueSnackbar(data.message);
          fetchData();
          navigate(-1);
        }
      } catch (err) {
        handleErrors(err);
      }
    });
  };
  return { onSubmit: methods.handleSubmit(onSubmit), methods };
};
export default useCompose;
