import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useGetCategoryById from "./useGetCategoryById";

const useEditCategory = (id, cb) => {
  const methods = useGetCategoryById(id);
  const handleErrors = useErrors();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();

    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );
    reqData.append("_method", "PUT");

    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/support-ticket-categories/${id}`,
        reqData
      );
      if (status === 200) {
        cb();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      Object.values(err.errors).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };
  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useEditCategory;
