import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useGetLeadsById from "./use-get-leads-by-id";

const useUpdateLead = (open, cb = () => null) => {
  const methods = useGetLeadsById(open);
  const { handleSubmit, setError } = methods;
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = handleSubmit(async (inputData) => {
    const reqData = new FormData();

    Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));

    reqData.append("_method", "PUT");

    try {
      const { data } = await axiosInstance.post(
        `/api/admin/lead-capture/${open}`,
        reqData
      );

      const { status, message } = data;
      if (status) {
        cb();
        enqueueSnackbar(message);
      }
    } catch (err) {
      Object.entries(err.errors).forEach(([k, v]) =>
        setError(k, { message: v[0] })
      );
    }
  });

  return { onSubmit, methods };
};

export default useUpdateLead;
