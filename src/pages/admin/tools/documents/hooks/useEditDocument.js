import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import genDocData from "../../utils/genDocData";
import useGetDocumentById from "./useGetDocumentById";

const useEditDocument = (id, cb) => {
  const methods = useGetDocumentById(id);
  const handleErrors = useErrors();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = genDocData(inputData);
    reqData.append("_method", "PUT");
    try {
      const { data, status } = await axiosInstance.post(
        `api/admin/tool-documents/${id}`,
        reqData
      );

      if (status === 200) {
        cb();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      handleErrors(err);
    }
  };
  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useEditDocument;
