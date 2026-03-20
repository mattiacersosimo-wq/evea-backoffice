import { useSnackbar } from "notistack";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/utils/axios";
import useGetTicketById from "./useGetTicketById";
import { PATH_DASHBOARD } from "src/routes/paths";

const useUpdateTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { methods, ticketNumber } = useGetTicketById();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    [...Object.entries(inputData)].forEach(([key, value]) =>
      reqData.append(key, value)
    );
    reqData.append("active", 1);
    reqData.append("_method", "PUT");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/support-tickets/${id}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        navigate(PATH_DASHBOARD.communication.help_center);
      }
    } catch (err) {
      Object.values(err.errors).flatMap((item) =>
        enqueueSnackbar(item, {
          variant: "error",
        })
      );
    }
  };
  return { methods, onSubmit: methods.handleSubmit(onSubmit), ticketNumber };
};

export default useUpdateTicket;
