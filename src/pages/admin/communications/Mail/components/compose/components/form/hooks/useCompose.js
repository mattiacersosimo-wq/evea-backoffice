import { useSnackbar } from "notistack";
import { useNavigate, useOutletContext } from "react-router";
import useAuth from "src/hooks/useAuth";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useComposeForm from "./useComposeForm";

const genReqData = (data, userId) => {
  const reqData = new FormData();
  const { to_users_id, ranks, products, attachments, ...rest } = data;
  Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));
  if (userId) {
    reqData.append("to_users_id[]", userId);
  } else {
    if (to_users_id.length)
      to_users_id.map((item) => reqData.append("to_users_id[]", item));
  }

  if (products.length)
    products.map((item) => reqData.append("products[]", item));
  if (ranks.length) ranks.map((item) => reqData.append("ranks[]", item));

  return reqData;
};

const useCompose = (userId) => {
  const { fetchData } = useOutletContext();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useComposeForm(userId);
  const handleErrors = useErrors();
  const { isAdmin, isSubAdmin } = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (inputData) => {
    const URL = isAdmin || isSubAdmin ? "api/admin/mail" : "api/user/mail";
    const reqData = genReqData(inputData, userId);
    try {
      const { data, status } = await axiosInstance.post(URL, reqData);
      if (status === 200) {
        enqueueSnackbar(data.message);
        fetchData();
        navigate(-1);
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      handleErrors(err);
    }
  };
  return { onSubmit: methods.handleSubmit(onSubmit), methods };
};
export default useCompose;
