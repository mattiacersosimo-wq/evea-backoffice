import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useGetData from "./use-get-data";

const useUpdate = (id, onSuccess) => {
  const methods = useGetData(id);
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = methods.handleSubmit(
    async ({ input_options, ...inputData }) => {
      const reqData = new FormData();

      Object.entries({ ...inputData, _method: "PUT" }).forEach(([k, v]) =>
        reqData.append(k, v)
      );
      reqData.append("input_options", JSON.stringify(input_options));
      try {
        const { data } = await axiosInstance.post(
          `api/admin/registration-settings/${id}`,
          reqData
        );
        onSuccess();
        enqueueSnackbar(data.message);
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
        if (err.errors) {
          Object.entries(err.errors).forEach(([k, v]) =>
            methods.setError(k, { message: v.find(Boolean) })
          );
        }
      }
    }
  );

  return { methods, onSubmit };
};

export default useUpdate;
