import { useSnackbar } from "notistack";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useCannedResponseForm from "./useCannedResponseForm";

const useGetCannedResponseById = (id) => {
  const methods = useCannedResponseForm();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          `/api/admin/support-ticket-canned-responses/${id}`
        );
        if (status === 200) {
          const { title, subject, message, active } = data.data;
          methods.reset({
            title,
            subject,
            message,
            active,
          });
        }
      } catch (err) {
        Object.values(err).flatMap((item) =>
          enqueueSnackbar(item, { variant: "error" })
        );
      }
    };

    if (id) fetchData();
  }, [id]);

  return methods;
};

export default useGetCannedResponseById;
