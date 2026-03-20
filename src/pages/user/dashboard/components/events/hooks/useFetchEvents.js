import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";

const useFetchEvents = () => {
  const [state, actions] = useDataHandler();

  const { id } = useParams();
  const { count, onChange, page, seed } = usePagination();
  const [data, setData] = useState([]);
  const handleErrors = useErrors();
  const fetchData = async (page = 1) => {
    actions.loading();
    const params = {
      page,
    };
    if (Boolean(parseInt(id))) {
      params.product_id = id;
    }

    try {
      const { status, data } = await (
        await fetchUser(`events-list`, {
          params,
        })
      ).data;

      if (status) {
        if (Boolean(data.length)) {
          setData(data);
          return;
        }
        actions.success();
        // const { data: list, last_page, from } = data;
        // seed(last_page, from);
      }
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return { state, actions, data, count, onChange, page };
};

export default useFetchEvents;
