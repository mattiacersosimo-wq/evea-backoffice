import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import genFaqReqData from "../../utils/genFaqReqData";
import useFaqForm from "./useFaqForm";

const useFaqAdd = (onSuccess) => {
  const methods = useFaqForm();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    try {
      const { status, data } = await axiosInstance({
        method: "post",
        url: "/api/admin/faq",
        data: genFaqReqData(inputData),
      });
      if (status === 200) {
        onSuccess();
        enqueueSnackbar(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useFaqAdd;
