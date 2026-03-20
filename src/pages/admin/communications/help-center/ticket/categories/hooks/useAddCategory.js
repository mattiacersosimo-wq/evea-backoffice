import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useCategoriesForm from "./useCategoriesForm";

const useAddCategory = (cb) => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useCategoriesForm();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );

    try {
      const { status, data: resData } = await axiosInstance({
        method: "post",
        url: "/api/admin/support-ticket-categories",
        data: reqData,
      });
      if (status === 200) {
        cb();
        enqueueSnackbar(resData.message);
      }
    } catch (error) {
      Object.values(error.errors).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddCategory;
