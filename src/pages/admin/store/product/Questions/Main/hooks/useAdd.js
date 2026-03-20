import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import { useParams } from "react-router-dom";
import useQuestionForm from "./useQuestionForm";

const useAddQuestion = (cb) => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useQuestionForm();
  const { pid } = useParams();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );
    reqData.append("product_id", pid);

    try {
      const { status, data: resData } = await axiosInstance({
        method: "post",
        url: "/api/admin/product-question/",
        data: reqData,
      });
      if (status === 200) {
        cb();
        enqueueSnackbar(resData.message);
      }
    } catch (error) {
      Object.values(error).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddQuestion;
