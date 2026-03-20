import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useGetArticleById from "./useGetArticleById";

const useEditArticle = (id, cb) => {
  const methods = useGetArticleById(id);
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();

    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );
    reqData.append("_method", "PUT");
    const { status, data } = await axiosInstance.post(
      `api/admin/articles/${id}`,
      reqData
    );

    if (status === 200) {
      cb();
      enqueueSnackbar(data.message);
    }
    try {
    } catch (err) {
      Object.values(err).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useEditArticle;
