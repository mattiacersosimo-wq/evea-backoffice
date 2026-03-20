import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useTimeOut from "src/components/timeout/hooks/useTimeOut";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";

const useGetDoc = () => {
  const [documents, setDocuments] = useState([]);
  const [state, actions] = useDataHandler();
  const handleErrors = useErrors();
  const [timeOut, setTimeOut] = useTimeOut(documents.length);

  const { count, onChange, page, seed, rowStart } = usePagination();
  const fetchData = async (page = 1) => {
    setDocuments([]);
    setTimeOut(false);
    actions.loading();
    try {
      const { status, data } = await (
        await fetchUser(`user-documents?page=${page}`)
      ).data;
      if (status) {
        const { data: document, last_page, from } = data;
        seed(last_page, from);
        setDocuments(document);
        actions.success(document);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };
  useEffect(() => {
    fetchData(page);
  }, [page]);
  return { state, documents, page, count, onChange, rowStart, timeOut };
};
export default useGetDoc;
