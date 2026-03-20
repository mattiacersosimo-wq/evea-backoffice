import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useGetPackages from "./use-get-packages";

const useUpdate = () => {
  const { methods, field } = useGetPackages();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (inputData) => {
    const serializedData = inputData?.package?.map(
      ({ product_id, percentage }) => ({
        product_id,
        percentage,
      })
    );

    const jsonReqData = JSON.stringify(serializedData);
    const reqData = new FormData();

    reqData.append("data", jsonReqData);

    try {
      const { data } = await axiosInstance.post(
        "api/admin/update-package",
        reqData
      );
      const { status, message } = data;
      if (status) {
        enqueueSnackbar(message);
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  });

  return { methods, field, onSubmit };
};

export default useUpdate;
