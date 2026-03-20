import { useEffect } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useDocumentForm from "./useDocumentForm";

const useGetDocumentById = (id) => {
  const methods = useDocumentForm();
  const handleError = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          `/api/admin/tool-documents/${id}`
        );
        if (status === 200) {
          const { title, sort_order, doc_url } = data.data;
          methods.reset({ document_url: doc_url, sort_order, title });
        }
      } catch (err) {
        handleError(err);
      }
    };

    if (id) fetchData();
  }, [id]);

  return methods;
};

export default useGetDocumentById;
