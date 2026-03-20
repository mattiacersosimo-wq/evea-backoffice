import axiosInstance from "src/utils/axios";
import useAddCategory, { defaultValues } from "./useAddCategory";
import { useSnackbar } from "notistack";

const useAddDialog = (cd) => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useAddCategory();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );
    try {
      const { status, data } = await axiosInstance.post(
        "api/admin/blog-categories",
        reqData
      );

      if (status === 200) {
        cd();
        methods.reset(defaultValues);
        enqueueSnackbar(data.message);
      }
    } catch (errors) {
      Object.entries(errors.errors).forEach(([k, v]) =>
        methods.setError(k, { message: v[0] })
      );

      console.error(errors);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddDialog;
