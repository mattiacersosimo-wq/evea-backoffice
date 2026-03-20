import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";

const useTurnOfEmail = (id) => {
  const { enqueueSnackbar } = useSnackbar();
  const turnOfMail = async () => {
    try {
      const { data, status } = await axiosInstance(
        `api/admin/change-email-status/${id}`
      );

      if (status === 200) {
        enqueueSnackbar(data.message);
        return true;
      }
      return false;
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return turnOfMail;
};

export default useTurnOfEmail;
