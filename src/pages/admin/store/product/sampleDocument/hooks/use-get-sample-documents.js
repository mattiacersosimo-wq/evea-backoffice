import { useEffect } from "react";
import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useGetSampleDocuments = () => {
  const [state, actions] = useDataHandler();
  const { pid } = useParams();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const fetchDocs = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/product-sample-docs/${pid}`,
        {
          params: { page },
        }
      );
      const { status, data: sampleDocs } = data;

      if (status) {
        const { last_page, from, data: list } = sampleDocs;
        seed(last_page, from);
        onChange(null, page);
        actions.success(list);
      } else {
        actions.success([]);
      }
    } catch (err) {
      actions.error();
      console.log(err);
    }
  };
  useEffect(() => {
    fetchDocs(page);
  }, [pid, page]);

  return { state, fetchDocs, count, onChange, page, rowStart };
};

export default useGetSampleDocuments;
