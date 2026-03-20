import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import useErrors from "src/hooks/useErrors";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import useTicketForm from "../../hooks/useTicketForm";

const useAddTicket = () => {
  const methods = useTicketForm();
  const handleErrors = useErrors();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    const { attachments_url, ...rest } = inputData;

    Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));
    if (Boolean(attachments_url.length)) {
      reqData.append("attachments_url", attachments_url[0]);
    }
    try {
      const { data, status } = await axiosInstance.post(
        "api/admin/support-tickets",
        reqData
      );
      if (status === 200) {
        navigate(PATH_DASHBOARD.communication.help_center);
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      handleErrors(err);
    }
  };
  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddTicket;
