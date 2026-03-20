import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useFetchDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [state, actions] = useDataHandler();
  const { pid } = useParams();
  const { count, onChange, page, seed } = usePagination();
  const handleErrors = useErrors();
  const fetchData = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance(`api/admin/product-docs/${pid}`, {
        params: { page },
      });

      const { status, data: documents } = data;
      if (status) {
        const { last_page, from, data: list } = documents;
        seed(last_page, from);
        actions.success(list);
        setDocuments(list);
      } else {
        actions.success([]);
      }
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [pid, page]);

  return { state, documents, fetchData, count, onChange, page };
};

export default useFetchDocuments;
