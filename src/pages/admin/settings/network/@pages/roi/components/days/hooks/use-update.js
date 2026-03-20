import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useGetDays from "./use-get-days";

const useUpdate = () => {
  const { field, methods } = useGetDays();
  const { handleSubmit } = methods;
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = handleSubmit(async ({ day }) => {
    const reqData = new FormData();
    day.forEach(({ did, active }) => {
      if (active) reqData.append("roi_open_days[]", did);
    });

    reqData.append("_method", "PUT");

    try {
      const { data } = await axiosInstance.post(
        "api/admin/update-roi-days",
        reqData
      );
      const { status, message } = data;
      if (status) {
        enqueueSnackbar(message);
      }
    } catch (err) {
      if (err.errors) {
        Object.values(err.errors).flatMap((item) =>
          enqueueSnackbar(item, { variant: "error" })
        );
      } else {
        enqueueSnackbar(err.message, { variant: "error" });
      }
    }
  });

  return { onSubmit, methods, field };
};

export default useUpdate;
