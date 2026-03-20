import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import genDocData from "../../utils/genDocData";
import useDocumentForm, { documentFormDefaultValues } from "./useDocumentForm";

const useDocumentAdd = (cb) => {
  const methods = useDocumentForm();
  const { enqueueSnackbar } = useSnackbar();
  const handleError = useErrors();
  const onSubmit = async (data) => {
    if (!data.document_url.length) {
      methods.setError("document_url", "Document is required");
      return;
    }
    const URI = "/api/admin/tool-documents/";

    try {
      const { status, data: resData } = await axiosInstance.post(
        URI,
        genDocData(data)
      );

      if (status === 200) {
        cb();
        enqueueSnackbar(resData.message);
        methods.reset(documentFormDefaultValues);
      }
    } catch (err) {
      console.log(err);
      handleError(err);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useDocumentAdd;
